"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    voiceflow?: {
      chat: {
        load: (config: object) => Promise<void>;
        interact: (payload: {
          type: "choice_selected" | "custom_input";
          payload: {
            choice_index?: string;
            choice_text: string;
            is_custom: boolean;
          };
        }) => void;
      };
    };
  }
}

const VOICEFLOW_SCRIPT_URL =
  "https://cdn.voiceflow.com/widget-next/bundle.mjs";

const STORY_PAYLOAD_MESSAGE_TYPE = "story-buddy-payload";

type StoryPayload = {
  story_so_far?: string;
  message_to_player?: string;
  choices?: string[];
  /** Agent sometimes sends options as separate keys instead of choices[] */
  choice_a?: string;
  choice_b?: string;
  choice_c?: string;
  final_title?: string;
  final_story?: string;
  allow_custom_input?: boolean;
};

/**
 * Voiceflow sometimes emits the template literally, e.g. "{message_to_player}"
 * instead of substituting variables. Whole-string {name} tokens are treated as unresolved.
 */
const PLACEHOLDER_TOKEN = /^\{[a-zA-Z0-9_]+\}$/;

function isPlaceholderToken(s: string): boolean {
  return PLACEHOLDER_TOKEN.test(s.trim());
}

/** True if payload still has template placeholders (agent didn't substitute before trace) */
function payloadHasUnresolvedPlaceholders(p: StoryPayload): boolean {
  const msg = String(p.message_to_player ?? "").trim();
  if (msg && isPlaceholderToken(msg)) return true;
  const choices = normalizeChoicesRaw(p);
  if (choices.some((c) => isPlaceholderToken(c))) return true;
  return false;
}

/** Normalize choices without filtering placeholders (for detection) */
function normalizeChoicesRaw(p: StoryPayload): string[] {
  if (Array.isArray(p.choices) && p.choices.length > 0) {
    return p.choices.filter((c): c is string => typeof c === "string" && c.trim().length > 0);
  }
  return [p.choice_a, p.choice_b, p.choice_c].filter(
    (c): c is string => typeof c === "string" && c.trim().length > 0
  );
}

/** Normalize choice_a/b/c or choices into a string[] for the UI; drops unresolved placeholders */
function normalizeChoices(p: StoryPayload): string[] {
  return normalizeChoicesRaw(p).filter((c) => !isPlaceholderToken(c));
}

/** Use message_to_player only when it's not a literal placeholder string */
function resolveMessageToPlayer(raw: string | number | undefined): string {
  const str = String(raw ?? "");
  // Handle \\n and \\\\n (double-escaped from Voiceflow)
  const s = str.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n").trim();
  if (!s || isPlaceholderToken(s)) return "";
  return str.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n");
}

/** Parse story text into display segments */
function parseStoryLines(story: string | number): string[] {
  return String(story ?? "")
    .split(/\n+/)
    .map((line) => line.replace(/^\s*\*\s*/, "").trim())
    .filter(Boolean);
}

