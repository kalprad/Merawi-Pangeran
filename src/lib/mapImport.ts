const NAME_PROPERTY_HINTS = ["nama", "name", "namobj", "judul", "title", "label"];

export function guessNameProperty(properties: Record<string, unknown>): string {
  const keys = Object.keys(properties);
  const hinted = keys.find((k) => NAME_PROPERTY_HINTS.includes(k.toLowerCase()));
  if (hinted) return hinted;
  return keys.find((k) => typeof properties[k] === "string") ?? keys[0] ?? "";
}

export function stripExtension(fileName: string): string {
  return fileName.replace(/\.[^./\\]+$/, "").trim();
}

export function filenameFromUrl(url: string): string {
  const last = url.split("/").pop() ?? url;
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
}
