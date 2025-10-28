"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] bg-gradient-to-b from-white to-emerald-50/30 pt-[80px]">
        {children}
      </main>
      <Footer />
    </>
  );
}
