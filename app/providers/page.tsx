// app/providers/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import ProvidersMap, { type Provider as ProviderType } from "@/components/ProvidersMap";
import ProvidersList from "@/components/ProvidersList";
import providersData from "@/data/providers.json";

type Filters = { country: string | null; city: string | null };

export default function ProvidersPage() {
  const allProviders = useMemo<ProviderType[]>(
    () => providersData as ProviderType[],
    [],
  );

  // Build filter options
  const countries = useMemo(
    () =>
      Array.from(
        new Set(allProviders.map((p) => (p.country || "").trim()).filter(Boolean)),
      ).sort(),
    [allProviders],
  );

  const [filters, setFilters] = useState<Filters>({ country: null, city: null });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const cities = useMemo(() => {
    if (!filters.country) return [];
    return Array.from(
      new Set(
        allProviders
          .filter((p) => p.country === filters.country)
          .map((p) => (p.city || "").trim())
          .filter(Boolean),
      ),
    ).sort();
  }, [allProviders, filters.country]);

  const providers = useMemo(() => {
    return allProviders.filter((p) => {
      if (filters.country && p.country !== filters.country) return false;
      if (filters.city && (p.city || "").trim() !== filters.city) return false;
      return true;
    });
  }, [allProviders, filters]);

  return (
    <section className="container py-8 space-y-6">
      <header>
        <h1 className="h1">Direct-Billing Providers</h1>
        <p className="muted mt-2">
          Every listed facility supports direct billing for the Foreign Medical Program.
          Please verify with the hospital’s HMO/insurance desk prior to visits; participation can change.
        </p>
      </header>

      {/* Filters */}
      <div className="card">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="country" className="label">Country</label>
            <select
              id="country"
              className="input text-base! md:text-lg! py-3! px-3!"
              value={filters.country ?? ""}
              onChange={(e) =>
                setFilters({
                  country: e.target.value || null,
                  city: null, // reset city when country changes
                })
              }
            >
              <option value="">All countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="city" className="label">City</label>
            <select
              id="city"
              className="input text-base! md:text-lg! py-3! px-3!"
              value={filters.city ?? ""}
              onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value || null }))}
              disabled={!filters.country}
            >
              <option value="">{filters.country ? "All cities" : "Select a country first"}</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setFilters({ country: null, city: null })}
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>

      {/* Map larger; list below in a 3×N grid to keep near map */}
      <div className="grid gap-6">
        <ProvidersMap
          providers={providers}
          selectedId={selectedId}
          initial={{ lat: 14.5995, lng: 120.9842, zoom: 6 }}
        />

        <ProvidersList
          providers={providers}
          selectedId={selectedId}
          onSelectAction={(id) => setSelectedId(id)}
          layout="grid"
        />
      </div>

      <aside className="card">
        <h2 className="h2 mb-2">Notes</h2>
        <ul className="list-disc ml-6 space-y-1 text-(--muted-foreground)">
          <li>
            We rely on <code>data/providers.json</code> (server-enriched with Google Maps) for name, address, phone, and exact geometry.
          </li>
          <li>
            Each item includes <code>gmaps.placeId</code> and canonical <code>gmaps.url</code> where available.
          </li>
        </ul>
      </aside>
    </section>
  );
}