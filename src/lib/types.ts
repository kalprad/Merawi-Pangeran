export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  author: string;
  category: string;
  relatedMateriId?: string;
};

export type Materi = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  fileUrl: string;
};

export type TutorialCategory = "pengenalan" | "jembatan" | "irigasi" | "talud" | "rab";

/** Empat fitur utama SI-Bening (di luar modul "Pengenalan" pada video tutorial). */
export type FeatureCategory = Exclude<TutorialCategory, "pengenalan">;

export type ReleaseCountdownSettings = {
  enabled: boolean;
  /** Waktu rilis, format ISO datetime-local (mis. "2026-08-17T09:00"). */
  releaseAt: string;
  title?: string;
  message?: string;
};

export type Settings = {
  siBeningUrl: string;
  galleryFolderUrl?: string;
  featureGuideUrls?: Record<FeatureCategory, string>;
  releaseCountdown?: ReleaseCountdownSettings;
  /** Link video profil desa (Google Drive atau YouTube) untuk beranda. */
  profileVideoUrl?: string;
};

export type TutorialVideo = {
  id: string;
  category: TutorialCategory;
  title: string;
  description?: string;
  driveUrl: string;
  order: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  prodi?: string;
  photo: string;
  instagram?: string;
  programs?: string[];
};

export type DivisionMember = {
  name: string;
  programs: string[];
  /** Diisi di tentang/page.tsx dari data tim admin (getTeam()), dicocokkan lewat nama. */
  photo?: string;
};

export type Division = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  members: DivisionMember[];
};

import type { FeatureCollection } from "geojson";

export type MapIconKey =
  | "utensils"
  | "wrench"
  | "shopping-bag"
  | "droplet"
  | "alert-triangle"
  | "home"
  | "heart-pulse"
  | "landmark"
  | "map-pin"
  | "graduation-cap"
  | "sprout"
  | "trees"
  | "factory"
  | "building"
  | "waves"
  | "zap"
  | "store"
  | "fish"
  | "paw-print"
  | "construction"
  | "trash-2"
  | "mountain"
  | "book-open"
  | "camera"
  | "hospital"
  | "mosque";

export type MapLayerCategory = {
  value: string;
  label: string;
  color: string;
  icon: MapIconKey;
  /** Ketebalan garis/outline (px) untuk fitur garis & poligon. Default: 2. */
  weight?: number;
  /** Pola garis Leaflet, mis. "8,6" (putus-putus). Kosong/undefined = garis solid. */
  dashArray?: string;
  /** Opasitas isian poligon, 0-1. Default: 0.35. */
  fillOpacity?: number;
};

export type MapLayerFieldMapping = {
  name: string;
  category?: string;
  googleMaps?: string;
  info?: { label: string; property: string }[];
};

export type MapLayerPhotoConfig =
  | { mode: "none" }
  | { mode: "map"; photoMap: Record<string, string> }
  | { mode: "property"; property: string };

/**
 * Satu file GeoJSON yang diunggah, dikonfigurasi sendiri-sendiri layaknya
 * "layer" pada software GIS (QGIS dkk.) -- punya pemetaan properti, legenda,
 * dan konfigurasi foto masing-masing, terlepas dari sub-layer lain dalam
 * satu jenis peta yang sama.
 */
export type MapSubLayer = {
  id: string;
  geojsonUrl: string;
  /** Nama tampilan di panel layer, default diturunkan dari nama file. */
  name: string;
  fields: MapLayerFieldMapping;
  categories: MapLayerCategory[];
  photo: MapLayerPhotoConfig;
  /** Status tampil default saat peta pertama dibuka. */
  visible: boolean;
};

export type MapLayer = {
  id: string;
  slug: string;
  title: string;
  /**
   * Urutan array = urutan panel & urutan tumpukan render (indeks 0 = paling
   * atas panel = paling atas tumpukan peta), mirip panel layer software GIS.
   */
  sublayers: MapSubLayer[];
  downloadUrl?: string;
  order: number;
};

export type ResolvedMapSubLayer = MapSubLayer & {
  geojson: FeatureCollection;
};

export type ResolvedMapLayer = Omit<MapLayer, "sublayers"> & {
  sublayers: ResolvedMapSubLayer[];
};
