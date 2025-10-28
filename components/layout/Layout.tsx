"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] pt-[80px] bg-gradient-to-b from-white to-emerald-50/30">
        {children}
      </main>
      <Footer />
    </>
  );
}
