import { StatusPage } from "@/src/components/ui/StatusPage";

export default function ReligionPage() {
  return (
    <StatusPage
      type="ComingSoon"
      eyebrow="Sacred & Coming"
      title="Sacred Nepal"
      subtitle="Where faith meets the mountains."
      message="We are documenting the living traditions, pilgrimage routes, and sacred architecture that form the spiritual heart of Nepal. A serene experience is on its way."
      primaryButton={{ text: "Explore Destinations", href: "/explore" }}
    />
  );
}
