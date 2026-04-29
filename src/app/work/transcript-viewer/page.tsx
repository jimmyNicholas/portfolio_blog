import PageWrapper from "@/app/components/PageWrapper";
import TranscriptViewer from "@/app/components/transcript-viewer/TranscriptViewer";

export default function TranscriptViewerPage() {
  return (
    <PageWrapper maxWidth="max-w-[1500px]">
      <TranscriptViewer />
    </PageWrapper>
  );
}
