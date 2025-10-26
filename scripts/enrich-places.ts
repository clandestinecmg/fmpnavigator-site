// scripts/enrich-places.ts
/**
 * Enrich providers with canonical Google Maps identity (place_id, name, address, url, phone, lat/lng).
 * - Reads: data/providers.json (array of Provider)
 * - Writes: data/providers.enriched.json (unless --out specifies another file)
 *
 * Usage:
 *   tsx scripts/enrich-places.ts [--out data/providers.enriched.json] [--only id1,id2]
 *                                [--country-bias PH] [--force] [--overwrite-geo]
 *                                [--dry-run]
 *
 * Env:
 *   GOOGLE_MAPS_SERVER_KEY (preferred)
 *   or NEXT_PUBLIC_MAPS_API_KEY (fallback for quick testing)
 *
 * Notes on exactOptionalPropertyTypes:
 *   - Optional fields explicitly allow `| undefined` where we assign `undefined`.
 *   - When we construct objects, we avoid including properties that are `undefined`
 *     unless the type includes them explicitly.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

/* =========================
   Types (strict & explicit)
   ========================= */

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
  phone?: string | undefined; // existing phone from your data
  policy?: string | undefined;
  caution?: string | undefined;
  lat?: number | undefined;
  lng?: number | undefined;
  gmaps?: GmapsMeta | undefined;
};

type CliFlags = {
  out?: string | null | undefined;
  force?: boolean | undefined;
  overwriteGeo?: boolean | undefined;
  dryRun?: boolean | undefined;
  countryBias?: string | undefined;
  /** comma-separated ids to restrict the run */
  only?: string[] | undefined;
};

type FindPlaceCandidate = {
  place_id: string;
  name?: string;
  formatted_address?: string;
  geometry?: { location?: { lat?: number; lng?: number } };
};

type FindPlaceResponse = {
  status: string;
  candidates?: FindPlaceCandidate[];
  error_message?: string;
};

type PlaceDetailsResult = {
  place_id?: string;
  name?: string;
  formatted_address?: string;
  international_phone_number?: string;
  url?: string;
  geometry?: { location?: { lat?: number; lng?: number } };
};

type PlaceDetailsResponse = {
  status: string;
  result?: PlaceDetailsResult;
  error_message?: string;
};

/* =========================
   CLI parsing
   ========================= */

function parseFlags(argv: string[]): CliFlags {
  const flags: CliFlags = {
    out: null,
    force: false,
    overwriteGeo: false,
    dryRun: false,
    countryBias: undefined,
    only: undefined,
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--force") flags.force = true;
    else if (a === "--dry-run") flags.dryRun = true;
    else if (a === "--overwrite-geo") flags.overwriteGeo = true;
    else if (a === "--out") {
      const v = argv[i + 1];
      if (!v) throw new Error("--out requires a path");
      flags.out = v;
      i++;
    } else if (a === "--country-bias") {
      const v = argv[i + 1];
      if (!v) throw new Error("--country-bias requires a value like PH or TH");
      flags.countryBias = v;
      i++;
    } else if (a === "--only") {
      const v = argv[i + 1];
      if (!v) throw new Error("--only requires a comma-separated list of ids");
      flags.only = v.split(",").map((s) => s.trim()).filter(Boolean);
      i++;
    }
  }

  return flags;
}

/* =========================
   Google helpers (classic WS)
   ========================= */

function getServerMapsKey(): string {
  const k =
    process.env.GOOGLE_MAPS_SERVER_KEY || process.env.NEXT_PUBLIC_MAPS_API_KEY;
  if (!k) {
    throw new Error(
      "Missing GOOGLE_MAPS_SERVER_KEY (preferred) or NEXT_PUBLIC_MAPS_API_KEY"
    );
  }
  return k;
}

