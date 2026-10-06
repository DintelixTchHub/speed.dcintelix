import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { AppBootLoader } from "@/components/AppBootLoader";
import { Providers } from "@/components/Providers";
import { ToastContainer } from "@/components/Toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#00FF88",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: {
    default: "Free Internet Speed Test in Rwanda | DCintelix",
    template: "%s | DCintelix",
  },
  description:
    "Run a free internet speed test in Rwanda and East Africa. Check download speed, upload speed, ping, and jitter, then explore measured ISP rankings.",
  keywords: [
    "internet speed test Rwanda",
    "free speed test",
    "Rwanda internet speed test",
    "East Africa speed test",
    "internet speed test online",
    "internet speed checker",
    "download speed",
    "upload speed",
    "ping test",
    "jitter test",
    "internet latency test",
    "Rwanda ISP rankings",
    "internet providers Rwanda",
    "DCintelix speed test",
  ],
  authors: [{ name: "DCintelix" }],
  creator: "DCintelix",
  publisher: "DCintelix",
  metadataBase: new URL("https://speed.dcintelix.rw"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_RW",
    url: "https://speed.dcintelix.rw",
    siteName: "DCintelix Speed Test",
    title: "Free Internet Speed Test in Rwanda | DCintelix",
    description:
      "Run a free internet speed test in Rwanda and East Africa. Check download speed, upload speed, ping, and jitter, then explore measured ISP rankings.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Internet Speed Test in Rwanda | DCintelix",
    description:
      "Check download speed, upload speed, ping, and jitter with the free DCintelix internet speed test.",
    site: "@dcintelix",
    creator: "@dcintelix",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/dc-speed-icon-logo.png", sizes: "512x512", type: "image/png" },
      { url: "/dc-speed-icon-logo.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/dc-speed-icon-logo.png",
    apple: "/dc-speed-icon-logo.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DCintelix Speed Performance",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://speed.dcintelix.rw/#organization",
        name: "DCintelix",
        url: "https://speed.dcintelix.rw",
      },
      {
        "@type": "WebSite",
        "@id": "https://speed.dcintelix.rw/#website",
        name: "DCintelix Speed Test",
        url: "https://speed.dcintelix.rw",
        description:
          "Free internet speed testing and measured ISP rankings for Rwanda and East Africa.",
        publisher: { "@id": "https://speed.dcintelix.rw/#organization" },
        inLanguage: "en",
      },
      {
        "@type": "WebApplication",
        "@id": "https://speed.dcintelix.rw/#speed-test",
        name: "DCintelix Internet Speed Test",
        url: "https://speed.dcintelix.rw/speed-test",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        description:
          "Test internet download speed, upload speed, latency, and jitter, and explore ISP performance rankings.",
        publisher: { "@id": "https://speed.dcintelix.rw/#organization" },
        inLanguage: "en",
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" type="image/png" href="/dc-speed-icon-logo.png" />
        <link rel="shortcut icon" href="/dc-speed-icon-logo.png" />
        <link rel="icon" href="/dc-speed-icon-logo.png" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7311896348376608"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        <Providers>
          <AppBootLoader>{children}</AppBootLoader>
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
