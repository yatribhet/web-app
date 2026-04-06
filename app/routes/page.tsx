import { StatusPage } from "@/src/components/ui/StatusPage";

export default function RoutesPage() {
  return (
    <StatusPage
      type="ComingSoon"
      eyebrow="In the making"
      title="Routes & Treks"
      subtitle="The path is being paved, stone by stone."
      message="We are carefully mapping the most breathtaking treks and passes across Nepal — from high altitude ridges to hidden monastery routes. Check back soon."
      primaryButton={{ text: "Explore Destinations", href: "/explore" }}
    />
  );
}
