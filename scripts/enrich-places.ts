// scripts/enrich-places.ts
/**
 * Enrich providers with Google Places identity (Place ID, canonical name/address/phone, exact geometry).
 *
 * Usage:
 *   tsx scripts/enrich-places.ts --in data/providers.json --out data/providers.enriched.json --country-bias=PH,TH
 *
 * Notes:
 *  - Requires env: MAPS_SERVER_API_KEY
 *  - Uses Places API (New) text search + details (v1).
 *  - Writes an array of providers with a `gmaps` object (only for rows we could enrich).
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

type LatLng = { lat: number; lng: number };

type GmapsMeta = {
  placeId?: string | undefined;
  url?: string | undefined; // googleMapsUri
  formattedName?: string | undefined;
  formattedAddress?: string | undefined;
  internationalPhone?: string | undefined;
  location?: LatLng | undefined;
};

type Provider = {
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

type CliFlags = {
  inPath: string;
  outPath: string;
  countryBias?: string | undefined; // e.g., "PH,TH"
  only?: string | undefined;        // CSV of ids to process
  dryRun?: boolean | undefined;
  overwriteGeo?: boolean | undefined; // (merge handles actual geo overwrite)
  force?: boolean | undefined;      // re-enrich even if placeId already exists
};

function parseFlags(argv: string[]): CliFlags {
  let inPath = "";
  let outPath = "";
  let countryBias: string | undefined;
  let only: string | undefined;
  let dryRun = false;
  let overwriteGeo = false;
  let force = false;

  // Safe cursor-based parsing; never touches possibly-undefined values
  let i = 2;
  const takeNext = (flag: string): string => {
    const v = argv[i + 1];
    if (typeof v !== "string" || v.length === 0) {
      throw new Error(`${flag} requires a value`);
    }
    i += 1;
    return v;
  };

  while (i < argv.length) {
    const aRaw = argv[i];
    const a = typeof aRaw === "string" ? aRaw : "";

    if (a === "--in") {
      inPath = takeNext("--in");
    } else if (a === "--out") {
      outPath = takeNext("--out");
    } else if (a.startsWith("--country-bias")) {
      const v = a.includes("=") ? a.split("=", 2)[1] : takeNext("--country-bias");
      countryBias = v || undefined;
    } else if (a === "--only") {
      only = takeNext("--only");
    } else if (a === "--dry-run") {
      dryRun = true;
    } else if (a === "--overwrite-geo") {
      overwriteGeo = true;
    } else if (a === "--force") {
      force = true;
    }
    i += 1;
  }

  if (!inPath) throw new Error("Missing --in path to providers JSON");
  if (!outPath) throw new Error("Missing --out path for enriched JSON");

  const resolved: CliFlags = {
    inPath: path.isAbsolute(inPath) ? inPath : path.join(process.cwd(), inPath),
    outPath: path.isAbsolute(outPath) ? outPath : path.join(process.cwd(), outPath),
    countryBias,
    only,
    dryRun,
    overwriteGeo,
    force,
  };
  return resolved;
}

const API_KEY = process.env.MAPS_SERVER_API_KEY || "";
if (!API_KEY) {
  console.error("[enrich] Missing env MAPS_SERVER_API_KEY");
  process.exit(1);
}

async function searchText(query: string, countryBias?: string) {
  // Places API (New): POST https://places.googleapis.com/v1/places:searchText
  const body: any = {
    textQuery: query,
    maxResultCount: 5
  };

  // Optionally bias to a single regionCode (Google supports one here)
  if (countryBias) {
    const first = countryBias.split(",").map(s => s.trim()).filter(Boolean)[0];
    if (first) body.regionCode = first;
  }

  const resp = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri,places.internationalPhoneNumber"
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`searchText error ${resp.status}: ${t}`);
  }

  const json = await resp.json();
  return (json?.places ?? []) as Array<{
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    location?: { latitude?: number; longitude?: number };
    googleMapsUri?: string;
    internationalPhoneNumber?: string;
  }>;
}

async function getDetails(placeId: string) {
  // Places API (New): GET /v1/places/{placeId}
  const fields =
    "id,displayName,formattedAddress,location,googleMapsUri,internationalPhoneNumber";
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(
    placeId
  )}?fields=${encodeURIComponent(fields)}`;

  const resp = await fetch(url, {
    headers: { "X-Goog-Api-Key": API_KEY }
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`getDetails error ${resp.status}: ${t}`);
  }

  return (await resp.json()) as {
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    location?: { latitude?: number; longitude?: number };
    googleMapsUri?: string;
    internationalPhoneNumber?: string;
  };
}

function composeQuery(p: Provider) {
  const parts = [p.name, p.city, p.country].filter(Boolean);
  return parts.join(", ");
}

function toGmapsMeta(
  d:
    | {
        id?: string;
        displayName?: { text?: string };
        formattedAddress?: string;
        location?: { latitude?: number; longitude?: number };
        googleMapsUri?: string;
        internationalPhoneNumber?: string;
      }
    | undefined
): GmapsMeta | undefined {
  if (!d?.id) return undefined;
  const location =
    typeof d.location?.latitude === "number" && typeof d.location?.longitude === "number"
      ? { lat: d.location.latitude, lng: d.location.longitude }
      : undefined;

  const g: GmapsMeta = {};
  if (d.id) g.placeId = d.id;
  if (d.googleMapsUri) g.url = d.googleMapsUri;
  if (d.displayName?.text) g.formattedName = d.displayName.text;
  if (d.formattedAddress) g.formattedAddress = d.formattedAddress;
  if (d.internationalPhoneNumber) g.internationalPhone = d.internationalPhoneNumber;
  if (location) g.location = location;
  return g;
}

async function enrichOne(
  p: Provider,
  countryBias?: string,
  force?: boolean
): Promise<Provider> {
  if (p.gmaps?.placeId && !force) return p;

  const query = composeQuery(p);
  const candidates = await searchText(query, countryBias);
  const best = candidates[0];

  let details:
    | {
        id?: string;
        displayName?: { text?: string };
        formattedAddress?: string;
        location?: { latitude?: number; longitude?: number };
        googleMapsUri?: string;
        internationalPhoneNumber?: string;
      }
    | undefined;

  if (best?.id) {
    details = await getDetails(best.id);
  }

  const meta = toGmapsMeta(details ?? best);
  if (!meta) return p;

  const next: Provider = {
    id: p.id,
    name: p.name,
    country: p.country,
    city: p.city,
    ...(p.regionTag !== undefined ? { regionTag: p.regionTag } : {}),
    ...(p.phone !== undefined ? { phone: p.phone } : {}),
    ...(p.policy !== undefined ? { policy: p.policy } : {}),
    ...(p.caution !== undefined ? { caution: p.caution } : {}),
    ...(p.lat !== undefined ? { lat: p.lat } : {}),
    ...(p.lng !== undefined ? { lng: p.lng } : {}),
    gmaps: { ...(p.gmaps ?? {}), ...meta }
  };

  return next;
}

async function main() {
  const flags = parseFlags(process.argv);
  const onlyIds = flags.only?.split(",").map((s) => s.trim()).filter(Boolean);

  const raw = await readFile(flags.inPath, "utf8");
  const providers = JSON.parse(raw) as Provider[];

  const out: Provider[] = [];
  for (const p of providers) {
    if (onlyIds && !onlyIds.includes(p.id)) {
      out.push(p);
      continue;
    }
    try {
      const enriched = await enrichOne(p, flags.countryBias, flags.force);
      out.push(enriched);
    } catch (e: any) {
      console.warn("[enrich] failed", p.id, String(e));
      out.push(p);
    }
  }

  if (flags.dryRun) {
    console.log(JSON.stringify(out, null, 2));
    return;
  }

  await mkdir(path.dirname(flags.outPath), { recursive: true });
  await writeFile(flags.outPath, JSON.stringify(out, null, 2), "utf8");
  console.log(`[enrich] wrote ${out.length} records → ${flags.outPath}`);
}

main().catch((err) => {
  console.error("[enrich] fatal:", err);
  process.exit(1);
});