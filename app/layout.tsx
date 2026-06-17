import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CLA Admin Portal",
  description: "Cecilia Learning Academy — Content Management System",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
