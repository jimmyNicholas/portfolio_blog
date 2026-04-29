"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  Dataset,
  TranscriptConversation,
  TranscriptMessage,
  Speaker,
  TranscriptPayload,
} from "./types";

const DATASET_ORDER: Dataset[] = ["creatives", "scientists", "workforce"];
const DATASET_LABELS: Record<Dataset, string> = {
  creatives: "Creatives",
  scientists: "Scientist",
  workforce: "Workforce",
};
const DATASET_PREFIX: Record<Dataset, string> = {
  creatives: "C",
  scientists: "S",
  workforce: "W",
};
const SELECTED_CHIPS_PER_ROW = 10;
const SELECTED_CHIPS_PER_PAGE = 20;
const COPY_SEPARATOR = "\n\n###############################################################\n\n";
const QUERY_PARAM_KEYS = {
  and: "and",
  or: "or",
  not: "not",
  datasets: "ds",
  mode: "mode",
  selected: "sel",
  focus: "focus",
} as const;

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type SearchTerms = {
  and: string;
  or: string;
  not: string;
};

type StatsViewMode = "text" | "pie";

type PieSegment = {
  label: string;
  value: number;
  color: string;
};

type ParsedUrlState = {
  searchTerms: SearchTerms;
  datasets: Set<Dataset>;
  mode: StatsViewMode;
  selectedShorthandIds: string[];
  focusMode: boolean;
};

function parseConversationNumericSuffix(conversationId: string) {
  const numericMatch = conversationId.match(/_(\d+)$/);
  if (!numericMatch) return null;
  return Number.parseInt(numericMatch[1], 10);
}

function toConversationShorthand(conversation: TranscriptConversation) {
  const prefix = DATASET_PREFIX[conversation.dataset] ?? "?";
  const suffix = parseConversationNumericSuffix(conversation.id);
  if (suffix === null) return null;
  return `${prefix}${suffix}`;
}

function parseDatasetsFromUrl(rawValue: string | null) {
  if (!rawValue?.trim()) return new Set(DATASET_ORDER);
  const next = new Set<Dataset>();
  for (const token of rawValue.split(",")) {
    const trimmed = token.trim();
    if (trimmed === "creatives" || trimmed === "scientists" || trimmed === "workforce") {
      next.add(trimmed);
    }
  }
  return next.size > 0 ? next : new Set(DATASET_ORDER);
}

function parseModeFromUrl(rawValue: string | null): StatsViewMode {
  return rawValue === "pie" ? "pie" : "text";
}

function parseFocusFromUrl(rawValue: string | null) {
  return rawValue === "1";
}

function parseSelectedShorthandFromUrl(rawValue: string | null) {
  if (!rawValue?.trim()) return [];
  const unique = new Set<string>();
  for (const token of rawValue.split(",")) {
    const normalized = token.trim().toUpperCase();
    if (!normalized) continue;
    if (/^[CSW]\d+$/.test(normalized)) unique.add(normalized);
  }
  return Array.from(unique);
}

function parseUrlState(search: string): ParsedUrlState {
  const params = new URLSearchParams(search);
  return {
    searchTerms: {
      and: params.get(QUERY_PARAM_KEYS.and) ?? "",
      or: params.get(QUERY_PARAM_KEYS.or) ?? "",
      not: params.get(QUERY_PARAM_KEYS.not) ?? "",
    },
    datasets: parseDatasetsFromUrl(params.get(QUERY_PARAM_KEYS.datasets)),
    mode: parseModeFromUrl(params.get(QUERY_PARAM_KEYS.mode)),
    selectedShorthandIds: parseSelectedShorthandFromUrl(params.get(QUERY_PARAM_KEYS.selected)),
    focusMode: parseFocusFromUrl(params.get(QUERY_PARAM_KEYS.focus)),
  };
}

function getPositiveTerms(searchTerms: SearchTerms) {
  const terms: string[] = [];

  // Add AND terms
  if (searchTerms.and.trim()) {
    terms.push(...searchTerms.and.split(',').map(t => t.trim()).filter(t => t));
  }

  // Add OR terms
  if (searchTerms.or.trim()) {
    terms.push(...searchTerms.or.split(',').map(t => t.trim()).filter(t => t));
  }

  return terms;
}

