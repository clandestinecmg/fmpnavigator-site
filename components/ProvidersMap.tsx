// components/ProvidersMap.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

/** ---- Types shared with pages ---- */
export type LatLng = { lat: number; lng: number };

export type GmapsMeta = {
  placeId?: string | undefined;
  url?: string | undefined; // canonical Google Maps URL (from server enrichment)
  formattedName?: string | undefined;
  formattedAddress?: string | undefined;
  internationalPhone?: string | undefined;
  location?: LatLng | undefined; // authoritative coords from enrichment
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
  lat?: number | undefined; // rough or enriched
  lng?: number | undefined; // rough or enriched
  gmaps?: GmapsMeta | undefined; // identity
};

type Props = {
  providers: Provider[];
  initial?: { lat: number; lng: number; zoom?: number };
  selectedId?: string | null;
};

const MAPS_API_KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY ?? '';
const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID ?? '';

type GMapScriptOptions = {
  apiKey: string;
  libraries?: string[];
  v?: string;
};

/** Load the Google Maps script once (no @googlemaps/js-api-loader needed). */
function loadGoogleMapsScript({
  apiKey,
  libraries = [],
  v = 'weekly',
}: GMapScriptOptions): Promise<void> {
  const WIN = typeof window !== 'undefined' ? (window as any) : undefined;
  if (!WIN) return Promise.reject(new Error('window not available'));
  if (WIN.__gmapsLoaded) return WIN.__gmapsLoaded as Promise<void>;

  const existing = document.querySelector<HTMLScriptElement>('script[data-gmaps="1"]');
  if (existing) {
    WIN.__gmapsLoaded =
      existing.dataset.loaded === '1'
        ? Promise.resolve()
        : new Promise<void>((resolve, reject) => {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', (e) => reject(e));
          });
    return WIN.__gmapsLoaded;
  }

  const params = new URLSearchParams({
  key: apiKey,
  v,
  libraries: libraries.join(','),
  loading: 'async',          
});
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
  script.async = true;
  script.defer = true;
  script.dataset.gmaps = '1';

  WIN.__gmapsLoaded = new Promise<void>((resolve, reject) => {
    script.addEventListener('load', () => {
      script.dataset.loaded = '1';
      resolve();
    });
    script.addEventListener('error', (e) => reject(e));
  });

  document.head.appendChild(script);
  return WIN.__gmapsLoaded;
}

/** Helper to fetch a place’s LatLng (and canonical URI) using the new Places JS API */
async function placeIdToLatLng(
  placeId: string
): Promise<{ location: google.maps.LatLngLiteral | null; googleMapsURI?: string }> {
  const { Place } = (await (google.maps as any).importLibrary('places')) as google.maps.PlacesLibrary;
  const place = new Place({ id: placeId });
  await place.fetchFields({
    fields: ['location', 'googleMapsURI'], // NOTE: correct casing per @types/google.maps
  });
  const location =
    place.location instanceof google.maps.LatLng
      ? { lat: place.location.lat(), lng: place.location.lng() }
      : null;
  const googleMapsURI = (place as any).googleMapsURI as string | undefined;
  if (typeof googleMapsURI === 'string') {
    return { location, googleMapsURI };
  }
  return { location };
}

