import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border-warm dark:border-[#3a2e24] bg-sand dark:bg-[#13100d] py-12 px-4 md:px-8 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="font-display text-2xl mb-2">
            <span className="text-ember">Yatri</span>
            <span className="text-ink dark:text-[#f5ede4]">bhet</span>
          </h2>
          <p className="font-body text-stone text-sm">
            Discover Nepal, one trail at a time.
          </p>
        </div>

        <nav>
          <h3 className="font-display text-lg mb-4 text-ink dark:text-[#f5ede4]">
            Explore
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/explore"
                className="text-stone hover:text-ember transition-colors text-sm"
              >
                All Places
              </Link>
            </li>
            <li>
              <Link
                href="/routes"
                className="text-stone hover:text-ember transition-colors text-sm"
              >
                Routes & Treks
              </Link>
            </li>
            <li>
              <Link
                href="/religion"
                className="text-stone hover:text-ember transition-colors text-sm"
              >
                Sacred Architecture
              </Link>
            </li>
            <li>
              <Link
                href="/journal"
                className="text-stone hover:text-ember transition-colors text-sm"
              >
                Travel Journal
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="font-display text-lg mb-4 text-ink dark:text-[#f5ede4]">
            Information
          </h3>
          <div className="flex flex-col space-y-2 text-stone text-sm">
            <span>&copy; {new Date().getFullYear()} Yatribhet</span>
            <Link href="/privacy" className="hover:text-ember transition-colors">
              Privacy Policy
            </Link>
            <Link href="/sitemap.xml" className="hover:text-ember transition-colors">
              Sitemap
            </Link>
            <Link href="/contact" className="hover:text-ember transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
