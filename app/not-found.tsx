import { StatusPage } from "@/src/components/ui/StatusPage";

export default function NotFound() {
  return (
    <StatusPage
      type="404"
      eyebrow="Lost on the trail"
      title="Path Not Found"
      subtitle="The map shows nothing here."
      message="The trail you followed might have shifted — or perhaps this destination has yet to be charted. Let the compass guide you back."
      primaryButton={{ text: "Return to Basecamp", href: "/" }}
    />
  );
}
