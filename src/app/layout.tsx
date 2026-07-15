import type { Metadata } from "next";
import { milkAndHoney, neueMontreal } from "./fonts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Merawi Pangeran 2026 — KKN Desa Jetis, Bandungan",
    template: "%s — Merawi Pangeran 2026",
  },
  description:
    "Portal resmi KKN Merawi Pangeran 2026 di Desa Jetis, Kecamatan Bandungan, Kabupaten Semarang. Berita kegiatan, materi sosialisasi, peta interaktif desa, dan aplikasi SI-Bening.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${milkAndHoney.variable} ${neueMontreal.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