export default function ProvidersMap({ providers, initial, selectedId }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const [error, setError] = useState<string | null>(null);

  const center = useMemo(
    () => ({
      lat: initial?.lat ?? 14.5995, // Manila fallback
      lng: initial?.lng ?? 120.9842,
      zoom: initial?.zoom ?? 6,
    }),
    [initial]
  );

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setError(null);

      if (!MAPS_API_KEY) {
        setError('Missing NEXT_PUBLIC_MAPS_API_KEY.');
        return;
      }
      if (!containerRef.current) return;

      try {
        // 1) Load the script once
        await loadGoogleMapsScript({
          apiKey: MAPS_API_KEY,
          libraries: ['places'], // we use new Places JS API client side for placeId -> LatLng
          v: 'weekly',
        });
        if (cancelled) return;

        // 2) Import libraries (modern API)
        const { Map } = (await (google.maps as any).importLibrary('maps')) as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = (await (google.maps as any).importLibrary(
          'marker'
        )) as google.maps.MarkerLibrary;

        // 3) Create or reuse the map
        const map =
          mapRef.current ??
          new Map(containerRef.current, {
            center: { lat: center.lat, lng: center.lng },
            zoom: center.zoom,
            mapId: MAP_ID || null, // MapOptions expects string | null
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            gestureHandling: 'greedy',
            heading: 0,
            tilt: 45,
          });

        mapRef.current = map;

        // One shared InfoWindow instance (recommended)
        infoRef.current = infoRef.current ?? new google.maps.InfoWindow();

        // 4) Build markers; if a provider lacks coords but has placeId, resolve it
        const bounds = new google.maps.LatLngBounds();
        const tasks: Promise<void>[] = [];

        for (const p of providers) {
          // Skip if we already created this marker and it exists
          if (markersRef.current.has(p.id)) {
            const m = markersRef.current.get(p.id)!;
            const pos = (m.position as google.maps.LatLngLiteral | null) ?? null;
            if (pos) bounds.extend(pos);
            continue;
          }

          // Determine position: prefer explicit lat/lng; else try gmaps.location; else resolve placeId
          const explicit =
            typeof p.lat === 'number' && typeof p.lng === 'number'
              ? ({ lat: p.lat, lng: p.lng } as google.maps.LatLngLiteral)
              : undefined;

          const enriched =
            p.gmaps?.location &&
            typeof p.gmaps.location.lat === 'number' &&
            typeof p.gmaps.location.lng === 'number'
              ? (p.gmaps.location as google.maps.LatLngLiteral)
              : undefined;

          const placeId = p.gmaps?.placeId;

          const createMarker = (pos: google.maps.LatLngLiteral) => {
            const marker = new AdvancedMarkerElement({
              map,
              position: pos,
              title: p.name,
            });

            // Build content; prefer enriched canonical fields when present
            const displayName = p.gmaps?.formattedName ?? p.name;
            const address = p.gmaps?.formattedAddress ?? p.city ?? '';
            const phone = p.gmaps?.internationalPhone ?? p.phone ?? '';
            const url = p.gmaps?.url;

            const contentHTML = `
              <div style="min-width:240px">
                <strong>${displayName}</strong><br/>
                <div>${address}</div>
                ${phone ? `<div>${phone}</div>` : ''}
                ${
                  p.policy
                    ? `<div style="margin-top:6px;font-size:12px;opacity:.8">${p.policy}</div>`
                    : ''
                }
                <div style="margin-top:8px">
                  ${
                    url
                      ? `<a target="_blank" rel="noopener" href="${url}">Open in Google&nbsp;Maps</a>`
                      : `<a target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${pos.lat},${pos.lng}">Directions</a>`
                  }
                </div>
              </div>
            `;

            const info = infoRef.current!;
            marker.addListener('gmp-click', () => {
              info.setContent(contentHTML);
              // IMPORTANT: do not pass "position" in the open() options — not part of the signature
              info.open({ anchor: marker, map });
            });

            markersRef.current.set(p.id, marker);
            bounds.extend(pos);
          };

          if (explicit) {
            createMarker(explicit);
          } else if (enriched) {
            createMarker(enriched);
          } else if (placeId) {
            // Defer: resolve placeId → position, then create marker
            const t = (async () => {
              try {
                const { location, googleMapsURI } = await placeIdToLatLng(placeId);
                const resolved = location ?? { lat: center.lat, lng: center.lng };
                // If we learned a canonical URI and no server-enriched URL exists, attach it to info content
                if (googleMapsURI && !p.gmaps?.url) {
                  // Mutating local `p` is fine here; used only for building info content
                  p.gmaps = { ...(p.gmaps ?? {}), url: googleMapsURI };
                }
                createMarker(resolved);
              } catch (e) {
                console.warn('[ProvidersMap] placeId resolve failed for', p.id, e);
              }
            })();
            tasks.push(t);
          } else {
            // Fallback to map center to avoid empty map (rare)
            createMarker({ lat: center.lat, lng: center.lng });
          }
        }

        // Wait for any pending resolutions, then fit bounds (unless only one marker)
        await Promise.all(tasks);
        if (!bounds.isEmpty()) {
          // If bounds collapse to a single point, just center/zoom
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          const singlePoint = ne.equals(sw);
          if (singlePoint) {
            map.setCenter(bounds.getCenter());
            map.setZoom(Math.max(center.zoom, 12));
          } else {
            map.fitBounds(bounds);
          }
        }
      } catch (e: any) {
        console.error('[ProvidersMap] failed to init Google Maps', e);
        setError(e?.message ?? 'Failed to load Google Maps');
      }
    }

    init();
    return () => {
      cancelled = true;
    };
    // Only re-init on first mount or when the provider list identity truly changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providers]);

  // Respond to selection: pan/zoom and open info
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!selectedId) return;

    const marker = markersRef.current.get(selectedId);
    const info = infoRef.current;
    if (!marker) return;

    const pos = marker.position as google.maps.LatLngLiteral | null;
    if (!pos) return;

    // Smooth zoom/pan
    map.panTo(pos);
    if ((map.getZoom() ?? 0) < 14) map.setZoom(14);

    // Rebuild a small info content if needed (markers already wired, but we want to ensure open)
    // We simply trigger the same click handler effect by opening with anchor.
    if (info) {
      // If no content yet (first open via selection), set a minimal one
      if (!info.getContent()) {
        const p = providers.find((x) => x.id === selectedId);
        if (p) {
          const displayName = p.gmaps?.formattedName ?? p.name;
          const address = p.gmaps?.formattedAddress ?? p.city ?? '';
          const phone = p.gmaps?.internationalPhone ?? p.phone ?? '';
          const url = p.gmaps?.url;
          const fallback = `https://www.google.com/maps/dir/?api=1&destination=${pos.lat},${pos.lng}`;
          info.setContent(
            `
            <div style="min-width:240px">
              <strong>${displayName}</strong><br/>
              <div>${address}</div>
              ${phone ? `<div>${phone}</div>` : ''}
              <div style="margin-top:8px">
                <a target="_blank" rel="noopener" href="${url ?? fallback}">${url ? 'Open in Google&nbsp;Maps' : 'Directions'}</a>
              </div>
            </div>
          `
          );
        }
      }
      // IMPORTANT: do not pass "position" in options; only { map, anchor } is valid
      info.open({ anchor: marker, map });
    }
  }, [selectedId, providers]);

  return (
    <div className="card bg-[var(--card)] text-[var(--text)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="h2">Direct-Billing Providers</h2>
        {error ? <span className="small text-red-400">{error}</span> : null}
      </div>

      <div ref={containerRef} className="w-full h-[520px] rounded-xl overflow-hidden" />

      {(!MAPS_API_KEY || !MAP_ID) && (
        <p className="small mt-3">
          {!MAPS_API_KEY && (
            <>
              Set <code>NEXT_PUBLIC_MAPS_API_KEY</code> in your <code>.env</code>.{' '}
            </>
          )}
          {!MAP_ID && (
            <>
              Set <code>NEXT_PUBLIC_MAP_ID</code> (Vector Map ID) in your <code>.env</code>.{' '}
            </>
          )}
          Then restart the dev server.
        </p>
      )}
    </div>
  );
}