import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import ChatAssistant from "@/components/ChatAssistant";

export const metadata: Metadata = {
  title: "Los Lozano en Madrid 2026",
  description: "App de viaje para la familia Lozano en Madrid",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  icons: {
    icon: "/logo-lozano-madrid-2026.png",
    shortcut: "/logo-lozano-madrid-2026.png",
    apple: "/logo-lozano-madrid-2026.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Navbar />
        <main>
          {children}
        </main>
        <BottomNav />
        <ChatAssistant />
      </body>
    </html>
  );
}


