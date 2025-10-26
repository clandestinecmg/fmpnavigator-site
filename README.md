This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# FMP Navigator — Data Enrichment & Maps Identity

This doc explains how we enrich `data/providers.json` with **Google Places** identity (place IDs, canonical names/addresses, official website/phone, and authoritative coordinates), and then merge the results into a final file used by the website.

---

## Overview

We maintain providers in three layers:

1) **Base** — `data/providers.json`  
   Curated records (name, city, phone, flags). Lat/lng may be rough.

2) **Enriched (generated)** — `data/providers.enriched.json`  
   Produced by `scripts/enrich-places.ts` (server-side Places API). Adds:
   ```ts
   gmaps?: {
     placeId?: string
     url?: string
     formattedName?: string
     formattedAddress?: string
     internationalPhone?: string
     location?: { lat: number, lng: number } // authoritative coordinates
   }