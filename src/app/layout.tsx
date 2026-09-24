import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tuvalu Time Machine",
  description: "Explore Tuvalu's nine islands through local climate history and future scenarios.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
