import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const headingFont = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const title = "Nivaas — Home Loan EMI Calculator";
const description =
  "Calculate your home loan EMI instantly. Built for Indian borrowers — loans from ₹1 lakh to ₹5 crore, rates from 6% to 20%, tenures up to 30 years.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "home loan EMI calculator",
    "EMI calculator India",
    "housing loan calculator",
    "SBI home loan EMI",
    "HDFC home loan EMI",
    "ICICI home loan EMI",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_IN",
    siteName: "Nivaas",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#15192b",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">{children}</body>
    </html>
  );
}
