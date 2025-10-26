// app/providers/page.tsx
'use client';

import React, { useMemo, useState } from 'react';
import ProvidersMap, { type Provider as ProviderType } from '@/components/ProvidersMap';
import ProvidersList from '@/components/ProvidersList';

// Use the merged & applied dataset (includes gmaps.placeId/url/phone/address/coords)
import providersData from '@/data/providers.json';

export default function ProvidersPage() {
  // Keep the providers array STABLE across renders to avoid re-initting the map
  const providers = useMemo<ProviderType[]>(
    () => providersData as ProviderType[],
    []
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <section className="container py-8 space-y-6">
      <header className="fade-in">
        <h1 className="h1">Direct-Billing Providers</h1>
        <p className="muted mt-2">
          Locations reported as direct-billing. Please verify with each hospital’s HMO/insurance desk prior to visits; participation can change.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[1.2fr_.8fr]">
        <ProvidersMap
          providers={providers}
          selectedId={selectedId}
          initial={{ lat: 14.5995, lng: 120.9842, zoom: 6 }} // Manila default
        />
        <ProvidersList
          providers={providers}
          selectedId={selectedId}
          onSelectAction={(id) => setSelectedId(id)}
        />
      </div>

      <aside className="card">
        <h2 className="h2 mb-2">Notes</h2>
        <ul className="list-disc ml-6 space-y-1 text-[var(--muted-foreground)]">
          <li>
            We now rely on <code>data/providers.json</code> (server-enriched with Google Maps) for name, address, phone, and exact geometry.
          </li>
          <li>
            Each item includes <code>gmaps.placeId</code> and canonical <code>gmaps.url</code> where available.
          </li>
        </ul>
      </aside>
    </section>
  );
}