"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  LayersControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";
import {
  MapPin,
  Utensils,
  Wrench,
  ShoppingBag,
  Droplet,
  AlertTriangle,
  Home,
  HeartPulse,
  Landmark,
  GraduationCap,
  Sprout,
  Trees,
  Factory,
  Building,
  Waves,
  Zap,
  Store,
  Fish,
  PawPrint,
  Construction,
  Trash2,
  Mountain,
  BookOpen,
  Camera,
  Download,
  Layers,
  ChevronDown,
  Check,
  type LucideIcon,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import type {
  MapIconKey,
  MapLayerCategory,
  ResolvedMapLayer,
} from "@/lib/types";

const BOUNDARY_COLOR = "#E4402F";

const ICON_COMPONENTS: Record<MapIconKey, LucideIcon> = {
  utensils: Utensils,
  wrench: Wrench,
  "shopping-bag": ShoppingBag,
  droplet: Droplet,
  "alert-triangle": AlertTriangle,
  home: Home,
  "heart-pulse": HeartPulse,
  landmark: Landmark,
  "map-pin": MapPin,
  "graduation-cap": GraduationCap,
  sprout: Sprout,
  trees: Trees,
  factory: Factory,
  building: Building,
  waves: Waves,
  zap: Zap,
  store: Store,
  fish: Fish,
  "paw-print": PawPrint,
  construction: Construction,
  "trash-2": Trash2,
  mountain: Mountain,
  "book-open": BookOpen,
  camera: Camera,
};

const ICON_PATHS: Record<MapIconKey, string> = {
  utensils:
    '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  wrench:
    '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/>',
  "shopping-bag":
    '<path d="M16 10a4 4 0 0 1-8 0"/><path d="M3.103 6.034h17.794"/><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/>',
  droplet:
    '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  "alert-triangle":
    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  home:
    '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  "heart-pulse":
    '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/><path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
  landmark:
    '<path d="M10 18v-7"/><path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/><path d="M6 18v-7"/>',
  "map-pin":
    '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  "graduation-cap":
    '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  sprout:
    '<path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/>',
  trees:
    '<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/>',
  factory:
    '<path d="M12 16h.01"/><path d="M16 16h.01"/><path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><path d="M8 16h.01"/>',
  building:
    '<path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M12 6h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/><path d="M8 6h.01"/><path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/><rect x="4" y="2" width="16" height="20" rx="2"/>',
  waves:
    '<path d="M2 12q2.5 2 5 0t5 0 5 0 5 0"/><path d="M2 19q2.5 2 5 0t5 0 5 0 5 0"/><path d="M2 5q2.5 2 5 0t5 0 5 0 5 0"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  store:
    '<path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5"/><path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244"/><path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05"/>',
  fish:
    '<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/><path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/><path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4"/><path d="m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98"/>',
  "paw-print":
    '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>',
  construction:
    '<rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/>',
  "trash-2":
    '<path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
  "book-open":
    '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  camera:
    '<path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"/><circle cx="12" cy="13" r="3"/>',
};

const FALLBACK_CATEGORY: MapLayerCategory = {
  value: "",
  label: "Lainnya",
  color: "#6b7280",
  icon: "map-pin",
};

function createDivIcon(color: string, icon: MapIconKey): L.DivIcon {
  return L.divIcon({
    html: `<span style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.35);"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[icon]}</svg></span>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getFeatureName(feature: Feature, layer: ResolvedMapLayer): string {
  const props = (feature.properties ?? {}) as Record<string, unknown>;
  return String(props[layer.fields.name] ?? "").trim();
}

function getFeatureCategory(
  feature: Feature,
  layer: ResolvedMapLayer,
): MapLayerCategory | undefined {
  if (!layer.fields.category) return undefined;
  const props = (feature.properties ?? {}) as Record<string, unknown>;
  const raw = props[layer.fields.category];
  if (raw == null) return undefined;
  const value = String(raw).trim().toLowerCase();
  return layer.categories.find((c) => c.value.trim().toLowerCase() === value);
}

function getFeatureGoogleMaps(feature: Feature, layer: ResolvedMapLayer): string | null {
  if (!layer.fields.googleMaps) return null;
  const props = (feature.properties ?? {}) as Record<string, unknown>;
  const raw = props[layer.fields.googleMaps];
  return typeof raw === "string" && raw.trim() ? raw : null;
}

function getFeatureInfo(
  feature: Feature,
  layer: ResolvedMapLayer,
): { label: string; value: string }[] {
  const props = (feature.properties ?? {}) as Record<string, unknown>;
  return (layer.fields.info ?? [])
    .map((f) => ({ label: f.label, value: props[f.property] }))
    .filter((f): f is { label: string; value: string | number } => {
      return f.value != null && String(f.value).trim() !== "";
    })
    .map((f) => ({ label: f.label, value: String(f.value) }));
}

function getFeaturePhoto(
  feature: Feature,
  layer: ResolvedMapLayer,
  name: string,
): string | null {
  if (layer.photo.mode === "map") return layer.photo.photoMap[name] ?? null;
  if (layer.photo.mode === "property") {
    const props = (feature.properties ?? {}) as Record<string, unknown>;
    const raw = props[layer.photo.property];
    return typeof raw === "string" && raw.trim() ? raw : null;
  }
  return null;
}

function buildPopupHtml(feature: Feature, layer: ResolvedMapLayer): string {
  const name = getFeatureName(feature, layer);
  const category = getFeatureCategory(feature, layer);
  const info = getFeatureInfo(feature, layer);
  const gmaps = getFeatureGoogleMaps(feature, layer);

  const parts: string[] = ['<div style="min-width:180px">'];
  if (category) {
    parts.push(
      `<span style="font-size:10px;font-weight:600;text-transform:uppercase;color:#fff;background:${category.color};padding:2px 8px;border-radius:9999px;">${escapeHtml(category.label)}</span>`,
    );
  }
  parts.push(
    `<p style="margin-top:4px;font-weight:600;color:#0a3323;">${escapeHtml(name)}</p>`,
  );
  for (const f of info) {
    parts.push(
      `<p style="font-size:12px;color:#6b7280;"><b>${escapeHtml(f.label)}:</b> ${escapeHtml(f.value)}</p>`,
    );
  }
  if (gmaps) {
    parts.push(
      `<a href="${encodeURI(gmaps)}" target="_blank" rel="noopener noreferrer" style="margin-top:6px;display:inline-flex;align-items:center;gap:4px;border-radius:9999px;background:#105666;padding:4px 12px;font-size:12px;font-weight:500;color:#fff;">Buka di Google Maps</a>`,
    );
  }
  parts.push("</div>");
  return parts.join("");
}

function FitToData({
  boundary,
  activeGeojson,
}: {
  boundary: FeatureCollection<Polygon | MultiPolygon>;
  activeGeojson: FeatureCollection;
}) {
  const map = useMap();

  useEffect(() => {
    const layers: L.Layer[] = [];
    if (boundary.features.length > 0) layers.push(L.geoJSON(boundary));
    if (activeGeojson.features.length > 0) layers.push(L.geoJSON(activeGeojson));
    if (layers.length === 0) return;

    const bounds = L.featureGroup(layers).getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [32, 32] });
    }
  }, [boundary, activeGeojson, map]);

  return null;
}

function LayerDropdown({
  layers,
  activeLayer,
  onSelect,
}: {
  layers: ResolvedMapLayer[];
  activeLayer: ResolvedMapLayer;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderDropdown, setRenderDropdown] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    if (open) {
      // Mounts the dropdown immediately so the next frame's opacity/scale
      // flip has something to animate; this is a rare, user-triggered
      // toggle.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRenderDropdown(true);
      const raf = requestAnimationFrame(() => setDropdownVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setDropdownVisible(false);
    const timeout = setTimeout(() => setRenderDropdown(false), 200);
    return () => clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="glass-card flex cursor-pointer items-center gap-2.5 rounded-full py-2.5 pr-4 pl-4 text-sm font-semibold text-[var(--color-dark-green)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
      >
        <Layers size={16} className="text-[var(--color-midnight-teal)]" />
        {activeLayer.title}
        <ChevronDown
          size={16}
          className={`text-[var(--color-muted-foreground)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {renderDropdown && (
        <ul
          role="listbox"
          data-state={dropdownVisible ? "open" : "closed"}
          className="glass-card absolute top-full left-0 z-[3000] mt-2 w-64 overflow-hidden rounded-2xl p-1.5 origin-top-left transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100"
        >
          {layers.map((layer) => {
            const selected = layer.id === activeLayer.id;
            return (
              <li key={layer.id} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(layer.id);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors duration-150 ${
                    selected
                      ? "bg-[var(--color-dark-green)] text-[var(--color-beige)]"
                      : "text-[var(--color-dark-green)] hover:bg-white/50"
                  }`}
                >
                  {layer.title}
                  {selected && <Check size={14} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const DEFAULT_CENTER: [number, number] = [-7.2178, 110.3266];

export default function InteractiveMap({
  layers,
  boundary,
}: {
  layers: ResolvedMapLayer[];
  boundary: FeatureCollection<Polygon | MultiPolygon>;
}) {
  const [activeLayerId, setActiveLayerId] = useState(layers[0]?.id ?? "");
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(layers[0]?.categories.map((c) => c.value) ?? []),
  );
  const [boundaryVisible, setBoundaryVisible] = useState(true);

  const activeLayer = useMemo(
    () => layers.find((l) => l.id === activeLayerId) ?? layers[0],
    [layers, activeLayerId],
  );

  // Reset kategori aktif saat jenis peta berganti (pola "adjust state saat
  // prop berubah" dari dokumentasi React: setState di badan render, bukan
  // di dalam efek, supaya tidak memicu render tambahan yang tidak perlu).
  const [categoriesResetForLayerId, setCategoriesResetForLayerId] = useState(activeLayerId);
  if (activeLayer && categoriesResetForLayerId !== activeLayer.id) {
    setCategoriesResetForLayerId(activeLayer.id);
    setActiveCategories(new Set(activeLayer.categories.map((c) => c.value)));
  }

  const pointFeatures = useMemo(
    () =>
      (activeLayer?.geojson.features ?? []).filter(
        (f) => f.geometry?.type === "Point",
      ),
    [activeLayer],
  );

  const otherFeatures = useMemo(
    () =>
      (activeLayer?.geojson.features ?? []).filter(
        (f) => f.geometry && f.geometry.type !== "Point",
      ),
    [activeLayer],
  );

  const otherFeaturesCollection: FeatureCollection = useMemo(
    () => ({ type: "FeatureCollection", features: otherFeatures }),
    [otherFeatures],
  );

  const visiblePointFeatures = useMemo(
    () =>
      pointFeatures.filter((f) => {
        if (!activeLayer) return false;
        const category = getFeatureCategory(f, activeLayer);
        const value = category?.value ?? FALLBACK_CATEGORY.value;
        return activeCategories.has(value) || !category;
      }),
    [pointFeatures, activeCategories, activeLayer],
  );

  if (!activeLayer) {
    return (
      <p className="text-sm text-[var(--color-muted-foreground)]">
        Belum ada jenis peta yang tersedia.
      </p>
    );
  }

  function toggleCategory(value: string) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  return (
    <div>
      <div className="relative z-10 mb-4 flex flex-wrap items-center gap-3">
        <LayerDropdown layers={layers} activeLayer={activeLayer} onSelect={setActiveLayerId} />

        {activeLayer.downloadUrl && (
          <a
            href={activeLayer.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#fff" }}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-midnight-teal)] px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
          >
            <Download size={16} />
            Unduh Peta (Hasil GIS)
          </a>
        )}
      </div>

      <div className="relative z-0 h-[480px] w-full overflow-hidden rounded-3xl border border-[var(--color-border)] sm:h-[560px]">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={14}
          scrollWheelZoom
          dragging
          doubleClickZoom
          className="h-full w-full"
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Peta Standar">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Citra Satelit (Esri)">
              <TileLayer
                attribution="Tiles &copy; Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Citra Satelit (Google)">
              <TileLayer
                attribution="Imagery &copy; Google"
                url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          <FitToData boundary={boundary} activeGeojson={activeLayer.geojson} />

          {boundaryVisible && boundary.features.length > 0 && (
            <GeoJSON
              data={boundary}
              style={() => ({
                color: BOUNDARY_COLOR,
                weight: 2.5,
                fillColor: BOUNDARY_COLOR,
                fillOpacity: 0.03,
              })}
            />
          )}

          {otherFeatures.length > 0 && (
            <GeoJSON
              key={activeLayer.id}
              data={otherFeaturesCollection}
              style={(feature) => {
                const category = feature ? getFeatureCategory(feature, activeLayer) : undefined;
                const color = category?.color ?? FALLBACK_CATEGORY.color;
                return { color, weight: 2, fillColor: color, fillOpacity: 0.35 };
              }}
              onEachFeature={(feature, layerInstance) => {
                layerInstance.bindPopup(buildPopupHtml(feature, activeLayer));
              }}
            />
          )}

          {visiblePointFeatures.map((feature, index) => {
            const name = getFeatureName(feature, activeLayer);
            const category = getFeatureCategory(feature, activeLayer) ?? FALLBACK_CATEGORY;
            const info = getFeatureInfo(feature, activeLayer);
            const gmaps = getFeatureGoogleMaps(feature, activeLayer);
            const photo = getFeaturePhoto(feature, activeLayer, name);
            const coords =
              feature.geometry.type === "Point" ? feature.geometry.coordinates : null;
            if (!coords) return null;
            const [lng, lat] = coords;

            return (
              <Marker
                key={`${activeLayer.id}-${index}`}
                position={[lat, lng]}
                icon={createDivIcon(category.color, category.icon)}
              >
                <Popup>
                  <div className="w-56">
                    {activeLayer.photo.mode !== "none" &&
                      (photo ? (
                        <Image
                          src={photo}
                          alt={name}
                          width={224}
                          height={128}
                          unoptimized
                          className="h-32 w-full rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-32 w-full items-center justify-center rounded-lg bg-[var(--color-muted)] text-center text-xs text-[var(--color-muted-foreground)]">
                          Foto belum tersedia
                        </div>
                      ))}
                    {activeLayer.fields.category && (
                      <span
                        className="mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase"
                        style={{ background: category.color }}
                      >
                        {category.label}
                      </span>
                    )}
                    <p className="mt-1 font-semibold text-[var(--color-dark-green)]">
                      {name}
                    </p>
                    {info.map((f) => (
                      <p key={f.label} className="text-xs text-gray-500">
                        <span className="font-medium text-gray-600">{f.label}:</span>{" "}
                        {f.value}
                      </p>
                    ))}
                    {gmaps && (
                      <a
                        href={gmaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#fff" }}
                        className="mt-2 inline-flex items-center gap-1 rounded-full bg-[var(--color-midnight-teal)] px-3 py-1 text-xs font-medium transition-opacity hover:opacity-90"
                      >
                        <MapPin size={12} />
                        Buka di Google Maps
                      </a>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
        <span className="text-xs font-semibold tracking-wide text-[var(--color-muted-foreground)] uppercase">
          Legenda
        </span>
        {activeLayer.categories.map((cat) => {
          const Icon = ICON_COMPONENTS[cat.icon];
          const active = activeCategories.has(cat.value);
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => toggleCategory(cat.value)}
              aria-pressed={active}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-beige)] px-3 py-1.5 text-xs font-medium transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] ${
                active ? "opacity-100" : "opacity-40"
              }`}
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full"
                style={{ background: cat.color }}
                aria-hidden="true"
              >
                <Icon size={11} color="#fff" />
              </span>
              {cat.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setBoundaryVisible((v) => !v)}
          aria-pressed={boundaryVisible}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-beige)] px-3 py-1.5 text-xs font-medium transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] ${
            boundaryVisible ? "opacity-100" : "opacity-40"
          }`}
        >
          <span
            className="h-0.5 w-5 rounded-full"
            style={{ background: BOUNDARY_COLOR }}
            aria-hidden="true"
          />
          Batas Desa Jetis
        </button>
      </div>
    </div>
  );
}
