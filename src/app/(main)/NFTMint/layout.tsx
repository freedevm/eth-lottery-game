import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Card Shop | ETH Lottery",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