export default function StoryBuddyClient() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [payload, setPayload] = useState<StoryPayload | null>(null);
  const [customInputValue, setCustomInputValue] = useState("");
  // Persist last non-empty choices so buttons don't disappear on payloads without choices
  const [choicesState, setChoicesState] = useState<string[]>([]);
  // Persist last non-empty story/message so UI doesn't reset on empty payloads
  const [storySoFarState, setStorySoFarState] = useState("");
  const [messageToPlayerState, setMessageToPlayerState] = useState("");
  const [finalTitleState, setFinalTitleState] = useState("");
  const [finalStoryState, setFinalStoryState] = useState("");
  const [isWaitingForPayload, setIsWaitingForPayload] = useState(false);

  const targetRef = useRef<HTMLDivElement>(null);
  const setPayloadRef = useRef(setPayload);
  setPayloadRef.current = setPayload;

  const handleChoiceClick = (index: number, choiceText: string) => {
    if (typeof window?.voiceflow?.chat?.interact !== "function") return;
    setIsWaitingForPayload(true);
    window.voiceflow.chat.interact({
      type: "choice_selected",
      payload: {
        choice_index: String(index),
        choice_text: choiceText,
        is_custom: false,
      },
    });
  };

  const handleCustomSubmit = () => {
    const text = customInputValue.trim();
    if (!text || typeof window?.voiceflow?.chat?.interact !== "function") return;
    setIsWaitingForPayload(true);
    window.voiceflow.chat.interact({
      type: "custom_input",
      payload: {
        choice_text: text,
        is_custom: true,
      },
    });
    setCustomInputValue("");
  };

  // Receive payload from extension (custom event same-window, postMessage from iframe)
  useEffect(() => {
    const onEvent = (e: Event) => {
      const d = (e as CustomEvent<{ payload?: StoryPayload }>).detail;
      if (d?.payload != null) setPayload(d.payload);
    };
    const onMessage = (e: MessageEvent) => {
      const d = e.data;
      if (d?.type === STORY_PAYLOAD_MESSAGE_TYPE && d.payload != null) {
        setPayload(d.payload as StoryPayload);
      }
    };
    window.addEventListener(STORY_PAYLOAD_MESSAGE_TYPE, onEvent);
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener(STORY_PAYLOAD_MESSAGE_TYPE, onEvent);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !targetRef.current || !window.voiceflow?.chat) return;

    /** Try to parse story payload from trace.payload (string or object, or nested). */
    function parseStoryPayloadFromTrace(trace: {
      payload?: unknown;
      type?: string;
    }): StoryPayload | null {
      let raw = trace?.payload;
      // Custom Action JSON body can be object directly
      if (raw != null && typeof raw === "object" && !Array.isArray(raw)) {
        const o = raw as Record<string, unknown>;
        if (
          "story_so_far" in o ||
          "message_to_player" in o ||
          Array.isArray(o.choices)
        ) {
          return raw as StoryPayload;
        }
        // Sometimes wrapped e.g. { body: "{...}" } or { data: {...} }
        const nested =
          o.body ?? o.data ?? o.json ?? o.payload ?? o.message;
        if (nested != null) raw = nested;
      }
      if (typeof raw === "string") {
        let s = raw.trim();
        // Voiceflow "Send JSON" step can prefix the body with "Send JSON "
        s = s.replace(/^Send\s+JSON\s*/i, "").trim();
        if (!s.includes("story_so_far") && !s.includes("message_to_player"))
          return null;

        /** Parse JSON string; if result is still a string (double-encoded), parse again. */
        function destring(input: string): unknown {
          try {
            const parsed = JSON.parse(input);
            return typeof parsed === "string" ? destring(parsed) : parsed;
          } catch {
            return null;
          }
        }

        // Try direct parse first (clean JSON from JSON.stringify in Voiceflow)
        let parsed = destring(s);
        if (parsed != null && typeof parsed === "object" && "story_so_far" in (parsed as object)) {
          return parsed as StoryPayload;
        }

        // Fallback: extract { ... } block and fix literal newlines in string values
        const start = s.indexOf("{");
        const end = s.lastIndexOf("}");
        const jsonStr =
          start >= 0 && end > start ? s.slice(start, end + 1) : s;
        const normalized = jsonStr.replace(
          /(?<!\\)"(?:[^"\\]|\\.)*"/g,
          (match) => match.replace(/\n/g, "\\n").replace(/\r/g, "\\r")
        );
        parsed = destring(normalized) ?? destring(jsonStr);
        return parsed != null && typeof parsed === "object" ? (parsed as StoryPayload) : null;
      }
      if (raw != null && typeof raw === "object") {
        return raw as StoryPayload;
      }
      return null;
    }

    const extension = {
      name: "story_buddy_payload",
      type: "effect" as const,
      match: (args: unknown) => {
        const trace = (args as { trace?: { payload?: unknown; type?: string } })
          .trace;
        if (!trace) return false;
        // If Custom Action type is fixed in Creator, you can match trace.type only:
        // if (trace.type === "your_custom_action_name") return true;
        const parsed = parseStoryPayloadFromTrace(trace);
        if (parsed != null) return true;
        const raw = trace.payload;
        if (raw == null) return false;
        // String that looks like our JSON but parse failed elsewhere — still try in effect
        if (
          typeof raw === "string" &&
          (raw.includes("story_so_far") || raw.includes("message_to_player"))
        ) {
          return true;
        }
        return false;
      },
      effect: (args: unknown) => {
        const trace = (args as {
          trace?: { payload?: unknown; type?: string };
        }).trace;
        if (!trace) return;

        let p = parseStoryPayloadFromTrace(trace);
        if (p == null) {
          const raw = trace.payload;
          if (typeof raw === "string") {
            try {
              p = JSON.parse(raw) as StoryPayload;
            } catch {
              console.warn("[Story Buddy] matched trace but could not parse payload", trace.type, raw.slice(0, 300));
              return;
            }
          } else if (typeof raw === "object" && raw !== null) {
            p = raw as StoryPayload;
          } else {
            return;
          }
        }

        // Single source of truth for buttons: always set choices[] when choice_a/b/c present
        const normalized = normalizeChoices(p);
        if (normalized.length > 0) {
          p = { ...p, choices: normalized };
          setChoicesState(normalized);
        }

        // Coerce to expected types (Voiceflow can send story_so_far as 0, etc.)
        const coercedStory = String(p.story_so_far ?? "");
        const coercedMsg = String(p.message_to_player ?? "");
        const coercedFinalTitle = String(p.final_title ?? "");
        const coercedFinalStory = String(p.final_story ?? "");
        p = {
          ...p,
          story_so_far: coercedStory,
          message_to_player: coercedMsg,
          final_title: coercedFinalTitle,
          final_story: coercedFinalStory,
        };

        // Only update displayed story/message when payload provides non-empty values
        const hasStoryUpdate = coercedStory.trim().length > 0;
        const resolvedMsg = resolveMessageToPlayer(coercedMsg);
        const hasMsgUpdate = resolvedMsg.trim().length > 0;
        const hasFinalUpdate =
          coercedFinalTitle.trim().length > 0 ||
          coercedFinalStory.trim().length > 0;
        if (hasStoryUpdate) setStorySoFarState(coercedStory);
        if (hasMsgUpdate) setMessageToPlayerState(coercedMsg);
        if (hasFinalUpdate) {
          setFinalTitleState(coercedFinalTitle);
          setFinalStoryState(coercedFinalStory);
        }

        // Clear waiting indicator when we receive something meaningful for the next turn
        if (hasStoryUpdate || hasMsgUpdate || hasFinalUpdate || normalized.length > 0) {
          setIsWaitingForPayload(false);
        }

        if (payloadHasUnresolvedPlaceholders(p)) {
          console.warn(
            "[Story Buddy] Payload has unresolved placeholders. " +
              "In Voiceflow, substitute variables before sending the trace (message_to_player, choices). " +
              "story_so_far is updating because that variable is wired; the rest are still literal template tokens.",
            p
          );
        }
        console.log("[Story Buddy] payload", p);

        setPayloadRef.current(p);
        try {
          window.dispatchEvent(
            new CustomEvent(STORY_PAYLOAD_MESSAGE_TYPE, { detail: { payload: p } })
          );
        } catch {
          // ignore
        }
        try {
          if (typeof window.parent?.postMessage === "function") {
            window.parent.postMessage(
              { type: STORY_PAYLOAD_MESSAGE_TYPE, payload: p },
              "*"
            );
          }
        } catch {
          // ignore
        }
      },
    };

    void window.voiceflow.chat.load({
      verify: { projectID: "69ae8dbe51c320e573369ab8" },
      url: "https://general-runtime.voiceflow.com",
      versionID: "production",
      voice: { url: "https://runtime-api.voiceflow.com" },
      assistant: { extensions: [extension] },
      render: { mode: "embedded", target: targetRef.current },
      autostart: true,
    });
  }, [scriptLoaded]);

  // Story/message: don't reset UI when payload sends empty strings
  const storySoFar = storySoFarState.trimEnd();
  const messageToPlayer = resolveMessageToPlayer(messageToPlayerState);
  const finalTitle = finalTitleState.trim();
  const finalStory = finalStoryState
    .replace(/\\\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .trim();
  // Treat sentinel "0" (Voiceflow default) as empty
  const isEmptyFinalTitle = finalTitle.length === 0 || finalTitle === "0";
  const isEmptyFinalStory = finalStory.length === 0 || finalStory === "0";
  const hasFinalStory = !isEmptyFinalTitle || !isEmptyFinalStory;
  const choicesFromPayload = payload != null ? normalizeChoices(payload) : [];
  const choicesList =
    choicesFromPayload.length > 0 ? choicesFromPayload : choicesState;
  const hasPlaceholderIssue =
    payload != null && payloadHasUnresolvedPlaceholders(payload);
  const allowCustomInput = payload?.allow_custom_input !== false;

  return (
    <>
      <Script
        src={VOICEFLOW_SCRIPT_URL}
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 min-h-[500px]">
        {hasFinalStory ? (
          <section
            className="lg:col-span-2 border-2 border-secondary rounded-3xl p-6 flex flex-col min-h-[320px]"
            aria-label="Final story"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--palette-background) 92%, var(--palette-secondary) 8%)",
            }}
          >
            <h2 className="font-mono font-bold text-themed text-lg mb-3">
              Final story
            </h2>
            {finalTitle && (
              <h3 className="font-mono text-primary text-base mb-3">
                {finalTitle}
              </h3>
            )}
            <div className="text-accent text-sm leading-relaxed flex-1 overflow-y-auto whitespace-pre-line font-mono">
              {finalStory || "(No final story provided.)"}
            </div>
          </section>
        ) : (
          <>
            {/* Left: Story (primary) */}
            <section
              className="border-[3px] border-primary rounded-3xl p-6 flex flex-col min-h-[500px]"
              aria-label="Story so far"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--palette-background) 94%, var(--palette-secondary) 6%)",
              }}
            >
              <h2 className="font-mono font-bold text-themed text-lg mb-3">
                Story so far
              </h2>
              <div className="text-accent text-sm leading-relaxed flex-1 overflow-y-auto">
                {storySoFar ? (
                  <ul className="space-y-3 pl-5 list-disc marker:text-primary">
                    {parseStoryLines(storySoFar).map((paragraph, i) => (
                      <li key={i}>{paragraph}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-accent/80">
                    Your story will go here...
                  </span>
                )}
              </div>
            </section>

            {/* Right: Message + options */}
            <div className="flex flex-col gap-4 min-h-[500px]">
              {(messageToPlayer || hasPlaceholderIssue) && (
                <section
                  className="border-2 border-secondary rounded-3xl p-4"
                  aria-label="Story Buddy message"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--palette-background) 97%, var(--palette-secondary) 3%)",
                  }}
                >
                  {hasPlaceholderIssue && (
                    <p className="mb-2 text-xs font-mono text-accent">
                      Voiceflow is sending template tokens (e.g.{" "}
                      <code className="opacity-90">
                        {"{message_to_player}"}
                      </code>
                      ). Wire it the same way as{" "}
                      <code className="opacity-90">story_so_far</code> so the
                      payload contains real text.
                    </p>
                  )}
                  <p className="text-accent text-sm leading-relaxed font-mono whitespace-pre-line">
                    {messageToPlayer ||
                      (hasPlaceholderIssue
                        ? "(message_to_player not substituted — fix in Voiceflow)"
                        : "")}
                  </p>
                </section>
              )}

              <section
                className="relative border-2 border-secondary rounded-3xl p-4 flex flex-col gap-3 flex-1"
                aria-label="Choose what happens next"
                aria-busy={isWaitingForPayload ? "true" : "false"}
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--palette-background) 94%, var(--palette-secondary) 6%)",
                }}
              >
                {/* <header className="flex items-center justify-between gap-3 mb-1">
                  <h2 className="font-mono text-themed text-sm font-semibold">
                    Options
                  </h2>
                  {choicesList.length === 0 && !allowCustomInput && (
                    <span className="text-xs text-accent">
                      Waiting for the next step…
                    </span>
                  )}
                </header> */}

                {isWaitingForPayload && (
                  <div
                    className="absolute inset-0 z-10 rounded-3xl bg-[color:var(--palette-background)]/80 backdrop-blur-[1px] flex items-center justify-center"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="flex flex-col items-center gap-3 px-5 py-4 border-2 border-secondary rounded-2xl bg-[color:var(--palette-background)]">
                      <span
                        className="inline-block h-8 w-8 rounded-full border-4 border-accent/40 border-t-primary animate-spin"
                        aria-hidden="true"
                      />
                      <div className="text-accent text-sm font-mono">
                        Thinking about your story…
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
                  {[0, 1, 2].map((i) => {
                    const choice = choicesList[i] ?? "";
                    const hasChoice = choice.length > 0;
                    return (
                      <button
                        key={`choice-${i}-${choice.slice(0, 48)}`}
                        type="button"
                        disabled={!hasChoice || isWaitingForPayload}
                        className="w-full text-left px-4 py-3 border-2 border-primary rounded-2xl text-themed text-sm leading-snug font-mono transition-all duration-200 enabled:cursor-pointer hover:bg-[color:var(--palette-primary)]/10 hover:shadow-sm hover:-translate-y-0.5 hover:border-primary active:translate-y-0 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--palette-background)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 disabled:active:scale-100"
                        style={{
                          backgroundColor:
                            "color-mix(in srgb, var(--palette-background) 90%, var(--palette-secondary) 10%)",
                        }}
                        onClick={() =>
                          hasChoice &&
                          !isWaitingForPayload &&
                          handleChoiceClick(i, choice)
                        }
                      >
                        {hasChoice ? choice : "—"}
                      </button>
                    );
                  })}
                </div>

                {allowCustomInput ? (
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <label className="sr-only" htmlFor="story-buddy-custom-input">
                      Or type your own action
                    </label>
                    <input
                      id="story-buddy-custom-input"
                      type="text"
                      value={customInputValue}
                      onChange={(e) => setCustomInputValue(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleCustomSubmit()
                      }
                      disabled={isWaitingForPayload}
                      placeholder="Or type your own action..."
                      className="w-full px-3 py-2 border-2 border-secondary rounded-2xl text-themed text-sm font-mono bg-transparent placeholder:text-accent/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--palette-background)]"
                    />
                    <button
                      type="button"
                      onClick={handleCustomSubmit}
                      disabled={isWaitingForPayload || !customInputValue.trim()}
                      className="sm:w-32 px-4 py-2 border-2 border-primary rounded-2xl text-themed text-sm font-mono font-medium transition-all duration-200 enabled:cursor-pointer hover:bg-[color:var(--palette-primary)]/10 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--palette-background)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 disabled:active:scale-100"
                    >
                      Submit
                    </button>
                  </div>
                ) : null}
              </section>
            </div>
          </>
        )}
      </div>

      {/* <div
        className="mt-6 border-2 border-secondary rounded-3xl p-4"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--palette-background) 95%, var(--palette-secondary) 5%)",
        }}
      >
        <h3 className="font-mono font-bold text-themed text-sm mb-2">
          Debug – payload
        </h3>
        <p className="text-accent/70 text-xs font-mono mb-2">
          Only seeing two payloads? In DevTools Console run{" "}
          <code className="text-accent">
            localStorage.setItem(&quot;VF_STORY_BUDDY_TRACE_DEBUG&quot;,&quot;1&quot;)
          </code>{" "}
          then reload — every trace type will log so you can see if the custom
          action stops firing after turn 2.
        </p>
        <pre className="text-accent text-xs font-mono overflow-x-auto max-h-48 overflow-y-auto whitespace-pre-wrap break-words">
          {payload != null ? JSON.stringify(payload, null, 2) : "—"}
        </pre>
      </div> */}

      {/* Voice Flow embed below debug – expands with content, scrolls when tall */}
      <div className="hidden m-0 p-0">
      <div
        // className="mt-6 border-2 border-secondary rounded-3xl overflow-hidden flex flex-col"
        // style={{
        //   backgroundColor:
        //     "color-mix(in srgb, var(--palette-background) 88%, var(--palette-secondary) 12%)",
        // }}
      >
        <h3 className="font-mono font-bold text-themed text-sm px-4 pt-3 pb-2 shrink-0">
          AI chat
        </h3>
        <div
          className="min-h-[320px] overflow-y-auto flex-1"
          style={{ maxHeight: "min(70vh, 800px)" }}
        >
          <div
            id="voiceflow-chat-frame"
            ref={targetRef}
            className="w-full min-h-[320px]"
          />
        </div>
      </div>
        </div>
      {/* Final story is shown in place of the main UI when available */}
    </>
  );
}
