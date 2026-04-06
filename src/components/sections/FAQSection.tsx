"use client";

import { Accordion } from "../ui/Accordion";
import { FAQ } from "../../types/place";

interface FAQSectionProps {
  faqs: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="mt-8 pt-6 border-t border-border-warm dark:border-[#3a2e24]">
      <h3 className="font-display text-xl mb-4 text-ink dark:text-[#f5ede4]">
        Frequently Asked Questions
      </h3>
      <Accordion items={faqs} />
    </section>
  );
}
