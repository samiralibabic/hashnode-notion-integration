import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Video from "@/components/Video";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />

      <div className="xl:flex xl:flex-row">
        <Features />

        <Video />
      </div>

      <CTA />
    </>
  );
}
