import type { Metadata, Viewport } from "next";
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
    default: "speed test by Dcintelix",
    template: "%s | DCINTELIX CO LTD",
  },
  description:
    "Check internet performance, compare ISP rankings in Rwanda and East Africa, and explore public analytics dashboards. Powered by DCINTELIX CO LTD. innovate. build. grow.",
  keywords: [
    "speed test",
    "internet speed",
    "download speed",
    "upload speed",
    "ping",
    "network test",
    "ISP rankings Rwanda",
    "East Africa internet performance",
    "public analytics dashboard",
    "DCINTELIX CO LTD",
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
  metadataBase: new URL("https://speed.dcintelix.rw"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://speed.dcintelix.rw",
    siteName: "DCINTELIX CO LTD Speed Performance",
    title: "DCINTELIX CO LTD Internet Speed Performance",
    description:
      "Check internet performance, compare ISP rankings in Rwanda and East Africa, and explore public analytics dashboards. Powered by DCINTELIX CO LTD. innovate. build. grow.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DCINTELIX CO LTD Speed Performance",
    description: "Check internet performance, compare ISP rankings in Rwanda and East Africa, and explore public analytics dashboards. Powered by DCINTELIX CO LTD. innovate. build. grow.",
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
    "@type": "WebSite",
    name: "DCintelix Internet Speed Performance ",
    url: "https://speed.dcintelix.rw",
    description:
      "Premium futuristic internet speed performance platform. Ckeck your download, upload speeds and ping with precision.",
    publisher: {
      "@type": "Organization",
      name: "DCintelix",
      url: "https://www.dcintelix.rw",
    },
    potentialAction: {
      "@type": "HowTo",
      name: "Check Your Internet Speed",
      description:
        "Learn how to test your internet download speed, upload speed, and ping with DCintelix Speed Test.",
      step: [
        {
          "@type": "HowToStep",
          name: "Open Speed Performance",
          text: "Visit speed.dcintelix.rw to start testing your internet connection.",
          url: "https://speed.dcintelix.rw",
        },
        {
          "@type": "HowToStep",
          name: "Automatic Server Selection",
          text: "The platform automatically selects the best server near you for accurate results.",
        },
        {
          "@type": "HowToStep",
          name: "Ping Speed",
          text: "Measures the latency of your connection in milliseconds.",
        },
        {
          "@type": "HowToStep",
          name: "Download Speed",
          text: "Tests your download speed by measuring how fast data is received from the server.",
        },
        {
          "@type": "HowToStep",
          name: "Upload Speed",
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
      <head>
        <link rel="icon" type="image/png" href="/dc-speed-icon-logo.png" />
        <link rel="shortcut icon" href="/dc-speed-icon-logo.png" />
        <link rel="icon" href="/dc-speed-icon-logo.png" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <AppBootLoader>{children}</AppBootLoader>
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