function evaluateBooleanMatch(inputText: string, searchTerms: SearchTerms) {
  const text = inputText.toLowerCase();

  // Parse comma-separated terms
  const andTerms = searchTerms.and.split(',').map(t => t.trim()).filter(t => t);
  const orTerms = searchTerms.or.split(',').map(t => t.trim()).filter(t => t);
  const notTerms = searchTerms.not.split(',').map(t => t.trim()).filter(t => t);

  // If no search terms, show everything
  if (andTerms.length === 0 && orTerms.length === 0 && notTerms.length === 0) {
    return true;
  }

  // Check AND terms: ALL must be present
  const andMatch = andTerms.length === 0 || andTerms.every(term =>
    text.includes(term.toLowerCase())
  );

  // Check OR terms: ANY must be present (if OR terms exist)
  const orMatch = orTerms.length === 0 || orTerms.some(term =>
    text.includes(term.toLowerCase())
  );

  // Check NOT terms: NONE can be present
  const notMatch = notTerms.every(term =>
    !text.includes(term.toLowerCase())
  );

  return andMatch && orMatch && notMatch;
}

function getTextMatchesCount(text: string, terms: string[]) {
  if (!terms.length) return 0;
  return terms.reduce((count, term) => {
    const regex = new RegExp(escapeRegex(term), "gi");
    const matches = text.match(regex);
    return count + (matches?.length ?? 0);
  }, 0);
}

function renderHighlightedText(
  text: string,
  terms: string[],
  registerMatch: (globalMatchIndex: number, element: HTMLSpanElement | null) => void,
  startingMatchIndex: number,
) {
  if (!terms.length) return { content: text };

  const pattern = terms.map((term) => escapeRegex(term)).join("|");
  if (!pattern) return { content: text };
  const regex = new RegExp(`(${pattern})`, "gi");
  const segments = text.split(regex);
  let localMatchCount = 0;

  return {
    content: segments.map((segment, index) => {
      if (!segment) return null;
      const isMatch = terms.some(
        (term) => segment.toLowerCase() === term.toLowerCase(),
      );
      if (!isMatch) {
        return <span key={`text-${index}`}>{segment}</span>;
      }
      const currentGlobalIndex = startingMatchIndex + localMatchCount;
      localMatchCount += 1;
      return (
        <mark
          key={`match-${index}`}
          ref={(el) => registerMatch(currentGlobalIndex, el)}
          className="rounded px-0.5 bg-yellow-300 text-black"
        >
          {segment}
        </mark>
      );
    }),
  };
}

const messageStyleBySpeaker: Record<Speaker, string> = {
  ai: "border-blue-500/60 bg-blue-500/10",
  user: "border-green-500/60 bg-green-500/10",
  other: "border-secondary bg-[color:var(--palette-background)]/30",
};

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

