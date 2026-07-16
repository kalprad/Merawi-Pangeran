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

export type TutorialCategory = "jembatan" | "irigasi" | "talud" | "rab";

export type Settings = {
  siBeningUrl: string;
  galleryFolderUrl?: string;
  featureGuideUrls?: Record<TutorialCategory, string>;
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
  | "camera";

export type MapLayerCategory = {
  value: string;
  label: string;
  color: string;
  icon: MapIconKey;
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

export type MapLayer = {
  id: string;
  slug: string;
  title: string;
  geojsonUrl: string;
  fields: MapLayerFieldMapping;
  categories: MapLayerCategory[];
  photo: MapLayerPhotoConfig;
  downloadUrl?: string;
  order: number;
};

export type ResolvedMapLayer = MapLayer & {
  geojson: FeatureCollection;
};
