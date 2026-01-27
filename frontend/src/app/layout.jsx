import "./globals.css";
import MainLayout from "./components/MainLayout";

export const metadata = {
  title: "IA Preditiva",
  description: "Sistema de Predição de Evasão",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        className={`antialiased`}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
