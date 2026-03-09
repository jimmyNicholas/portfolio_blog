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
  final_story?: string;
  allow_custom_input?: boolean;
};

/** Parse story text into display segments */
function parseStoryLines(story: string): string[] {
  return story
    .split(/\n+/)
    .map((line) => line.replace(/^\s*\*\s*/, "").trim())
    .filter(Boolean);
}

export default function StoryBuddyClient() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [payload, setPayload] = useState<StoryPayload | null>(null);
  const [customInputValue, setCustomInputValue] = useState("");
  const targetRef = useRef<HTMLDivElement>(null);
  const setPayloadRef = useRef(setPayload);
  setPayloadRef.current = setPayload;

  const handleChoiceClick = (index: number, choiceText: string) => {
    if (typeof window?.voiceflow?.chat?.interact !== "function") return;
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

    const extension = {
      name: "story_buddy_payload",
      type: "effect" as const,
      match: (args: unknown) => {
        const t = (args as { trace?: { payload?: unknown } }).trace;
        const raw = t?.payload;
        if (raw == null) return false;
        if (typeof raw === "string") {
          try {
            const p = JSON.parse(raw) as Record<string, unknown>;
            return "story_so_far" in p || "message_to_player" in p || Array.isArray(p.choices);
          } catch {
            return false;
          }
        }
        const o = raw as Record<string, unknown>;
        return "story_so_far" in o || "message_to_player" in o || Array.isArray(o.choices);
      },
      effect: (args: unknown) => {
        const t = (args as { trace?: { payload?: string } }).trace;
        const raw = t?.payload;
        if (raw == null) return;

        let p: StoryPayload = {};
        if (typeof raw === "string") {
          try {
            p = JSON.parse(raw) as StoryPayload;
          } catch {
            return;
          }
        } else if (typeof raw === "object" && raw !== null) {
          p = raw as StoryPayload;
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

  // Derive UI from single payload state
  const storySoFar = payload?.story_so_far ?? "";
  const messageToPlayer = (payload?.message_to_player ?? "").replace(/\\n/g, "\n");
  const choicesList = Array.isArray(payload?.choices)
    ? payload.choices.filter((c): c is string => typeof c === "string")
    : [];
  const allowCustomInput = payload?.allow_custom_input !== false;

  return (
    <>
      <Script
        src={VOICEFLOW_SCRIPT_URL}
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 min-h-[500px]">
        <div
          className="border-2 border-secondary rounded-3xl p-6 flex flex-col min-h-[500px]"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--palette-background) 88%, var(--palette-secondary) 12%)",
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
              <span className="opacity-70">
                Your accumulated story will appear here as you chat.
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 min-h-[500px]">
          <div
            className="flex items-center gap-3 px-4 py-2 border-2 border-secondary rounded-2xl shrink-0"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--palette-background) 92%, var(--palette-secondary) 8%)",
            }}
          >
            <span className="font-mono text-accent text-sm">Options</span>
          </div>

          {messageToPlayer && (
            <div
              className="flex-1 min-h-[120px] border-2 border-secondary rounded-3xl p-4 overflow-y-auto"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--palette-background) 88%, var(--palette-secondary) 12%)",
              }}
            >
              <p
                className="text-accent text-sm leading-relaxed font-mono whitespace-pre-line"
              >
                {messageToPlayer}
              </p>
            </div>
          )}

          <div
            className="flex-1 min-h-[300px] border-2 border-secondary rounded-3xl overflow-hidden"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--palette-background) 88%, var(--palette-secondary) 12%)",
            }}
          >
            <div
              id="voiceflow-chat-frame"
              ref={targetRef}
              className="w-full min-h-[300px]"
            />
          </div>

          <div
            className="grid grid-cols-2 gap-3 shrink-0 p-4 border-2 border-secondary rounded-3xl"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--palette-background) 88%, var(--palette-secondary) 12%)",
            }}
          >
            {[0, 1, 2].map((i) => {
              const choice = choicesList[i] ?? "";
              const hasChoice = choice.length > 0;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!hasChoice}
                  className="w-full text-left px-4 py-3 border-2 border-primary rounded-2xl text-accent text-sm leading-snug font-mono transition-colors hover:bg-[color:var(--palette-primary)]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--palette-background)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--palette-background) 85%, var(--palette-secondary) 15%)",
                  }}
                  onClick={() => hasChoice && handleChoiceClick(i, choice)}
                >
                  {hasChoice ? choice : "—"}
                </button>
              );
            })}
            {allowCustomInput ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={customInputValue}
                  onChange={(e) => setCustomInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
                  placeholder="Or type your own action..."
                  className="w-full px-3 py-2 border-2 border-secondary rounded-2xl text-accent text-sm font-mono bg-transparent placeholder:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--palette-background)]"
                />
                <button
                  type="button"
                  onClick={handleCustomSubmit}
                  className="w-full px-4 py-2 border-2 border-primary rounded-2xl text-accent text-sm font-mono font-medium transition-colors hover:bg-[color:var(--palette-primary)]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--palette-background)]"
                >
                  Submit
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center px-4 py-3 border-2 border-secondary rounded-2xl text-accent/50 text-sm font-mono">
                —
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="mt-6 border-2 border-secondary rounded-3xl p-4"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--palette-background) 95%, var(--palette-secondary) 5%)",
        }}
      >
        <h3 className="font-mono font-bold text-themed text-sm mb-2">
          Debug – payload
        </h3>
        <pre className="text-accent text-xs font-mono overflow-x-auto max-h-48 overflow-y-auto whitespace-pre-wrap break-words">
          {payload != null ? JSON.stringify(payload, null, 2) : "—"}
        </pre>
      </div>
    </>
  );
}
