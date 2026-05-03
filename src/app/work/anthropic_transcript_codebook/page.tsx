import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Lora } from "next/font/google";
import CodebookContent from "./CodebookContent";
import styles from "./codebook.module.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-codebook-lora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-codebook-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-codebook-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI-Mediated Creative Practice: A Codebook",
  description:
    "A codebook of how creatives describe AI in their work, drawn from the Anthropic Interviewer dataset.",
};

export default function AnthropicTranscriptCodebookPage() {
  return (
    <div
      className={`${lora.variable} ${inter.variable} ${jetbrainsMono.variable} ${styles.root}`}
    >
      <CodebookContent />
    </div>
  );
}
