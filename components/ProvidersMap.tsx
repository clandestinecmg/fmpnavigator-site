'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type Provider = {
  id: string;
  name: string;
  country: string;
  city: string;
  regionTag?: string;
  phone?: string;
  policy?: string;
  caution?: string;
  lat?: number;
  lng?: number;
};

type Props = {
  providers: Provider[];
  initial?: { lat: number; lng: number; zoom?: number };
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

export default function ProvidersMap({ providers, initial }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
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
          libraries: ['places'],
          v: 'weekly',
        });
        if (cancelled) return;

        // 2) Import libraries (modern API)
        const { Map } = (await (google.maps as any).importLibrary(
          'maps'
        )) as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = (await (google.maps as any).importLibrary(
          'marker'
        )) as google.maps.MarkerLibrary;

        // 3) Create the map
        const map = new Map(containerRef.current, {
          center: { lat: center.lat, lng: center.lng },
          zoom: center.zoom,
          mapId: MAP_ID || null,                // ✅ use your Vector Map ID (MapOptions expects string | null)
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: 'greedy',
          heading: 0,
          tilt: 45,
        });

        // 4) Add markers for providers with coordinates
        const withCoords = providers.filter(
          (p) => typeof p.lat === 'number' && typeof p.lng === 'number'
        );

        withCoords.forEach((p) => {
          const marker = new AdvancedMarkerElement({
            map,
            position: { lat: p.lat!, lng: p.lng! },
            title: p.name,
          });

          const info = new google.maps.InfoWindow({
            content: `
              <div style="min-width:220px">
                <strong>${p.name}</strong><br/>
                <div>${p.city ?? ''}${p.regionTag ? ', ' + p.regionTag : ''}</div>
                ${p.phone ? `<div>${p.phone}</div>` : ''}
                ${
                  p.policy
                    ? `<div style="margin-top:6px;font-size:12px;opacity:.8">${p.policy}</div>`
                    : ''
                }
                ${
                  p.lat && p.lng
                    ? `<a target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}">Directions</a>`
                    : ''
                }
              </div>
            `,
          });

          marker.addListener('gmp-click', () => {
            info.open({ anchor: marker, map });
          });
        });
      } catch (e: any) {
        console.error('[ProvidersMap] failed to init Google Maps', e);
        setError(e?.message ?? 'Failed to load Google Maps');
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [center.lat, center.lng, center.zoom, providers]);

  return (
    <div className="card bg-[var(--card)] text-[var(--text)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="h2">Direct-Billing Providers</h2>
        {error ? <span className="small text-red-400">{error}</span> : null}
      </div>

      <div ref={containerRef} className="w-full h-[520px] rounded-xl overflow-hidden" />

      {(!MAPS_API_KEY || !MAP_ID) && (
        <p className="small mt-3">
          {!MAPS_API_KEY && <>Set <code>NEXT_PUBLIC_MAPS_API_KEY</code> in your <code>.env</code>. </>}
          {!MAP_ID && <>Set <code>NEXT_PUBLIC_MAP_ID</code> (Vector Map ID) in your <code>.env</code>. </>}
          Then restart the dev server.
        </p>
      )}
    </div>
  );
}