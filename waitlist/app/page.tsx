import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Video from "@/components/Video";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Toaster />

      <Header />

      <Hero />

      <div className="xl:flex xl:flex-row">
        <Features />

        <Video />
      </div>

      <CTA />

      <Footer />
    </>
  );
}
