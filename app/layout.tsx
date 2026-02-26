import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ChatAssistant from "@/components/ChatAssistant";

export const metadata: Metadata = {
  title: "Los Lozano en Madrid 2026",
  description: "App de viaje para la familia Lozano en Madrid",
  icons: {
    icon: "/logo-lozano-clean.png",
    shortcut: "/logo-lozano-clean.png",
    apple: "/logo-lozano-clean.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>

        <Navbar />
        <main>
          {children}
        </main>
        <ChatAssistant />
      </body>
    </html>
  );
}


