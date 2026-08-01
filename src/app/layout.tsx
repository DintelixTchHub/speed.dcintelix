import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    default: "DCintelix Speed Test",
    template: "%s | DCintelix",
  },
  description:
    "Premium futuristic internet speed test platform. Test your download, upload speeds and ping with DCintelix - the next generation internet intelligence platform.",
  keywords: [
    "speed test",
    "internet speed",
    "download speed",
    "upload speed",
    "ping",
    "network test",
    "DCintelix",
    "bandwidth",
    "latency",
    "jitter",
    "ISP speed test",
    "broadband test",
    "connection test",
    "Rwanda internet",
    "fast speed test",
    "accurate speed test",
    "internet quality test",
  ],
  authors: [{ name: "DCintelix" }],
  creator: "DCintelix",
  publisher: "DCintelix",
  metadataBase: new URL("https://speedtest.dcintelix.rw"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://speedtest.dcintelix.rw",
    siteName: "DCintelix Speed Test",
    title: "DCintelix Speed Test - Premium Internet Intelligence",
    description:
      "Premium futuristic internet speed test platform. Test your download, upload speeds and ping with precision.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DCintelix Speed Test",
    description: "Premium futuristic internet speed test platform. Test your download, upload speeds and ping with precision.",
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
    icon: "/dc-speed-icon-logo.png",
    apple: "/dc-speed-icon-logo.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DCintelix Speed Test",
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
    "@type": "WebSite",
    name: "DCintelix Speed Test",
    url: "https://speedtest.dcintelix.rw",
    description:
      "Premium futuristic internet speed test platform. Test your download, upload speeds and ping with precision.",
    publisher: {
      "@type": "Organization",
      name: "DCintelix",
      url: "https://speedtest.dcintelix.rw",
    },
    potentialAction: {
      "@type": "HowTo",
      name: "Test Your Internet Speed",
      description:
        "Learn how to test your internet download speed, upload speed, and ping with DCintelix Speed Test.",
      step: [
        {
          "@type": "HowToStep",
          name: "Open Speed Test",
          text: "Visit speedtest.dcintelix.rw to start testing your internet connection.",
          url: "https://speedtest.dcintelix.rw",
        },
        {
          "@type": "HowToStep",
          name: "Automatic Server Selection",
          text: "The platform automatically selects the best server near you for accurate results.",
        },
        {
          "@type": "HowToStep",
          name: "Ping Test",
          text: "Measures the latency of your connection in milliseconds.",
        },
        {
          "@type": "HowToStep",
          name: "Download Test",
          text: "Tests your download speed by measuring how fast data is received from the server.",
        },
        {
          "@type": "HowToStep",
          name: "Upload Test",
          text: "Tests your upload speed by measuring how fast data is sent to the server.",
        },
        {
          "@type": "HowToStep",
          name: "View Results",
          text: "Get detailed results including download speed, upload speed, ping, jitter, and ISP information.",
        },
      ],
    },
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
