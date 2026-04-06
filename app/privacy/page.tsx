import { StatusPage } from "@/src/components/ui/StatusPage";

export default function PrivacyPage() {
  return (
    <StatusPage
      type="ComingSoon"
      eyebrow="Trust & transparency"
      title="Privacy Policy"
      subtitle="Our commitment to your trust."
      message="We are carefully drafting our data practices with full transparency. You will find our privacy policy here before any public launch."
      primaryButton={{ text: "Return Home", href: "/" }}
    />
  );
}
