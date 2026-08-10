import HeroSection from "@/components/home/HeroSection";
import TrendingDestinations from "@/components/home/TrendingDestinations";
import ArtisansSection from "@/components/home/ArtisansSection";
import BlogsSection from "@/components/home/BlogsSection";
import ReviewsSection from "@/components/home/ReviewsSection";

export const metadata = {
  title: "ATHAR — the agentic travel guide for Algeria",
  description:
    "The agentic travel guide for Algeria. Know where you want to go or get inspired — ATHAR plans the itinerary, picks the stays and handles the details.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <HeroSection />
      <TrendingDestinations />
      <ArtisansSection />
      <BlogsSection />
      <ReviewsSection />
    </main>
  );
}
