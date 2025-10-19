'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Script from 'next/script';

type Provider = {
  id: string;
  name: string;
  country: 'PH' | 'TH' | string;
  city?: string;
  regionTag?: string;
  phone?: string;
  policy?: string;
  caution?: string;
  lat?: number;
  lng?: number;
};

const MAPS_KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY;

export default function ProvidersPage() {
  const [all, setAll] = useState<Provider[]>([]);
  const [q, setQ] = useState('');
  const [country, setCountry] = useState<'ALL' | 'PH' | 'TH'>('ALL');

  // map
  const [mapsReady, setMapsReady] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const gmap = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    fetch('/providers.json')
      .then(r => r.json())
      .then((data: Provider[]) => setAll(data))
      .catch(() => setAll([]));
  }, []);

  const filtered = useMemo(() => {
    const qlc = q.trim().toLowerCase();
    return all.filter(p => {
      if (country !== 'ALL' && p.country !== country) return false;
      if (!qlc) return true;
      const hay = `${p.name} ${p.city ?? ''} ${p.regionTag ?? ''} ${p.policy ?? ''} ${p.caution ?? ''}`.toLowerCase();
      return hay.includes(qlc);
    });
  }, [all, q, country]);

  // derive regions for simple filtering chips
  const regions = useMemo(() => {
    const set = new Set<string>();
    filtered.forEach(p => p.regionTag && set.add(p.regionTag));
    return Array.from(set).sort();
  }, [filtered]);

  // Map render (only for providers with lat/lng)
  useEffect(() => {
    if (!mapsReady || !mapRef.current) return;

    const withCoords = filtered.filter(p => typeof p.lat === 'number' && typeof p.lng === 'number');

    if (!gmap.current) {
      gmap.current = new google.maps.Map(mapRef.current, {
        center: withCoords[0] ? { lat: withCoords[0].lat!, lng: withCoords[0].lng! } : { lat: 15.8700, lng: 100.9925 },
        zoom: withCoords[0] ? 6 : 4,
      });
    }

    // clear markers
    markers.current.forEach(m => m.setMap(null));
    markers.current = [];

    withCoords.forEach(p => {
      const marker = new google.maps.Marker({
        position: { lat: p.lat!, lng: p.lng! },
        title: p.name,
        map: gmap.current!,
      });
      const info = new google.maps.InfoWindow({
        content: `
          <div style="min-width:220px">
            <strong>${p.name}</strong><br/>
            ${p.city ?? ''}${p.city && p.country ? ', ' : ''}${p.country ?? ''}<br/>
            ${p.phone ?? ''}<br/>
            ${p.policy ? `<div style="margin-top:6px;font-size:12px;opacity:.8">${p.policy}</div>` : ''}
            ${p.caution ? `<div style="margin-top:6px;color:#ffb4a6;font-size:12px">⚠ ${p.caution}</div>` : ''}
          </div>
        `,
      });
      marker.addListener('click', () => info.open({ map: gmap.current!, anchor: marker }));
      markers.current.push(marker);
    });

    if (withCoords.length) {
      const bounds = new google.maps.LatLngBounds();
      withCoords.forEach(p => bounds.extend({ lat: p.lat!, lng: p.lng! }));
      gmap.current!.fitBounds(bounds);
    }
  }, [mapsReady, filtered]);

  return (
    <section className="container py-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="h1">Direct-Billing Providers</h1>
          <p className="muted">Verified and community-reported clinics/hospitals in PH and TH.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCountry('ALL')}
            className={`btn ${country === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
            aria-pressed={country === 'ALL'}
          >All</button>
          <button
            onClick={() => setCountry('PH')}
            className={`btn ${country === 'PH' ? 'btn-primary' : 'btn-ghost'}`}
            aria-pressed={country === 'PH'}
          >Philippines</button>
          <button
            onClick={() => setCountry('TH')}
            className={`btn ${country === 'TH' ? 'btn-primary' : 'btn-ghost'}`}
            aria-pressed={country === 'TH'}
          >Thailand</button>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <input
            className="w-full md:w-1/2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2"
            placeholder="Search by name, city, or notes…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="small opacity-80">{filtered.length} provider(s)</div>
        </div>
      </div>

      {/* Map (optional until we add lat/lng) */}
      <div className="card">
        {!MAPS_KEY ? (
          <div className="small">⚠️ Add <code>NEXT_PUBLIC_MAPS_API_KEY</code> to enable the map.</div>
        ) : (
          <>
            <div ref={mapRef} className="w-full h-[420px] rounded-xl" />
            <Script
              src={`https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places`}
              strategy="afterInteractive"
              onLoad={() => setMapsReady(true)}
            />
          </>
        )}
      </div>

      {/* Region quick-filter chips */}
      {regions.length > 0 && (
        <div className="card">
          <div className="small mb-2">Regions in view</div>
          <div className="flex flex-wrap gap-2">
            {regions.map(r => (
              <span key={r} className="px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--card)] small">
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* List */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(p => (
          <article key={p.id} className="card">
            <header className="flex items-center justify-between gap-3">
              <div className="font-semibold">{p.name}</div>
              <span className="small opacity-70">{p.country}</span>
            </header>
            <div className="small mt-1">
              {(p.city ?? '')}{p.city && p.regionTag ? ' · ' : ''}{p.regionTag ?? ''}
            </div>
            {p.phone && <div className="small mt-2">☎ {p.phone}</div>}
            {p.policy && (
              <div className="small mt-3 opacity-80">
                <strong>Policy:</strong> {p.policy}
              </div>
            )}
            {p.caution && (
              <div className="small mt-2" style={{ color: '#ffb4a6' }}>
                <strong>⚠ Caution:</strong> {p.caution}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}