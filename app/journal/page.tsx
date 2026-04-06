import { StatusPage } from "@/src/components/ui/StatusPage";

export default function JournalPage() {
  return (
    <StatusPage
      type="ComingSoon"
      eyebrow="Stories from the field"
      title="The Journal"
      subtitle="Every journey deserves to be told."
      message="We are gathering stories from the trails — honest, firsthand travel writing from the peaks, plains, and river valleys of Nepal. Your voice belongs here too."
      primaryButton={{ text: "Discover Places", href: "/explore" }}
    />
  );
}
