import React from "react";
import { parseStoryLines } from "./storyBuddyUtils";

type FinalStoryPanelProps = {
  finalTitle: string;
  finalStory: string;
};

export function FinalStoryPanel({ finalTitle, finalStory }: FinalStoryPanelProps) {
  return (
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
      <div className="text-themed text-sm leading-relaxed flex-1 overflow-y-auto whitespace-pre-line font-mono">
        {finalStory || "(No final story provided.)"}
      </div>
    </section>
  );
}

type StorySoFarPanelProps = {
  storySoFar: string;
};

export function StorySoFarPanel({ storySoFar }: StorySoFarPanelProps) {
  return (
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
      <div
        className="text-themed text-base leading-relaxed flex-1 overflow-y-auto"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {storySoFar ? (
          <ul className="space-y-3 pl-5 list-disc marker:text-primary">
            {parseStoryLines(storySoFar).map((paragraph, i) => (
              <li key={i}>{paragraph}</li>
            ))}
          </ul>
        ) : (
          <span className="text-secondary/80">
            Your story will go here...
          </span>
        )}
      </div>
    </section>
  );
}

type MessagePanelProps = {
  messageToPlayer: string;
  hasPlaceholderIssue: boolean;
};

export function MessagePanel({
  messageToPlayer,
  hasPlaceholderIssue,
}: MessagePanelProps) {
  if (!messageToPlayer && !hasPlaceholderIssue) return null;

  return (
    <section
      className="border-2 border-secondary rounded-3xl p-5"
      aria-label="Story Buddy message"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--palette-background) 97%, var(--palette-secondary) 3%)",
      }}
    >
      {hasPlaceholderIssue && (
        <p className="mb-2 text-xs font-mono text-secondary">
          Voiceflow is sending template tokens (e.g.{" "}
          <code className="opacity-90">
            {"{message_to_player}"}
          </code>
          ). Wire it the same way as{" "}
          <code className="opacity-90">story_so_far</code> so the
          payload contains real text.
        </p>
      )}
      <p className="text-themed text-2xl leading-relaxed whitespace-pre-line">
        {messageToPlayer ||
          (hasPlaceholderIssue
            ? "(message_to_player not substituted — fix in Voiceflow)"
            : "")}
      </p>
    </section>
  );
}

type OptionsPanelProps = {
  choicesList: string[];
  allowCustomInput: boolean;
  isWaitingForPayload: boolean;
  customInputValue: string;
  onCustomInputChange: (value: string) => void;
  onCustomSubmit: () => void;
  onChoiceClick: (index: number, choiceText: string) => void;
  customInputRef: { current: HTMLInputElement | null };
};

export function OptionsPanel({
  choicesList,
  allowCustomInput,
  isWaitingForPayload,
  customInputValue,
  onCustomInputChange,
  onCustomSubmit,
  onChoiceClick,
  customInputRef,
}: OptionsPanelProps) {
  return (
    <section
      className="relative border-2 border-secondary rounded-3xl p-4 flex flex-col gap-3 flex-1 min-h-0"
      aria-label="Choose what happens next"
      aria-busy={isWaitingForPayload ? "true" : "false"}
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--palette-background) 94%, var(--palette-secondary) 6%)",
      }}
    >
      {isWaitingForPayload && (
        <div
          className="absolute inset-0 z-10 rounded-3xl bg-[color:var(--palette-background)]/80 backdrop-blur-[1px] flex items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-3 px-5 py-4 border-2 border-secondary rounded-2xl bg-[color:var(--palette-background)]">
            <span
              className="inline-block h-8 w-8 rounded-full border-4 border-accent/40 border-t-primary animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
            <div className="text-secondary text-sm font-mono">
              Thinking about your story…
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 flex-1 min-h-0 auto-rows-fr">
        {[0, 1, 2].map((i) => {
          const choice = choicesList[i] ?? "";
          const hasChoice = choice.length > 0;
          return (
            <button
              key={`choice-${i}-${choice.slice(0, 48)}`}
              type="button"
              disabled={!hasChoice || isWaitingForPayload}
              className="h-full w-full text-left px-4 py-3 border-2 border-primary rounded-2xl text-themed text-base leading-relaxed font-mono transition-all duration-200 motion-reduce:transition-none enabled:cursor-pointer hover:bg-[color:var(--palette-primary)]/14 hover:shadow-md hover:shadow-black/10 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 hover:border-primary active:translate-y-0 active:scale-[0.99] motion-reduce:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--palette-background)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 disabled:active:scale-100"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--palette-background) 90%, var(--palette-secondary) 10%)",
              }}
              onClick={() =>
                hasChoice && !isWaitingForPayload && onChoiceClick(i, choice)
              }
            >
              {hasChoice ? choice : "—"}
            </button>
          );
        })}
      </div>

      {allowCustomInput ? (
        <div className="flex flex-col sm:flex-row gap-2 pt-1 shrink-0">
          <label className="sr-only" htmlFor="story-buddy-custom-input">
            Or type your own action
          </label>
          <input
            id="story-buddy-custom-input"
            ref={customInputRef}
            type="text"
            value={customInputValue}
            onChange={(e) => onCustomInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onCustomSubmit()}
            disabled={isWaitingForPayload}
            placeholder="Or type your own action..."
            className="w-full px-3 py-2 border-2 border-secondary rounded-2xl text-themed text-base font-mono bg-transparent placeholder:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--palette-background)]"
          />
          <button
            type="button"
            onClick={onCustomSubmit}
            disabled={isWaitingForPayload || !customInputValue.trim()}
            aria-label="Submit your story action"
            className="sm:w-32 px-4 py-2 border-2 border-primary rounded-2xl text-secondary text-base font-mono font-medium transition-all duration-200 motion-reduce:transition-none enabled:cursor-pointer hover:bg-[color:var(--palette-primary)]/10 hover:shadow-sm hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 active:translate-y-0 active:scale-[0.99] motion-reduce:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--palette-background)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 disabled:active:scale-100"
          >
            Submit
          </button>
        </div>
      ) : null}
    </section>
  );
}

export function StoryBuddyConnecting() {
  return (
    <div
      className="min-h-[400px] border-2 border-secondary rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--palette-background) 96%, var(--palette-secondary) 4%)",
      }}
    >
      <div className="inline-flex items-center justify-center rounded-full border-2 border-primary/70 px-4 py-2">
        <span className="mr-3 inline-block h-8 w-8 rounded-full border-4 border-secondary/60 border-t-primary animate-spin motion-reduce:animate-none" />
        <span className="font-mono text-themed text-base">
          Connecting to Story Buddy…
        </span>
      </div>
      <p className="text-secondary text-sm max-w-xl">
        Setting up your story space. This usually takes just a moment.
      </p>
    </div>
  );
}

