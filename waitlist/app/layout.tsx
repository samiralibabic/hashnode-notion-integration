import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter_Tight({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `Hashion - put your Hashnode blog into Notion`,
  description:
    `Hashion is a Notion integration for Hashnode, which enables you to manage you blog directly in Notion, without changing context or apps.`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />

        <Header />

        {children}

        <Footer />

        <Script id="matomo" src="/matomo.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
