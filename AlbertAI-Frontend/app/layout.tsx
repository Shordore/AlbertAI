import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type React from "react"; // Import React
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResearchAI - Transform Your Research with AI Power",
  description:
    "Upload your research papers and let our AI transform them into engaging presentations, podcasts, and visual content.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
