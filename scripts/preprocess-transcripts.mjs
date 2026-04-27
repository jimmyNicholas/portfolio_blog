import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const INPUT_FILES = [
  {
    dataset: "creatives",
    path: path.join(ROOT, "src/temp/creatives_transcripts.html"),
  },
  {
    dataset: "scientists",
    path: path.join(ROOT, "src/temp/scientists_transcripts.html"),
  },
  {
    dataset: "workforce",
    path: path.join(ROOT, "src/temp/workforce_transcripts.html"),
  },
];

const OUTPUT_PATH = path.join(ROOT, "public/data/transcripts.json");

function decodeHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&ndash;/g, "-")
    .replace(/&mdash;/g, "-")
    .replace(/&hellip;/g, "...")
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)));
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, "");
}

function extractRows(html) {
  const rowMatches = html.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];
  const rows = [];

  for (const rowHtml of rowMatches) {
    const cellMatches = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    if (cellMatches.length < 2) continue;

    const firstCell = stripTags(decodeHtml(cellMatches[0][1])).trim();
    const secondCell = stripTags(decodeHtml(cellMatches[1][1])).trim();

    if (!firstCell || !secondCell) continue;
    if (firstCell === "transcript_id" && secondCell === "text") continue;
    rows.push([firstCell, secondCell]);
  }

  return rows;
}

function normalizeSpeaker(rawSpeaker) {
  const speaker = rawSpeaker.toLowerCase();
  if (speaker === "assistant" || speaker === "ai") return "ai";
  if (speaker === "user") return "user";
  return "other";
}

function parseMessages(rawText) {
  const markerRegex = /(Assistant|AI|User):\s*/g;
  const matches = [...rawText.matchAll(markerRegex)];

  if (matches.length === 0) {
    return [{ speaker: "other", label: "Other", text: rawText.trim(), index: 0 }];
  }

  const messages = [];
  for (let i = 0; i < matches.length; i += 1) {
    const current = matches[i];
    const start = current.index + current[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : rawText.length;
    const text = rawText.slice(start, end).trim();
    if (!text) continue;

    const rawLabel = current[1];
    messages.push({
      speaker: normalizeSpeaker(rawLabel),
      label: rawLabel,
      text,
      index: messages.length,
    });
  }

  return messages.length > 0
    ? messages
    : [{ speaker: "other", label: "Other", text: rawText.trim(), index: 0 }];
}

function buildConversation(dataset, transcriptId, rawText) {
  const messages = parseMessages(rawText);
  const searchableText = messages.map((msg) => msg.text).join(" ").toLowerCase();
  const speakerCounts = messages.reduce(
    (acc, message) => {
      acc[message.speaker] = (acc[message.speaker] ?? 0) + 1;
      return acc;
    },
    { ai: 0, user: 0, other: 0 },
  );

  return {
    id: transcriptId,
    dataset,
    rawText,
    searchableText,
    messageCount: messages.length,
    speakerCounts,
    messages,
  };
}

async function main() {
  const allConversations = [];

  for (const input of INPUT_FILES) {
    const html = await fs.readFile(input.path, "utf8");
    const rows = extractRows(html);
    for (const [transcriptId, rawText] of rows) {
      allConversations.push(buildConversation(input.dataset, transcriptId, rawText));
    }
    console.log(`Parsed ${rows.length} transcripts from ${input.dataset}.`);
  }

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(
    OUTPUT_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalConversations: allConversations.length,
        conversations: allConversations,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`Wrote ${allConversations.length} conversations to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
