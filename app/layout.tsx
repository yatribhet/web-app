import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/components/layout/ThemeProvider";
import { ScrollbarProvider } from "@/src/components/layout/ScrollbarProvider";
import NextTopLoader from "nextjs-toploader";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yatribhet.com"),
  title: {
    default: "Yatribhet — Discover Sacred Places & Hidden Trails",
    template: "%s | Yatribhet",
  },
  description:
    "Explore temples, trekking routes, heritage sites and natural wonders across Nepal. Find opening hours, entry fees, routes and traveller reviews.",
  keywords: [
    "Nepal travel",
    "Nepal temples",
    "trekking Nepal",
    "Nepal heritage sites",
    "visit Nepal",
  ],
  authors: [{ name: "Yatribhet" }],
  creator: "Yatribhet",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yatribhet.com",
    siteName: "Yatribhet",
    images: [{ url: "/og-home.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@yatribhet",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-body">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-ember focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <ScrollbarProvider>{children}</ScrollbarProvider>
          <NextTopLoader
            color="#ea7022"
            height={3}
            showSpinner={false}
            shadow="0 0 10px #ea7022,0 0 5px #ea7022"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
