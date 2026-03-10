import { useEffect, useRef } from "react";
import {
  STORY_PAYLOAD_MESSAGE_TYPE,
  StoryPayload,
  normalizeChoices,
  parseStoryPayloadFromTrace,
  payloadHasUnresolvedPlaceholders,
  resolveMessageToPlayer,
} from "./storyBuddyUtils";

type VoiceflowChat = {
  load: (config: object) => Promise<void>;
  interact?: (payload: {
    type: "choice_selected" | "custom_input";
    payload: {
      choice_index?: string;
      choice_text: string;
      is_custom: boolean;
    };
  }) => void;
};

declare global {
  interface Window {
    voiceflow?: {
      chat: VoiceflowChat;
    };
  }
}

type UseStoryBuddyVoiceflowParams = {
  scriptLoaded: boolean;
  targetRef: { current: HTMLDivElement | null };
  setPayload: (payload: StoryPayload | null) => void;
  setChoicesState: (choices: string[]) => void;
  setStorySoFarState: (story: string) => void;
  setMessageToPlayerState: (message: string) => void;
  setFinalTitleState: (title: string) => void;
  setFinalStoryState: (story: string) => void;
  setIsWaitingForPayload: (waiting: boolean) => void;
};

export function useStoryBuddyVoiceflow({
  scriptLoaded,
  targetRef,
  setPayload,
  setChoicesState,
  setStorySoFarState,
  setMessageToPlayerState,
  setFinalTitleState,
  setFinalStoryState,
  setIsWaitingForPayload,
}: UseStoryBuddyVoiceflowParams) {
  const setPayloadRef = useRef(setPayload);
  setPayloadRef.current = setPayload;

  // Receive payload from extension (custom event same-window, postMessage from iframe)
  useEffect(() => {
    const onEvent = (e: Event) => {
      const d = (e as CustomEvent<{ payload?: StoryPayload }>).detail;
      if (d?.payload != null) setPayloadRef.current(d.payload);
    };
    const onMessage = (e: MessageEvent) => {
      const d = e.data;
      if (d?.type === STORY_PAYLOAD_MESSAGE_TYPE && d.payload != null) {
        setPayloadRef.current(d.payload as StoryPayload);
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
        const trace = (args as {
          trace?: { payload?: unknown; type?: string };
        }).trace;
        if (!trace) return false;
        const parsed = parseStoryPayloadFromTrace(trace);
        if (parsed != null) return true;
        const raw = trace.payload;
        if (raw == null) return false;
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
              console.warn(
                "[Story Buddy] matched trace but could not parse payload",
                trace.type,
                raw.slice(0, 300)
              );
              return;
            }
          } else if (typeof raw === "object" && raw !== null) {
            p = raw as StoryPayload;
          } else {
            return;
          }
        }

        const normalized = normalizeChoices(p);
        if (normalized.length > 0) {
          p = { ...p, choices: normalized };
          setChoicesState(normalized);
        }

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

        if (
          hasStoryUpdate ||
          hasMsgUpdate ||
          hasFinalUpdate ||
          normalized.length > 0
        ) {
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
            new CustomEvent(STORY_PAYLOAD_MESSAGE_TYPE, {
              detail: { payload: p },
            })
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
  }, [
    scriptLoaded,
    targetRef,
    setChoicesState,
    setStorySoFarState,
    setMessageToPlayerState,
    setFinalTitleState,
    setFinalStoryState,
    setIsWaitingForPayload,
  ]);
}

