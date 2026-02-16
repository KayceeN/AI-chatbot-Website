import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "@/styles/globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
});

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "kAyphI",
  description: "Single-page AI agency website rebuilt from the reference recording."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} min-h-screen bg-canvas text-ink antialiased`}>{children}</body>
    </html>
  );
}
