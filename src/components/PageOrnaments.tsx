import SakuraDecor from "@/components/SakuraDecor";

/**
 * Lapisan dekoratif untuk bagian atas halaman: gradient lembut yang menyatu
 * dengan latar + bunga sakura di pojok. Dipasang sebagai anak pertama dari
 * wrapper `relative overflow-hidden` selebar halaman (bukan kotak kecil),
 * supaya gradasinya memudar secara alami dan tidak terlihat terpotong.
 */
export default function PageOrnaments() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-[26rem]"
      aria-hidden="true"
    >
      <div
        className="aurora-blob aurora-rosy h-80 w-80 sm:h-[28rem] sm:w-[28rem]"
        style={{ top: "-10rem", right: "-6rem" }}
      />
      <div
        className="aurora-blob aurora-teal h-96 w-96 sm:h-[32rem] sm:w-[32rem]"
        style={{ top: "-12rem", left: "-10rem", animationDelay: "-7s" }}
      />
      <div
        className="aurora-blob aurora-moss h-64 w-64 sm:h-80 sm:w-80"
        style={{ top: "6rem", left: "30%", animationDelay: "-12s" }}
      />
      <div className="pointer-events-auto absolute top-6 right-4 sm:top-8 sm:right-10">
        <SakuraDecor className="h-14 w-14 opacity-50 sm:h-20 sm:w-20" />
      </div>
    </div>
  );
}
