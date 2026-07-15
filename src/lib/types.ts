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
};

export type Materi = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  fileUrl: string;
};

export type MapPointCategory = "irigasi" | "umkm" | "fasilitas";

export type MapPoint = {
  id: string;
  category: MapPointCategory;
  name: string;
  description: string;
  status: string;
  lat: number;
  lng: number;
};
