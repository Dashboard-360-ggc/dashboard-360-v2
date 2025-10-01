// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar"; // Importamos el nuevo componente

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard El Carbonazo",
  description: "Panel de control para gestión de restaurante",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-100">
          <Sidebar /> {/* <-- Aquí está tu menú */}
          <main className="flex-1 overflow-y-auto">
            {children} {/* <-- Aquí se mostrará el contenido de cada página */}
          </main>
        </div>
      </body>
    </html>
  );
}