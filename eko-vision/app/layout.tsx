import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "eKo.vision - See what AI can truly become",
  description: "Hood yogi codes in archetypes. Built with 7 avatar agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
