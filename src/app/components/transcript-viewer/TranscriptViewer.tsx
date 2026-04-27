"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  Dataset,
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

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type SearchTerms = {
  and: string;
  or: string;
  not: string;
};

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
  const matchRefs = useRef<Array<HTMLSpanElement | null>>([]);

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

  const sidebarStats = useMemo(() => {
    const totalConversations = filteredConversations.length;
    const datasetCounts: Record<Dataset, number> = {
      creatives: 0,
      scientists: 0,
      workforce: 0,
    };
    let aiMessages = 0;
    let userMessages = 0;
    let totalMessages = 0;

    for (const conversation of filteredConversations) {
      datasetCounts[conversation.dataset] += 1;

      const ai = conversation.speakerCounts.ai ?? 0;
      const user = conversation.speakerCounts.user ?? 0;
      const other = conversation.speakerCounts.other ?? 0;

      aiMessages += ai;
      userMessages += user;
      totalMessages += ai + user + other;
    }

    const pct = (count: number, total: number) =>
      total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";

    return {
      totalConversations,
      datasetCounts,
      aiMessages,
      userMessages,
      totalMessages,
      datasetPct: {
        creatives: pct(datasetCounts.creatives, totalConversations),
        scientists: pct(datasetCounts.scientists, totalConversations),
        workforce: pct(datasetCounts.workforce, totalConversations),
      },
      speakerPct: {
        ai: pct(aiMessages, totalMessages),
        user: pct(userMessages, totalMessages),
      },
    };
  }, [filteredConversations]);

  useEffect(() => {
    if (!filteredConversations.length) {
      setSelectedId("");
      return;
    }
    const stillVisible = filteredConversations.some((item) => item.id === selectedId);
    if (!stillVisible) {
      setSelectedId(filteredConversations[0].id);
    }
  }, [filteredConversations, selectedId]);

  const selectedConversation = useMemo(() => {
    if (!selectedId) return null;
    return filteredConversations.find((item) => item.id === selectedId) ?? null;
  }, [filteredConversations, selectedId]);

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

  const shareTranscript = async () => {
    if (!selectedConversation) return;
    const shareText = conversationTextForShare;
    const sharePayload = {
      title: selectedConversation.id,
      text: shareText,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(sharePayload);
        setActionFeedback("Share dialog opened.");
        return;
      }
      await navigator.clipboard.writeText(
        `${window.location.href}\n\n${selectedConversation.id}\n\n${shareText}`,
      );
      setActionFeedback("Share link and text copied.");
    } catch {
      setActionFeedback("Share failed.");
    }
  };

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
    <div className="space-y-4">
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
                    : "border-secondary text-secondary"
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
                        : "border-secondary text-secondary"
                    }`}
                  >
                    {DATASET_LABELS[dataset]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-secondary mb-2 space-y-1">
            <p>{sidebarStats.totalConversations} conversations</p>
            <p>
              Creatives: {sidebarStats.datasetCounts.creatives} ({sidebarStats.datasetPct.creatives}%)
              {" · "}
              Scientist: {sidebarStats.datasetCounts.scientists} ({sidebarStats.datasetPct.scientists}%)
              {" · "}
              Workforce: {sidebarStats.datasetCounts.workforce} ({sidebarStats.datasetPct.workforce}%)
            </p>
            <p>
              AI: {sidebarStats.aiMessages} ({sidebarStats.speakerPct.ai}%)
              {" · "}
              USER: {sidebarStats.userMessages} ({sidebarStats.speakerPct.user}%)
              {" · "}
              Total entries: {sidebarStats.totalMessages}
            </p>
          </div>
          <div className="overflow-y-auto space-y-2 flex-1 min-h-0 max-h-[45vh] xl:max-h-none">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setSelectedId(conversation.id)}
                className={`w-full text-left rounded-xl border px-3 py-2 transition ${
                  selectedId === conversation.id
                    ? "border-primary bg-primary/20"
                    : "border-secondary hover:border-primary/60"
                }`}
              >
                <p className="font-mono text-sm text-themed break-all">{conversation.id}</p>
                <p className="text-xs text-secondary">
                  {DATASET_LABELS[conversation.dataset]} · {conversation.messageCount} msgs
                </p>
              </button>
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
              <button
                type="button"
                onClick={shareTranscript}
                disabled={!selectedConversation}
                className="rounded-lg border border-secondary px-2.5 py-1.5 text-xs sm:px-3 disabled:opacity-50"
              >
                Share
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
    </div>
  );
}
