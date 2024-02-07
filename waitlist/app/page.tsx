import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Toaster />

      <Header />

      <Hero />

      <Features />

      <Footer />

    </>
  );
}
