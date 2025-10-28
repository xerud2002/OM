import type { AppProps } from "next/app";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <main className="pt-[80px]">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}
