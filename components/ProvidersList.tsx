'use client';

import React, { useMemo, useState } from 'react';
import type { Provider } from './ProvidersMap';

type Props = {
  providers: Provider[];
  selectedId?: string | null;
  /** Name ending with Action to satisfy Next.js client entry rule */
  onSelectAction?: (id: string) => void;
};

export default function ProvidersList({ providers, selectedId, onSelectAction }: Props) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return providers;
    return providers.filter((p) => {
      const blob = [
        p.name,
        p.city,
        p.regionTag ?? '',
        p.country,
        p.policy ?? '',
        p.caution ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return blob.includes(s);
    });
  }, [providers, q]);

  return (
    <aside className="card h-full">
      <div className="mb-3">
        <h3 className="h2 mb-2">Providers ({filtered.length})</h3>
        <input
          type="search"
          className="input"
          placeholder="Search city, region, name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search providers"
        />
      </div>

      <ul className="space-y-2 max-h-[520px] overflow-auto pr-2">
        {filtered.map((p) => {
          const active = p.id === selectedId;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onSelectAction?.(p.id)}
                className={[
                  'w-full text-left rounded-lg border px-3 py-2 transition',
                  active
                    ? 'border-[var(--brand-600)] bg-[var(--brand-50)]'
                    : 'border-[var(--border)] hover:bg-[var(--card-2)]',
                ].join(' ')}
                aria-pressed={active}
                aria-label={`Focus ${p.name} on map`}
              >
                <div className="font-medium">{p.name}</div>
                <div className="small text-[var(--muted-foreground)]">
                  {[p.city, p.regionTag].filter(Boolean).join(', ')}
                </div>
                {p.caution && (
                  <div className="small mt-1 text-red-700">{p.caution}</div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}