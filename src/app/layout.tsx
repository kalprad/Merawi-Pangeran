import type { Metadata } from "next";
import { milkAndHoney, neueMontreal } from "./fonts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ReleaseCountdown from "@/components/ReleaseCountdown";
import { getSettings } from "@/lib/data";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://merawi-pangeran.vercel.app";
const SITE_NAME = "Merawi Pangeran 2026";
const SITE_DESCRIPTION =
  "Portal resmi KKN Merawi Pangeran 2026 di Desa Jetis, Kecamatan Bandungan, Kabupaten Semarang. Berita kegiatan, materi sosialisasi, peta interaktif desa, dan aplikasi SI-Bening.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Merawi Pangeran 2026 — KKN Desa Jetis, Bandungan",
    template: "%s — Merawi Pangeran 2026",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "KKN Merawi Pangeran",
    "KKN Desa Jetis",
    "KKN Bandungan",
    "KKN Kabupaten Semarang",
    "SI-Bening",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: SITE_NAME,
    title: "Merawi Pangeran 2026 — KKN Desa Jetis, Bandungan",
    description: SITE_DESCRIPTION,
    images: [{ url: "/images/hero-gunung.jpg", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Merawi Pangeran 2026 — KKN Desa Jetis, Bandungan",
    description: SITE_DESCRIPTION,
    images: ["/images/hero-gunung.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const serverTime = new Date().getTime();

  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${milkAndHoney.variable} ${neueMontreal.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ReleaseCountdown settings={settings.releaseCountdown} serverTime={serverTime}>
          <Navbar />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </ReleaseCountdown>
      </body>
    </html>
  );
}
