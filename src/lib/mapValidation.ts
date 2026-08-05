import type { MapSubLayer } from "./types";

export function normalizeSublayers(input: unknown): MapSubLayer[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const result: MapSubLayer[] = [];
  for (const item of input as Record<string, unknown>[]) {
    const raw = item as Partial<MapSubLayer> & {
      fields?: Partial<MapSubLayer["fields"]>;
    };
    if (!raw?.geojsonUrl || !raw?.fields?.name) return null;
    result.push({
      id: typeof raw.id === "string" && raw.id ? raw.id : crypto.randomUUID(),
      geojsonUrl: raw.geojsonUrl,
      name: typeof raw.name === "string" && raw.name ? raw.name : "Sub-layer",
      fields: raw.fields as MapSubLayer["fields"],
      categories: Array.isArray(raw.categories) ? raw.categories : [],
      photo: raw.photo ?? { mode: "none" },
      visible: typeof raw.visible === "boolean" ? raw.visible : true,
    });
  }
  return result;
}
