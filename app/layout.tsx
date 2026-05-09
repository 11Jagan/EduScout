import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "EduScout — Find Your Dream College", template: "%s | EduScout" },
  description:
    "Discover, compare, and predict admission chances for top Indian colleges. Search IITs, NITs, AIIMS, IIMs and more with EduScout.",
  keywords: ["college discovery", "JEE", "NEET", "IIT", "NIT", "admission predictor", "India"],
  openGraph: {
    title: "EduScout — College Discovery Platform",
    description: "Find your perfect college match with intelligent search and AI-powered admission predictor.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 -mt-20">{children}</main>
        <footer className="bg-[#FDFDFC] border-t border-gray-100 mt-16">
          <div className="page-container py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">E</span>
                </div>
                <span className="font-bold text-gray-900">EduScout</span>
              </div>
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} EduScout. Developed by{" "}
                <a
                  href="https://konthamjagan.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-black hover:underline underline-offset-4"
                >
                  Kontham Jagan Mohan Reddy
                </a>
              </p>
              <nav className="flex gap-6 text-sm text-gray-500">
                <a href="/colleges" className="hover:text-black transition-colors">Colleges</a>
                <a href="/compare" className="hover:text-black transition-colors">Compare</a>
                <a href="/predictor" className="hover:text-black transition-colors">Predictor</a>
              </nav>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
