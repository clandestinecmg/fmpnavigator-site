// scripts/merge-providers.ts
/**
 * Merge base providers.json with an enriched file (adds/overrides `gmaps` and optionally lat/lng).
 *
 * Usage:
 *   tsx scripts/merge-providers.ts --enriched data/providers.enriched.json --out data/providers.final.json
 *
 * Behavior:
 *   - Keeps original objects as-is, then overlays `gmaps` from enriched.
 *   - If enriched has lat/lng, we preserve base lat/lng unless --overwrite-geo is provided.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

/* Types must match enrich-places to avoid drift */

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

type Flags = {
  enrichedPath: string;
  outPath: string;
  overwriteGeo?: boolean | undefined;
};

function parseFlags(argv: string[]): Flags {
  let enrichedPath = "";
  let outPath = "";
  let overwriteGeo = false;

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--enriched") {
      const v = argv[i + 1];
      if (!v) throw new Error("--enriched requires a file path");
      enrichedPath = v;
      i++;
    } else if (a === "--out") {
      const v = argv[i + 1];
      if (!v) throw new Error("--out requires a file path");
      outPath = v;
      i++;
    } else if (a === "--overwrite-geo") {
      overwriteGeo = true;
    }
  }

  if (!enrichedPath) {
    throw new Error("Missing --enriched path to enriched JSON");
  }
  if (!outPath) {
    throw new Error("Missing --out path for merged JSON");
  }

  const resolved: Flags = {
    enrichedPath: path.isAbsolute(enrichedPath)
      ? enrichedPath
      : path.join(process.cwd(), enrichedPath),
    outPath: path.isAbsolute(outPath)
      ? outPath
      : path.join(process.cwd(), outPath),
    overwriteGeo,
  };

  return resolved;
}

function indexById<T extends { id: string }>(arr: T[]): Map<string, T> {
  const m = new Map<string, T>();
  for (const item of arr) m.set(item.id, item);
  return m;
}

/**
 * Merge the incoming enriched `gmaps` meta into the base provider.
 * If `overwriteGeo` is true and enriched has coords, replace base lat/lng.
 */
function mergeProvider(
  base: Provider,
  enriched: Provider | undefined,
  overwriteGeo: boolean | undefined
): Provider {
  if (!enriched) return base;

  const mergedGmaps: GmapsMeta | undefined =
    enriched.gmaps ? { ...(base.gmaps ?? {}), ...enriched.gmaps } : base.gmaps;

  const enrichedHasLoc =
    !!enriched.gmaps?.location &&
    typeof enriched.gmaps.location.lat === "number" &&
    typeof enriched.gmaps.location.lng === "number";

  let lat = base.lat;
  let lng = base.lng;

  if (enrichedHasLoc && overwriteGeo) {
    lat = enriched.gmaps!.location!.lat;
    lng = enriched.gmaps!.location!.lng;
  }

  // Build result, carefully not including undefined properties unless the type allows them.
  const result: Provider = {
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

  return result;
}

async function main() {
  const { enrichedPath, outPath, overwriteGeo } = parseFlags(process.argv);

  const basePath = path.join(process.cwd(), "data", "providers.json");
  const baseRaw = await readFile(basePath, "utf8");
  const enrichedRaw = await readFile(enrichedPath, "utf8");

  const baseList = JSON.parse(baseRaw) as Provider[];
  const enrichedList = JSON.parse(enrichedRaw) as Provider[];

  const enrichedById = indexById(enrichedList);

  const merged: Provider[] = baseList.map((b) =>
    mergeProvider(b, enrichedById.get(b.id), overwriteGeo)
  );

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(merged, null, 2), "utf8");
  console.log(`[merge] Wrote ${merged.length} providers → ${outPath}`);
}

main().catch((err) => {
  console.error("[merge-providers] fatal:", err);
  process.exit(1);
});