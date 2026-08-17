import type { ExperienceRead, PoiRead } from "@/lib/types";

export type ExploreItem =
  | { kind: "poi"; poi: PoiRead }
  | { kind: "exp"; exp: ExperienceRead };

export function itemName(it: ExploreItem): string {
  return it.kind === "poi" ? it.poi.name : it.exp.title;
}

export function itemCategory(it: ExploreItem): string {
  return it.kind === "poi" ? it.poi.category : it.exp.category;
}

export function itemWilayaId(it: ExploreItem): number {
  return it.kind === "poi" ? it.poi.wilaya_id : it.exp.wilaya_id;
}

export function itemDescription(it: ExploreItem): string | null | undefined {
  return it.kind === "poi" ? it.poi.description : it.exp.description;
}

export function itemPhotos(it: ExploreItem): string[] {
  if (it.kind === "exp") return it.exp.photos ?? [];
  return [it.poi.photo_url, ...(it.poi.photo_urls ?? [])].filter(
    (x): x is string => !!x,
  );
}