function describePieSlice(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

function StatsPie({
  title,
  total,
  segments,
}: {
  title: string;
  total: number;
  segments: PieSegment[];
}) {
  const size = 104;
  const center = size / 2;
  const radius = 42;

  let runningAngle = 0;
  const slices = segments
    .filter((segment) => segment.value > 0)
    .map((segment) => {
      const angle = total > 0 ? (segment.value / total) * 360 : 0;
      const startAngle = runningAngle;
      const endAngle = runningAngle + angle;
      runningAngle = endAngle;
      return {
        ...segment,
        path: describePieSlice(center, center, radius, startAngle, endAngle),
      };
    });

  const pct = (value: number) =>
    total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="rounded-xl border border-secondary p-2">
      <p className="text-xs font-semibold text-themed mb-2">{title}</p>
      <div className="flex items-center gap-3">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="color-mix(in srgb, var(--palette-secondary) 45%, transparent)"
            strokeWidth="1.5"
          />
          {slices.map((slice) => (
            <path key={slice.label} d={slice.path} fill={slice.color} />
          ))}
          <circle
            cx={center}
            cy={center}
            r={20}
            fill="color-mix(in srgb, var(--palette-background) 90%, transparent)"
          />
          <text
            x={center}
            y={center + 4}
            textAnchor="middle"
            className="fill-current text-[10px] text-themed"
            style={{ fontSize: "10px" }}
          >
            {total}
          </text>
        </svg>

        <div className="flex-1 min-w-0 space-y-1 text-[11px]">
          {segments.map((segment) => (
            <p key={segment.label} className="text-secondary break-words">
              <span
                className="inline-block w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: segment.color }}
              />
              {segment.label}: {segment.value} ({pct(segment.value)}%)
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TranscriptViewer() {
  const [payload, setPayload] = useState<TranscriptPayload | null>(null);
  const [selectedDatasets, setSelectedDatasets] = useState<Set<Dataset>>(
    new Set(DATASET_ORDER),
  );
  const [searchTerms, setSearchTerms] = useState<SearchTerms>({
    and: "",
    or: "",
    not: "",
  });
  const [selectedId, setSelectedId] = useState<string>("");
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState("");
  const [statsViewMode, setStatsViewMode] = useState<StatsViewMode>("text");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [selectedConversationIds, setSelectedConversationIds] = useState<string[]>([]);
  const [selectedChipPage, setSelectedChipPage] = useState(0);
  const [isUrlHydrated, setIsUrlHydrated] = useState(false);
  const [pendingSelectedShorthandIds, setPendingSelectedShorthandIds] = useState<string[]>([]);
  const matchRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const shorthandToFullConversationId = useMemo(() => {
    const map = new Map<string, string>();
    if (!payload) return map;
    for (const conversation of payload.conversations) {
      const shorthand = toConversationShorthand(conversation);
      if (shorthand && !map.has(shorthand)) {
        map.set(shorthand, conversation.id);
      }
    }
    return map;
  }, [payload]);

  const selectedConversationShorthandIds = useMemo(() => {
    if (!payload) return [];
    const conversationsById = new Map<string, TranscriptConversation>();
    for (const conversation of payload.conversations) {
      conversationsById.set(conversation.id, conversation);
    }
    const values: string[] = [];
    for (const conversationId of selectedConversationIds) {
      const conversation = conversationsById.get(conversationId);
      if (!conversation) continue;
      const shorthand = toConversationShorthand(conversation);
      if (shorthand) values.push(shorthand);
    }
    return values;
  }, [payload, selectedConversationIds]);

  const applyParsedUrlState = useCallback(
    (parsedState: ParsedUrlState) => {
      setSearchTerms(parsedState.searchTerms);
      setSelectedDatasets(parsedState.datasets);
      setStatsViewMode(parsedState.mode);
      setIsFocusMode(parsedState.focusMode);
      setPendingSelectedShorthandIds(parsedState.selectedShorthandIds);
      if (parsedState.selectedShorthandIds.length === 0) {
        setSelectedConversationIds([]);
      }
    },
    [],
  );

  useEffect(() => {
    applyParsedUrlState(parseUrlState(window.location.search));
    setIsUrlHydrated(true);
  }, [applyParsedUrlState]);

  const positiveTerms = useMemo(() => getPositiveTerms(searchTerms), [searchTerms]);

  useEffect(() => {
    let cancelled = false;
    const loadTranscripts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data/transcripts.json");
        if (!response.ok) {
          throw new Error("Could not load transcripts. Run `npm run transcripts:build`.");
        }
        const data = (await response.json()) as TranscriptPayload;
        if (!cancelled) {
          setPayload(data);
          setSelectedId(data.conversations[0]?.id ?? "");
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load transcripts.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void loadTranscripts();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredConversations = useMemo(() => {
    if (!payload) return [];
    return payload.conversations.filter((conversation) => {
      if (!selectedDatasets.has(conversation.dataset)) return false;
      const searchableConversationText = `${conversation.id} ${conversation.searchableText}`;
      return evaluateBooleanMatch(searchableConversationText, searchTerms);
    });
  }, [payload, searchTerms, selectedDatasets]);

  const allConversationsById = useMemo(() => {
    const map = new Map<string, TranscriptConversation>();
    if (!payload) return map;
    for (const conversation of payload.conversations) {
      map.set(conversation.id, conversation);
    }
    return map;
  }, [payload]);

  useEffect(() => {
    if (!pendingSelectedShorthandIds.length) return;
    const resolved = pendingSelectedShorthandIds
      .map((shorthand) => shorthandToFullConversationId.get(shorthand))
      .filter((value): value is string => Boolean(value));
    setSelectedConversationIds(resolved);
    setPendingSelectedShorthandIds([]);
  }, [pendingSelectedShorthandIds, shorthandToFullConversationId]);

  const sidebarStats = useMemo(() => {
    const totalConversations = filteredConversations.length;
    const datasetCounts: Record<Dataset, number> = {
      creatives: 0,
      scientists: 0,
      workforce: 0,
    };
    let aiTermHits = 0;
    let userTermHits = 0;

    for (const conversation of filteredConversations) {
      datasetCounts[conversation.dataset] += 1;
      for (const message of conversation.messages) {
        const termHits = getTextMatchesCount(message.text, positiveTerms);
        if (termHits === 0) continue;
        if (message.speaker === "ai") aiTermHits += termHits;
        if (message.speaker === "user") userTermHits += termHits;
      }
    }

    const totalEntries = aiTermHits + userTermHits;
    const pct = (count: number, total: number) =>
      total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";

    return {
      totalConversations,
      datasetCounts,
      aiTermHits,
      userTermHits,
      totalEntries,
      datasetPct: {
        creatives: pct(datasetCounts.creatives, totalConversations),
        scientists: pct(datasetCounts.scientists, totalConversations),
        workforce: pct(datasetCounts.workforce, totalConversations),
      },
      speakerPct: {
        ai: pct(aiTermHits, totalEntries),
        user: pct(userTermHits, totalEntries),
      },
    };
  }, [filteredConversations, positiveTerms]);

  useEffect(() => {
    if (!payload || payload.conversations.length === 0) {
      setSelectedId("");
      return;
    }
    if (!selectedId || !allConversationsById.has(selectedId)) {
      setSelectedId(filteredConversations[0]?.id ?? payload.conversations[0].id);
    }
  }, [allConversationsById, filteredConversations, payload, selectedId]);

  const selectedConversation = useMemo(() => {
    if (!selectedId) return null;
    return allConversationsById.get(selectedId) ?? null;
  }, [allConversationsById, selectedId]);

  useEffect(() => {
    setSelectedConversationIds((current) =>
      current.filter((id) => allConversationsById.has(id)),
    );
  }, [allConversationsById]);

  useEffect(() => {
    const onPopState = () => {
      applyParsedUrlState(parseUrlState(window.location.search));
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [applyParsedUrlState]);

  useEffect(() => {
    if (!isUrlHydrated) return;

    const params = new URLSearchParams();
    if (searchTerms.and.trim()) params.set(QUERY_PARAM_KEYS.and, searchTerms.and);
    if (searchTerms.or.trim()) params.set(QUERY_PARAM_KEYS.or, searchTerms.or);
    if (searchTerms.not.trim()) params.set(QUERY_PARAM_KEYS.not, searchTerms.not);

    const orderedDatasets = DATASET_ORDER.filter((dataset) => selectedDatasets.has(dataset));
    if (orderedDatasets.length > 0 && orderedDatasets.length < DATASET_ORDER.length) {
      params.set(QUERY_PARAM_KEYS.datasets, orderedDatasets.join(","));
    }

    if (statsViewMode !== "text") params.set(QUERY_PARAM_KEYS.mode, statsViewMode);
    if (selectedConversationShorthandIds.length > 0) {
      params.set(QUERY_PARAM_KEYS.selected, selectedConversationShorthandIds.join(","));
    }
    if (isFocusMode) params.set(QUERY_PARAM_KEYS.focus, "1");

    const query = params.toString();
    const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (nextUrl !== currentUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [
    isFocusMode,
    isUrlHydrated,
    searchTerms,
    selectedConversationShorthandIds,
    selectedDatasets,
    statsViewMode,
  ]);

  const selectedConversations = useMemo(() => {
    return selectedConversationIds
      .map((id) => allConversationsById.get(id))
      .filter((conversation): conversation is TranscriptConversation => Boolean(conversation));
  }, [allConversationsById, selectedConversationIds]);

  const selectedChipPageCount = Math.max(
    1,
    Math.ceil(selectedConversations.length / SELECTED_CHIPS_PER_PAGE),
  );

  useEffect(() => {
    setSelectedChipPage((current) => Math.min(current, selectedChipPageCount - 1));
  }, [selectedChipPageCount]);

  const selectedPageConversations = useMemo(() => {
    const start = selectedChipPage * SELECTED_CHIPS_PER_PAGE;
    return selectedConversations.slice(start, start + SELECTED_CHIPS_PER_PAGE);
  }, [selectedChipPage, selectedConversations]);

  const selectedRowOne = selectedPageConversations.slice(0, SELECTED_CHIPS_PER_ROW);
  const selectedRowTwo = selectedPageConversations.slice(
    SELECTED_CHIPS_PER_ROW,
    SELECTED_CHIPS_PER_PAGE,
  );

  const visibleMessages = useMemo(() => {
    if (!selectedConversation) return [];
    // Show ALL messages from the selected conversation (no filtering)
    return selectedConversation.messages;
  }, [selectedConversation]);

  const totalMatchCount = useMemo(() => {
    return visibleMessages.reduce((count, message) => {
      return count + getTextMatchesCount(message.text, positiveTerms);
    }, 0);
  }, [positiveTerms, visibleMessages]);

  const messageMatchOffsets = useMemo(() => {
    const offsets: number[] = [];
    if (!positiveTerms.length) return offsets;
    let runningTotal = 0;
    for (const message of visibleMessages) {
      offsets.push(runningTotal);
      runningTotal += getTextMatchesCount(message.text, positiveTerms);
    }
    return offsets;
  }, [positiveTerms, visibleMessages]);

  useEffect(() => {
    setCurrentMatchIndex(0);
    matchRefs.current = [];
  }, [searchTerms, selectedId]);

  useEffect(() => {
    if (totalMatchCount === 0) return;
    if (currentMatchIndex >= totalMatchCount) {
      setCurrentMatchIndex(0);
      return;
    }
    const node = matchRefs.current[currentMatchIndex];
    node?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentMatchIndex, totalMatchCount]);

  const toggleDataset = (dataset: Dataset) => {
    setSelectedDatasets((current) => {
      const allSelected = current.size === DATASET_ORDER.length;
      if (allSelected) {
        return new Set([dataset]);
      }

      const next = new Set(current);
      if (next.has(dataset)) {
        next.delete(dataset);
      } else {
        next.add(dataset);
      }

      return next.size === 0 ? new Set(DATASET_ORDER) : next;
    });
  };

  const allDatasetsSelected = selectedDatasets.size === DATASET_ORDER.length;

  const setAllDatasets = () => {
    setSelectedDatasets(new Set(DATASET_ORDER));
  };

  const updateSearchTerm = (field: keyof SearchTerms, value: string) => {
    setSearchTerms((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const conversationTextForShare = useMemo(() => {
    if (!selectedConversation) return "";
    return selectedConversation.messages
      .map((message: TranscriptMessage) => `${message.label}: ${message.text}`)
      .join("\n\n");
  }, [selectedConversation]);

  const copyTranscript = async () => {
    if (!conversationTextForShare) return;
    try {
      await navigator.clipboard.writeText(conversationTextForShare);
      setActionFeedback("Copied transcript text.");
    } catch {
      setActionFeedback("Copy failed.");
    }
  };

  const toggleSelectedConversation = (conversationId: string) => {
    setSelectedConversationIds((current) => {
      if (current.includes(conversationId)) {
        return current.filter((id) => id !== conversationId);
      }
      return [...current, conversationId];
    });
  };

  const formatChipLabel = (conversation: TranscriptConversation) => {
    const shorthand = toConversationShorthand(conversation);
    if (shorthand) return shorthand;
    const prefix = DATASET_PREFIX[conversation.dataset] ?? "?";
    const token = conversation.id.replace(/[^a-zA-Z0-9]/g, "").slice(-2).toUpperCase() || "X1";
    return `${prefix}${token}`;
  };

  const copyAllSelectedConversations = async () => {
    if (!selectedConversations.length) return;
    const formatted = selectedConversations
      .map((conversation) => `${conversation.id}\n${conversation.rawText}`)
      .join(`${COPY_SEPARATOR}`);
    try {
      await navigator.clipboard.writeText(formatted);
      setActionFeedback(`Copied ${selectedConversations.length} selected conversations.`);
    } catch {
      setActionFeedback("Copy failed.");
    }
  };

  const toggleFocusMode = () => {
    setIsFocusMode((current) => !current);
  };

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent<boolean>("transcript-viewer-focus-mode-change", {
        detail: isFocusMode,
      }),
    );
    return () => {
      window.dispatchEvent(
        new CustomEvent<boolean>("transcript-viewer-focus-mode-change", {
          detail: false,
        }),
      );
    };
  }, [isFocusMode]);

  if (loading) {
    return <p className="font-mono text-secondary">Loading transcripts...</p>;
  }

  if (error) {
    return (
      <div className="border-2 border-red-500/50 rounded-2xl p-4 text-sm text-red-200">
        {error}
      </div>
    );
  }

  return (
    <div
      className={`${
        isFocusMode
          ? "fixed inset-0 z-[200] overflow-auto bg-[color:var(--palette-background)] p-4"
          : ""
      } space-y-4`}
    >
      <header className="border-2 border-secondary rounded-2xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-mono text-xl sm:text-2xl font-bold text-themed">
            Anthropic Interviewer: Transcript Viewer
          </h1>
          <div className="flex items-center gap-2">
            <a
              href="https://www.anthropic.com/research/anthropic-interviewer"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-secondary px-2.5 py-1.5 text-xs sm:px-3 text-themed"
            >
              Dataset Source Link
            </a>
            <button
              type="button"
              onClick={toggleFocusMode}
              className="rounded-lg border border-secondary px-2.5 py-1.5 text-xs sm:px-3"
            >
              {isFocusMode ? "Exit focus mode" : "Focus mode"}
            </button>
          </div>
        </div>
        {!isFocusMode ? (
          <p className="text-sm text-secondary mt-1">
            Browse interview transcripts with searchable, filterable AI/User separation.
          </p>
        ) : null}
      </header>
      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4 xl:h-[calc(100vh-230px)]">
        <aside className="border-2 border-secondary rounded-2xl p-3 overflow-hidden flex flex-col min-h-0">
          <h2 className="font-mono font-bold text-themed mb-3">Search</h2>

          <div className="space-y-2 mb-4">
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">
                AND (all required)
              </label>
              <input
                type="text"
                value={searchTerms.and}
                onChange={(e) => updateSearchTerm("and", e.target.value)}
                placeholder="term1, term2"
                className="w-full rounded-lg border border-secondary bg-transparent px-3 py-2 text-sm text-themed focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">
                OR (any match)
              </label>
              <input
                type="text"
                value={searchTerms.or}
                onChange={(e) => updateSearchTerm("or", e.target.value)}
                placeholder="term1, term2"
                className="w-full rounded-lg border border-secondary bg-transparent px-3 py-2 text-sm text-themed focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">
                NOT (exclude)
              </label>
              <input
                type="text"
                value={searchTerms.not}
                onChange={(e) => updateSearchTerm("not", e.target.value)}
                placeholder="term1, term2"
                className="w-full rounded-lg border border-secondary bg-transparent px-3 py-2 text-sm text-themed focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="border-t border-secondary pt-3 mb-3">
            <h2 className="font-mono font-bold text-themed mb-2">Datasets</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                type="button"
                onClick={setAllDatasets}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  allDatasetsSelected
                    ? "border-primary bg-primary/20 text-themed"
                    : "border-secondary bg-secondary/20 text-secondary"
                }`}
              >
                All
              </button>
              {DATASET_ORDER.map((dataset) => {
                const active = selectedDatasets.has(dataset);
                return (
                  <button
                    key={dataset}
                    type="button"
                    onClick={() => toggleDataset(dataset)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      active
                        ? "border-primary bg-primary/20 text-themed"
                        : "border-secondary bg-secondary/20 text-secondary"
                    }`}
                  >
                    {DATASET_LABELS[dataset]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-2">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs text-secondary">{sidebarStats.totalConversations} conversations</p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setStatsViewMode("text")}
                  className={`rounded-full border px-2 py-0.5 text-[11px] transition ${
                    statsViewMode === "text"
                      ? "border-primary bg-primary/20 text-themed"
                      : "border-secondary text-secondary"
                  }`}
                >
                  Text
                </button>
                <button
                  type="button"
                  onClick={() => setStatsViewMode("pie")}
                  className={`rounded-full border px-2 py-0.5 text-[11px] transition ${
                    statsViewMode === "pie"
                      ? "border-primary bg-primary/20 text-themed"
                      : "border-secondary text-secondary"
                  }`}
                >
                  Pie
                </button>
              </div>
            </div>

            {statsViewMode === "text" ? (
              <div className="text-xs text-secondary space-y-1">
                <p>
                  Creatives: {sidebarStats.datasetCounts.creatives} ({sidebarStats.datasetPct.creatives}%)
                  {" · "}
                  Scientist: {sidebarStats.datasetCounts.scientists} ({sidebarStats.datasetPct.scientists}%)
                  {" · "}
                  Workforce: {sidebarStats.datasetCounts.workforce} ({sidebarStats.datasetPct.workforce}%)
                </p>
                <p>
                  AI: {sidebarStats.aiTermHits} ({sidebarStats.speakerPct.ai}%)
                  {" · "}
                  USER: {sidebarStats.userTermHits} ({sidebarStats.speakerPct.user}%)
                  {" · "}
                  Total entries: {sidebarStats.totalEntries}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <StatsPie
                  title="Dataset split"
                  total={sidebarStats.totalConversations}
                  segments={[
                    {
                      label: "Creatives",
                      value: sidebarStats.datasetCounts.creatives,
                      color: "#22d3ee",
                    },
                    {
                      label: "Scientist",
                      value: sidebarStats.datasetCounts.scientists,
                      color: "#a78bfa",
                    },
                    {
                      label: "Workforce",
                      value: sidebarStats.datasetCounts.workforce,
                      color: "#34d399",
                    },
                  ]}
                />
                <StatsPie
                  title="Speaker term hits"
                  total={sidebarStats.totalEntries}
                  segments={[
                    {
                      label: "AI",
                      value: sidebarStats.aiTermHits,
                      color: "#60a5fa",
                    },
                    {
                      label: "USER",
                      value: sidebarStats.userTermHits,
                      color: "#4ade80",
                    },
                  ]}
                />
              </div>
            )}
          </div>
          <div className="overflow-y-auto space-y-2 flex-1 min-h-0 max-h-[45vh] xl:max-h-none">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedId(conversation.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedId(conversation.id);
                  }
                }}
                role="button"
                tabIndex={0}
                className={`relative w-full text-left rounded-xl border px-3 py-2 pr-9 transition ${
                  selectedId === conversation.id
                    ? "border-primary bg-primary/20"
                    : "border-secondary hover:border-primary/60"
                }`}
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleSelectedConversation(conversation.id);
                  }}
                  aria-label={
                    selectedConversationIds.includes(conversation.id)
                      ? `Unselect ${conversation.id}`
                      : `Select ${conversation.id}`
                  }
                  className={`absolute right-2 top-2 rounded px-1.5 py-0.5 text-xs border transition ${
                    selectedConversationIds.includes(conversation.id)
                      ? "border-primary bg-primary/20 text-themed"
                      : "border-secondary text-secondary hover:border-primary/60"
                  }`}
                >
                  {selectedConversationIds.includes(conversation.id) ? "★" : "☆"}
                </button>
                <p className="font-mono text-sm text-themed break-all">{conversation.id}</p>
                <p className="text-xs text-secondary">
                  {DATASET_LABELS[conversation.dataset]} · {conversation.messageCount} msgs
                </p>
              </div>
            ))}
          </div>
        </aside>

        <main className="border-2 border-secondary rounded-2xl p-4 flex flex-col min-h-[50vh] xl:min-h-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
            <div>
              <h2 className="font-mono font-bold text-themed mb-1 break-all">
                {selectedConversation?.id ?? "No conversation selected"}
              </h2>
              <p className="text-xs text-secondary">
                {selectedConversation
                  ? `${DATASET_LABELS[selectedConversation.dataset]} dataset · ${visibleMessages.length} messages · ${totalMatchCount} matches`
                  : "Adjust filters to find a conversation."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyTranscript}
                disabled={!selectedConversation}
                className="rounded-lg border border-secondary px-2.5 py-1.5 text-xs sm:px-3 disabled:opacity-50"
              >
                Copy
              </button>
            </div>
          </div>
          {actionFeedback ? (
            <p className="text-xs text-secondary mb-2">{actionFeedback}</p>
          ) : null}
          <div className="overflow-y-auto space-y-3 flex-1 pr-1 min-h-0">
            {visibleMessages.map((message, messagePosition) => {
              const baseIndex = messageMatchOffsets[messagePosition] ?? 0;
              const { content } = renderHighlightedText(
                message.text,
                positiveTerms,
                (matchIndex, element) => {
                  matchRefs.current[matchIndex] = element;
                },
                baseIndex,
              );
              return (
                <article
                  key={`${message.index}-${message.label}`}
                  className={`rounded-xl border p-3 ${messageStyleBySpeaker[message.speaker]}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">
                    {message.label}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-themed">
                    {content}
                  </p>
                </article>
              );
            })}
          </div>
        </main>
      </div>
      <div className="border-t border-secondary pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-secondary mb-2">
          Selected Conversations
        </p>
        <div className="rounded-xl border border-secondary px-3 py-2 space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="w-24 shrink-0">
              <div className="flex items-center justify-center gap-1 text-[11px] text-secondary whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => setSelectedChipPage((current) => Math.max(0, current - 1))}
                  disabled={selectedChipPage === 0}
                  className="rounded border border-secondary px-1 leading-none disabled:opacity-40"
                >
                  &lt;
                </button>
                <span>
                  Page {selectedChipPage + 1}/{selectedChipPageCount}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedChipPage((current) =>
                      Math.min(selectedChipPageCount - 1, current + 1),
                    )
                  }
                  disabled={selectedChipPage >= selectedChipPageCount - 1}
                  className="rounded border border-secondary px-1 leading-none disabled:opacity-40"
                >
                  &gt;
                </button>
              </div>
            </div>
            <div className="h-5 w-px bg-secondary/60" aria-hidden="true" />
            <div className="grid grid-cols-10 gap-1.5 flex-1">
              {selectedRowOne.map((conversation) => (
                <button
                  key={`selected-row-one-${conversation.id}`}
                  type="button"
                  onClick={() => setSelectedId(conversation.id)}
                  className={`h-6 w-full rounded border border-secondary/80 inline-flex items-center justify-center text-center text-[10px] font-mono leading-none text-themed ${
                    selectedId === conversation.id ? "border-primary bg-primary/20" : ""
                  }`}
                >
                  {formatChipLabel(conversation)}
                </button>
              ))}
              {Array.from({
                length: Math.max(0, SELECTED_CHIPS_PER_ROW - selectedRowOne.length),
              }).map((_, idx) => (
                <span
                  key={`selected-row-one-empty-${idx}`}
                  className="h-6 w-full rounded border border-dashed border-secondary/40"
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 shrink-0">
              <button
                type="button"
                onClick={copyAllSelectedConversations}
                disabled={selectedConversations.length === 0}
                className="w-full rounded border border-secondary px-2 py-1 text-[10px] text-secondary disabled:opacity-40"
              >
                Copy all
              </button>
             
            </div>
            <div className="h-5 w-px bg-secondary/60" aria-hidden="true" />
            <div className="grid grid-cols-10 gap-1.5 flex-1">
              {selectedRowTwo.map((conversation) => (
                <button
                  key={`selected-row-two-${conversation.id}`}
                  type="button"
                  onClick={() => setSelectedId(conversation.id)}
                  className={`h-6 w-full rounded border border-secondary/80 inline-flex items-center justify-center text-center text-[10px] font-mono leading-none text-themed ${
                    selectedId === conversation.id ? "border-primary bg-primary/20" : ""
                  }`}
                >
                  {formatChipLabel(conversation)}
                </button>
              ))}
              {Array.from({
                length: Math.max(0, SELECTED_CHIPS_PER_ROW - selectedRowTwo.length),
              }).map((_, idx) => (
                <span
                  key={`selected-row-two-empty-${idx}`}
                  className="h-6 w-full rounded border border-dashed border-secondary/40"
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
