import { Inter } from "next/font/google";
import "./globals.css";
import "./App.css";
import { Toaster } from "@/app/components/ui/toaster";

export const metadata = {
  title: "IA Preditiva",
  description: "Sistema de Predição de Evasão",
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", });

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        className={`antialiased ${inter.className}`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