// Conservative sleep to avoid hammering quota (tune as needed)
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function findPlaceIdByText(
  key: string,
  textQuery: string,
  countryBias?: string | undefined
): Promise<FindPlaceCandidate | undefined> {
  // Using "findplacefromtext" for robust text lookup
  const params = new URLSearchParams({
    input: textQuery,
    inputtype: "textquery",
    fields: "place_id,name,formatted_address,geometry",
    key,
  });

  // Region/country bias via "components"
  if (countryBias) params.set("components", `country:${countryBias}`);

  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?${params.toString()}`;
  const res = await fetch(url);
  const json = (await res.json()) as FindPlaceResponse;

  if (json.status !== "OK" || !json.candidates || json.candidates.length === 0) {
    return undefined;
  }
  return json.candidates[0];
}

async function getPlaceDetails(
  key: string,
  placeId: string
): Promise<PlaceDetailsResult | undefined> {
  const params = new URLSearchParams({
    place_id: placeId,
    key,
    fields:
      "place_id,name,formatted_address,international_phone_number,url,geometry",
  });

  const url = `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`;
  const res = await fetch(url);
  const json = (await res.json()) as PlaceDetailsResponse;

  if (json.status !== "OK" || !json.result) return undefined;
  return json.result;
}

/* =========================
   Data helpers
   ========================= */

function providerTextQuery(p: Provider): string {
  // Try to form a stable query
  // Example: "Bangkok Hospital Chiang Mai, Chiang Mai, TH"
  const parts = [p.name];
  if (p.city) parts.push(p.city);
  if (p.regionTag) parts.push(p.regionTag);
  parts.push(p.country);
  return parts.filter(Boolean).join(", ");
}

/**
 * Build a new GmapsMeta from Place Details (skip undefined properties unless
 * the type explicitly allows them).
 */
function gmapsFromDetails(d: PlaceDetailsResult): GmapsMeta {
  const meta: GmapsMeta = {};
  if (d.place_id) meta.placeId = d.place_id;
  if (d.name) meta.formattedName = d.name;
  if (d.formatted_address) meta.formattedAddress = d.formatted_address;
  if (d.international_phone_number)
    meta.internationalPhone = d.international_phone_number;
  if (d.url) meta.url = d.url;

  const lat = d.geometry?.location?.lat;
  const lng = d.geometry?.location?.lng;
  if (typeof lat === "number" && typeof lng === "number") {
    meta.location = { lat, lng };
  }

  return meta;
}

function applyGeo(
  p: Provider,
  meta: GmapsMeta,
  overwriteGeo: boolean | undefined
): Provider {
  // Only set lat/lng if we have a location and either overwriteGeo is true or the provider lacks coords.
  const loc = meta.location;
  const hasLoc = !!loc && typeof loc.lat === "number" && typeof loc.lng === "number";

  if (!hasLoc) {
    // No new geometry; just return with gmaps merged.
    return { ...p, gmaps: { ...(p.gmaps ?? {}), ...meta } };
  }

  const alreadyHasGeo =
    typeof p.lat === "number" && typeof p.lng === "number";

  if (alreadyHasGeo && !overwriteGeo) {
    return { ...p, gmaps: { ...(p.gmaps ?? {}), ...meta } };
  }

  return {
    ...p,
    lat: loc!.lat,
    lng: loc!.lng,
    gmaps: { ...(p.gmaps ?? {}), ...meta },
  };
}

/* =========================
   Main
   ========================= */

async function main() {
  const flags = parseFlags(process.argv);
  const key = getServerMapsKey();

  const inputPath = path.join(process.cwd(), "data", "providers.json");
  const outputPath =
    flags.out && flags.out.length > 0
      ? path.isAbsolute(flags.out)
        ? flags.out
        : path.join(process.cwd(), flags.out)
      : path.join(process.cwd(), "data", "providers.enriched.json");

  const raw = await readFile(inputPath, "utf8");
  const providers = JSON.parse(raw) as Provider[];

  const onlySet =
    flags.only && flags.only.length > 0 ? new Set(flags.only) : null;

  const updated: Provider[] = [];
  for (const p of providers) {
    if (onlySet && !onlySet.has(p.id)) {
      updated.push(p);
      continue;
    }

    // Skip if we already have a placeId and not forcing
    if (!flags.force && p.gmaps?.placeId) {
      updated.push(p);
      continue;
    }

    const textQuery = providerTextQuery(p);
    console.log(`\n[enrich] Searching: ${p.id} → "${textQuery}"`);

    const found = await findPlaceIdByText(key, textQuery, flags.countryBias);
    if (!found?.place_id) {
      console.warn(`[enrich] No candidate found for ${p.id}`);
      updated.push(p);
      await sleep(120); // gentle
      continue;
    }

    console.log(`[enrich] Found place_id=${found.place_id}`);

    const details = await getPlaceDetails(key, found.place_id);
    if (!details) {
      console.warn(`[enrich] Details not found for ${p.id}`);
      updated.push(p);
      await sleep(120);
      continue;
    }

    const meta = gmapsFromDetails(details);
    const merged = applyGeo(p, meta, flags.overwriteGeo);
    updated.push(merged);

    // Throttle a bit between calls
    await sleep(180);
  }

  if (flags.dryRun) {
    console.log("\n[dry-run] Would write enriched providers to:", outputPath);
    return;
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(updated, null, 2), "utf8");
  console.log(`\n[done] Wrote ${updated.length} records → ${outputPath}`);
}

main().catch((err) => {
  console.error("[enrich-places] fatal:", err);
  process.exit(1);
});