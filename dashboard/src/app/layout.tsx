import type { Metadata } from "next";
import { Nova_Round } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import "./globals.css";

const novaRound = Nova_Round({
  variable: "--font-nova",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "ATHAR — The agentic travel guide for Algeria",
  description:
    "Discover wilayas, plan optimized itineraries, find stays and get real transport options across Algeria.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${novaRound.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        suppressHydrationWarning
      >
        <SiteHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
