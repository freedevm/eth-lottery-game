import ScrollTop from "@/components/ScrollTop";

import { ReactNode } from "react";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-900 to-black text-white">
      <Header />
      <div className="pt-12 sm:pt-16 md:pt-20 pb-4 flex-auto">
        {children}
      </div>
      <Footer />
      <ScrollTop />
    </div>
  );
}
