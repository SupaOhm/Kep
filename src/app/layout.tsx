import type { Metadata, Viewport } from "next";
import { ThemeScript } from "@/features/settings/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kep",
  description: "Know where your money went.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kep"
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
