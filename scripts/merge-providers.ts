// scripts/merge-providers.ts
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

export type LatLng = { lat: number; lng: number };
export type GmapsMeta = {
  placeId?: string | undefined;
  url?: string | undefined;
  formattedName?: string | undefined;
  formattedAddress?: string | undefined;
  internationalPhone?: string | undefined;
  location?: LatLng | undefined;
};
export type Provider = {
  id: string;
  name: string;
  country: string;
  city: string;
  regionTag?: string | undefined;
  phone?: string | undefined;
  policy?: string | undefined;
  caution?: string | undefined;
  lat?: number | undefined;
  lng?: number | undefined;
  gmaps?: GmapsMeta | undefined;
};

type Flags = { enrichedPath: string; outPath: string; overwriteGeo?: boolean | undefined };

function parseFlags(argv: string[]): Flags {
  let enrichedPath = "";
  let outPath = "";
  let overwriteGeo = false;

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--enriched") enrichedPath = argv[++i] ?? "";
    else if (a === "--out") outPath = argv[++i] ?? "";
    else if (a === "--overwrite-geo") overwriteGeo = true;
  }
  if (!enrichedPath) throw new Error("Missing --enriched");
  if (!outPath) throw new Error("Missing --out");

  return {
    enrichedPath: path.isAbsolute(enrichedPath) ? enrichedPath : path.join(process.cwd(), enrichedPath),
    outPath: path.isAbsolute(outPath) ? outPath : path.join(process.cwd(), outPath),
    overwriteGeo,
  };
}

function indexById<T extends { id: string }>(arr: T[]): Map<string, T> {
  const m = new Map<string, T>();
  for (const it of arr) m.set(it.id, it);
  return m;
}

function mergeProvider(base: Provider, enriched: Provider | undefined, overwriteGeo?: boolean): Provider {
  if (!enriched) return base;

  const mergedGmaps: GmapsMeta | undefined =
    enriched.gmaps ? { ...(base.gmaps ?? {}), ...enriched.gmaps } : base.gmaps;

  const hasLoc =
    !!enriched.gmaps?.location &&
    typeof enriched.gmaps.location.lat === "number" &&
    typeof enriched.gmaps.location.lng === "number";

  const lat = overwriteGeo && hasLoc ? enriched.gmaps!.location!.lat : base.lat;
  const lng = overwriteGeo && hasLoc ? enriched.gmaps!.location!.lng : base.lng;

  return {
    id: base.id,
    name: base.name,
    country: base.country,
    city: base.city,
    ...(base.regionTag !== undefined ? { regionTag: base.regionTag } : {}),
    ...(base.phone !== undefined ? { phone: base.phone } : {}),
    ...(base.policy !== undefined ? { policy: base.policy } : {}),
    ...(base.caution !== undefined ? { caution: base.caution } : {}),
    ...(lat !== undefined ? { lat } : {}),
    ...(lng !== undefined ? { lng } : {}),
    ...(mergedGmaps !== undefined ? { gmaps: mergedGmaps } : {}),
  };
}

async function main() {
  const { enrichedPath, outPath, overwriteGeo } = parseFlags(process.argv);
  const basePath = path.join(process.cwd(), "data", "providers.json");

  const base = JSON.parse(await readFile(basePath, "utf8")) as Provider[];
  const enr = JSON.parse(await readFile(enrichedPath, "utf8")) as Provider[];

  const byId = indexById(enr);
  const merged = base.map((b) => mergeProvider(b, byId.get(b.id), overwriteGeo));

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(merged, null, 2), "utf8");
  console.log(`[merge] Wrote ${merged.length} providers → ${outPath}`);
}

main().catch((e) => {
  console.error("[merge] fatal:", e);
  process.exit(1);
});