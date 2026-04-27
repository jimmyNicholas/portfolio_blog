import PageWrapper from "@/app/components/PageWrapper";
import TranscriptViewer from "@/app/components/transcript-viewer/TranscriptViewer";

export default function TranscriptViewerPage() {
  return (
    <PageWrapper maxWidth="max-w-[1500px]">
      <section className="space-y-4">
        <header>
          <h1 className="font-mono text-2xl font-bold text-themed">
            Anthropic Interviewer: Conversation Viewer
          </h1>
          <p className="text-sm text-secondary mt-1">
            Browse interview transcripts with searchable, filterable AI/User
            separation. <a href="https://www.anthropic.com/research/anthropic-interviewer" target="_blank" rel="noopener noreferrer">MORE INFO AT THIS LINK</a>
          </p>
        </header>
        <TranscriptViewer />
      </section>
    </PageWrapper>
  );
}
