"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    voiceflow?: { chat: { load: (config: object) => Promise<void> } };
  }
}

const VOICEFLOW_SCRIPT_URL =
  "https://cdn.voiceflow.com/widget-next/bundle.mjs";

// Trace types come from the Custom Action *name* in Voice Flow (not the path)
const STORY_ACTION_NAMES = ["update_story_so_far", "Send story_so_far"];
const CHOICES_ACTION_NAMES = ["Send Choices", "update_choices"];

type Choices = { choice_a?: string; choice_b?: string; choice_c?: string };

export default function StoryBuddyClient() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [storySoFar, setStorySoFar] = useState("");
  const [choices, setChoices] = useState<Choices>({});
  const targetRef = useRef<HTMLDivElement>(null);
  const setStoryRef = useRef(setStorySoFar);
  const setChoicesRef = useRef(setChoices);
  setStoryRef.current = setStorySoFar;
  setChoicesRef.current = setChoices;

  useEffect(() => {
    if (!scriptLoaded || !targetRef.current || !window.voiceflow?.chat) return;

    // Log first 30 traces to verify extensions are invoked and see actual trace types
    let traceLogCount = 0;
    const MAX_TRACE_LOGS = 30;

    const updateStoryExtension = {
      name: "update_story_so_far",
      type: "effect" as const,
      match: (args: { trace: { type?: string } }) => {
        const traceType = args.trace?.type;
        if (traceLogCount < MAX_TRACE_LOGS && traceType) {
          traceLogCount++;
          console.log(`[Story Buddy] trace #${traceLogCount}:`, traceType, args.trace);
        }
        const matched = Boolean(traceType && STORY_ACTION_NAMES.includes(traceType));
        if (matched) {
          console.log("[Story Buddy] MATCHED custom action:", traceType);
        }
        return matched;
      },
      effect: (args: {
        trace: { payload?: string | { story_so_far?: string } };
      }) => {
        console.log("[Story Buddy] effect called with trace:", args.trace);
        const payload = args.trace?.payload;
        if (payload == null) return;
        let story = "";
        if (typeof payload === "string") {
          try {
            const parsed = JSON.parse(payload) as { story_so_far?: string };
            story = parsed?.story_so_far ?? "";
          } catch {
            story = payload;
          }
        } else if (typeof payload === "object" && "story_so_far" in payload) {
          story = String(payload.story_so_far ?? "");
        }
        console.log("[Story Buddy] extracted story:", story.slice(0, 100) + (story.length > 100 ? "..." : ""));
        setStoryRef.current(story);
      },
    };

    const updateChoicesExtension = {
      name: "update_choices",
      type: "effect" as const,
      match: (args: { trace: { type?: string } }) =>
        Boolean(args.trace?.type && CHOICES_ACTION_NAMES.includes(args.trace.type)),
      effect: (args: {
        trace: { payload?: string | Choices };
      }) => {
        const payload = args.trace?.payload;
        if (payload == null) return;
        let parsed: Choices = {};
        if (typeof payload === "string") {
          try {
            parsed = JSON.parse(payload) as Choices;
          } catch {
            return;
          }
        } else if (typeof payload === "object") {
          parsed = {
            choice_a: payload.choice_a,
            choice_b: payload.choice_b,
            choice_c: payload.choice_c,
          };
        }
        setChoicesRef.current(parsed);
      },
    };

    console.log("[Story Buddy] Registering effect extensions, calling chat.load");
    void window.voiceflow.chat.load({
      verify: { projectID: "69ae372ecc5f4ca3d1b74dce" },
      url: "https://general-runtime.voiceflow.com",
      versionID: "production",
      voice: { url: "https://runtime-api.voiceflow.com" },
      assistant: {
        extensions: [updateStoryExtension, updateChoicesExtension],
      },
      render: {
        mode: "embedded",
        target: targetRef.current,
      },
      autostart: true,
    });
  }, [scriptLoaded]);

  return (
    <>
      <Script
        src={VOICEFLOW_SCRIPT_URL}
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 min-h-[500px]">
        {/* Left panel: story placeholder */}
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
                {storySoFar
                  .split(/\n+/)
                  .map((line) => line.replace(/^\s*\*\s*/, "").trim())
                  .filter(Boolean)
                  .map((paragraph, i) => (
                    <li key={i}>{paragraph}</li>
                  ))}
              </ul>
            ) : (
              <span className="opacity-70">
                Your accumulated story will appear here as you chat.
              </span>
            )}
          </div>
          {(choices.choice_a || choices.choice_b || choices.choice_c) && (
            <div className="mt-4 pt-4 border-t border-secondary/60">
              <h3 className="font-mono font-bold text-themed text-sm mb-2">
                Current choices
              </h3>
              <ul className="space-y-1.5 text-accent text-sm">
                {[choices.choice_a, choices.choice_b, choices.choice_c]
                  .filter(Boolean)
                  .map((c, i) => (
                    <li key={i} className="pl-3 border-l-2 border-primary/50">
                      {c}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right panel: chat widget */}
        <div
          className="min-h-[500px] border-2 border-secondary rounded-3xl overflow-hidden"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--palette-background) 88%, var(--palette-secondary) 12%)",
          }}
        >
          <div
            id="voiceflow-chat-frame"
            ref={targetRef}
            className="w-full min-h-[500px]"
          />
        </div>
      </div>
    </>
  );
}
