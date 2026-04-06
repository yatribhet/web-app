"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BadgeCheck, Star } from "lucide-react";
import { PlaceDocument } from "@/src/types/place";

export function TitleBlock({ place }: { place: PlaceDocument }) {
  const ratingInt = Math.floor(place.famousRating);
  const fractionStr = (place.famousRating % 1).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <div className="flex flex-col gap-2 relative">
        <h1 className="font-display text-3xl lg:text-4xl text-ink dark:text-[#f5ede4] flex items-center gap-2 flex-wrap">
          {place.name}
          {place.lastVerifiedAt !== null && (
            <BadgeCheck 
              size={24} 
              className="text-[#2d6ea8] fill-[#2d6ea8] stroke-white dark:stroke-[#13100d] drop-shadow-sm flex-shrink-0" 
              role="img"
              aria-label="Verified destination"
              // title={`Authenticated by Yatribhet on ${new Date(place.lastVerifiedAt).toLocaleDateString()}`}
            />
          )}
        </h1>
        <div className="flex items-center gap-3 text-sm text-stone mt-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => {
              const isFull = i < ratingInt;
              const isPartial = i === ratingInt && parseFloat(fractionStr) > 0;
              const fraction = isPartial ? parseFloat(fractionStr) : 0;
              return (
                <div key={i} className="relative w-4 h-4">
                  <Star size={16} className="text-stone/30" />
                  {(isFull || isPartial) && (
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: isFull ? "100%" : `${fraction * 100}%` }}
                    >
                      <Star size={16} className="fill-ember stroke-ember" />
                    </div>
                  )}
                </div>
              );
            })}
            <span className="ml-1 text-ink dark:text-[#f5ede4] font-medium">{place.famousRating}</span>
          </div>
          <span>&middot;</span>
          <span className="capitalize text-stone/80">
            {place.structuredData.schemaType} · {place.placeType}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function DescriptionBlock({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = description.length > 200;

  return (
    <div className="mb-6">
      <AnimatePresence initial={false}>
        <motion.div
          animate={{ height: expanded || !needsTruncation ? "auto" : "4.5rem" }}
          className="overflow-hidden relative"
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <p className="font-body font-light text-stone text-sm leading-relaxed whitespace-pre-line">
            {description}
          </p>
          {!expanded && needsTruncation && (
            <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-sand dark:from-[#13100d] to-transparent pointer-events-none" />
          )}
        </motion.div>
      </AnimatePresence>
      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-ember text-sm hover:underline focus-visible:outline-none"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export function KeyFactsList({ facts }: { facts: string[] }) {
  return (
    <motion.ul
      variants={{ container: { transition: { staggerChildren: 0.06 } } }}
      initial="hidden"
      animate="visible"
      className="flex flex-col"
    >
      {facts.map((fact, index) => (
        <motion.li
          key={index}
          variants={{
            hidden: { opacity: 0, x: -10 },
            visible: { opacity: 1, x: 0 },
          }}
          className={`flex items-start gap-3 py-3 border-border-warm dark:border-[#3a2e24] ${
            index !== facts.length - 1 ? "border-b" : ""
          }`}
        >
          <div className="w-1.5 h-1.5 bg-ember mt-2 flex-shrink-0" />
          <span className="font-body font-light text-stone text-[13px] leading-relaxed">
            {fact}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
