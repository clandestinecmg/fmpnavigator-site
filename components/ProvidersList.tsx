// components/ProvidersList.tsx
"use client";

import React from "react";
import clsx from "clsx";

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

type Props = {
  providers: Provider[];
  selectedId: string | null | undefined;
  /** Name ends with Action to avoid Next’s “serialize” warning for client components */
  onSelectAction: (id: string) => void;
};

export default function ProvidersList({
  providers,
  selectedId,
  onSelectAction,
}: Props) {
  return (
    <aside aria-label="Direct-billing provider list" className="space-y-3">
      {providers.map((p) => {
        const active = p.id === selectedId;
        const name = p.gmaps?.formattedName ?? p.name;
        const address = p.gmaps?.formattedAddress ?? p.city ?? "";
        const phone = p.gmaps?.internationalPhone ?? p.phone ?? "";
        const url =
          p.gmaps?.url ??
          (typeof p.lat === "number" && typeof p.lng === "number"
            ? `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`
            : undefined);

        return (
          <article
            key={p.id}
            className={clsx(
              "card transition outline-none cursor-pointer",
              active ? 'ring-2 ring-(--brand)' : 'hover:brightness-110'
            )}
            role="button"
            tabIndex={0}
            onClick={() => onSelectAction(p.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelectAction(p.id);
            }}
            aria-pressed={active}
            aria-label={`Select ${name} on the map`}
          >
            <header className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{name}</h3>
                <div className="small mt-1 text-(--muted-foreground)">
                  {p.regionTag ? `${p.regionTag} · ` : ""}
                  {address}
                </div>
              </div>

              {p.caution ? (
                <span className="ml-2 inline-flex items-center whitespace-nowrap rounded-md border border-red-500/40 bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-300">
                  Caution
                </span>
              ) : null}
            </header>

            <div className="mt-3 space-y-2">
              {p.policy ? (
                <p className="small text-(--muted-foreground)">
                  {p.policy}
                </p>
              ) : null}
              {p.caution ? (
                <p className="small text-red-300">{p.caution}</p>
              ) : null}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {phone ? (
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="btn btn-ghost small"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {phone}
                  </a>
                ) : null}

                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-primary small"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Open in Google Maps
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </aside>
  );
}
