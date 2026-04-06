import { StatusPage } from "@/src/components/ui/StatusPage";

export default function ContactPage() {
  return (
    <StatusPage
      type="ComingSoon"
      eyebrow="Reach out"
      title="Contact Us"
      subtitle="Help is always at the next camp."
      message="Our contact channels are being set up. Whether you have a question, a suggestion, or a story to share — we will be ready to listen very soon."
      primaryButton={{ text: "Explore the Map", href: "/explore" }}
    />
  );
}
