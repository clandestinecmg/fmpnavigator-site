// app/providers/page.tsx
'use client';

import React, { useMemo, useState } from 'react';
import ProvidersMap, { type Provider as ProviderType } from '@/components/ProvidersMap';
import ProvidersList from '@/components/ProvidersList';

/**
 * Provider seed data.
 * You can move this to /data/providers.json later.
 * Add gmaps.placeId when you have it; the map will resolve canonical name, address, phone, and exact geometry.
 */
const PROVIDERS_RAW: ProviderType[] = [
  // =======================
  // Philippines (PH)
  // =======================
  {
    id: 'ph_cavite_divine_grace_medical_center',
    name: 'Divine Grace Medical Center (DGMC)',
    country: 'PH',
    city: 'General Trias, Cavite',
    regionTag: 'Cavite',
    phone: '+63464860100',
    policy:
      'Confirmed by the VA Manila VISN21 as a current direct-billing provider. Verify with the HMO desk prior to visits.',
    lat: 14.386,
    lng: 120.881,
    gmaps: {
      // placeId: 'REPLACE_WITH_PLACE_ID',
      // url: 'https://maps.google.com/?cid=...',
      // formattedName: 'Divine Grace Medical Center',
      // formattedAddress: 'Governor’s Dr, Brgy San Gabriel, General Trias, Cavite, Philippines',
    },
  },
  {
    id: 'ph_mandaluyong_manila_hearing_aid',
    name: 'Manila Hearing Aid',
    country: 'PH',
    city: 'Ortigas Center, Mandaluyong City',
    regionTag: 'Metro Manila',
    phone: '+63286369393',
    policy:
      'Confirmed by the VA Manila VISN21 as a current direct-billing provider. Verify with the HMO desk prior to visits.',
    lat: 14.583,
    lng: 121.056,
    gmaps: {
      // placeId: 'REPLACE_WITH_PLACE_ID',
      // url: 'https://maps.google.com/?cid=...',
    },
  },
  {
    id: 'ph_manila_medical_center_manila',
    name: 'Medical Center Manila (ManilaMed)',
    country: 'PH',
    city: 'Paco, Manila',
    regionTag: 'Metro Manila',
    phone: '+63285238131',
    policy:
      'Confirmed by the VA Manila VISN21 as a current direct-billing provider. Verify with the HMO desk prior to visits.',
    lat: 14.5822,
    lng: 120.9881,
    gmaps: {
      // placeId: 'REPLACE_WITH_PLACE_ID',
    },
  },
  {
    id: 'ph_pampanga_sacred_heart_medical_center',
    name: 'Sacred Heart Medical Center (SHMC)',
    country: 'PH',
    city: 'Angeles City, Pampanga',
    regionTag: 'Pampanga',
    phone: '+63458884444',
    policy:
      'Confirmed by the VA Manila VISN21 as a current direct-billing provider. Verify with the HMO desk prior to visits.',
    lat: 15.147,
    lng: 120.586,
  },
  {
    id: 'ph_cavite_tanza_specialists_medical_center',
    name: 'Tanza Specialists Medical Center (TSMC)',
    country: 'PH',
    city: 'Tanza, Cavite',
    regionTag: 'Cavite',
    phone: '+63465417400',
    policy:
      'Confirmed by the VA Manila VISN21 as a current direct-billing provider. Verify with the HMO desk prior to visits.',
    lat: 14.334,
    lng: 120.853,
  },
  {
    id: 'ph_pampanga_medical_city_clark',
    name: 'The Medical City Clark (TMCC)',
    country: 'PH',
    city: 'Angeles City, Pampanga',
    regionTag: 'Pampanga',
    phone: '+63458683188',
    caution:
      'No mental health provider coverage under direct-billing. Consider private consults or VA reimbursement routes.',
    policy:
      'Confirmed by the VA Manila VISN21 as a current direct-billing provider. Verify with the HMO desk prior to visits.',
    lat: 15.1862,
    lng: 120.5580,
  },
  {
    id: 'ph_iloilo_medical_city_iloilo',
    name: 'The Medical City Iloilo (TMCI)',
    country: 'PH',
    city: 'Molo, Iloilo City, Iloilo',
    regionTag: 'Iloilo',
    phone: '+63333237000',
    policy:
      'Confirmed by the VA Manila VISN21 as a current direct-billing provider. Verify with the HMO desk prior to visits.',
    lat: 10.7174,
    lng: 122.5506,
  },

  // =======================
  // Thailand (TH)
  // =======================
  {
    id: 'th_bkk_bangkok_hospital_bangkok',
    name: 'Bangkok Hospital Bangkok',
    country: 'TH',
    city: 'Bangkok',
    regionTag: 'Bangkok',
    policy: '10,000 THB Minimum',
    lat: 13.7460,
    lng: 100.5850,
    gmaps: {
      // placeId: 'REPLACE_WITH_PLACE_ID',
    },
  },
  {
    id: 'th_pattaya_bangkok_hospital_pattaya',
    name: 'Bangkok Hospital Pattaya',
    country: 'TH',
    city: 'Pattaya',
    regionTag: 'Pattaya',
    caution:
      'Currently forcing veterans to sign FDA-waivers that compromise treatment plans. Avoid until further notice.',
    policy: 'Investigating; avoid',
    lat: 12.9435,
    lng: 100.9011,
    gmaps: {
      // placeId: 'REPLACE_WITH_PLACE_ID',
    },
  },
  {
    id: 'th_cnx_bangkok_hospital_chiang_mai',
    name: 'Bangkok Hospital Chiang Mai',
    country: 'TH',
    city: 'Chiang Mai',
    regionTag: 'Chiang Mai',
    policy: '5,000 THB Minimum',
    lat: 18.7953,
    lng: 98.9740,
    gmaps: {
      // placeId: 'REPLACE_WITH_PLACE_ID',
    },
  },
  {
    id: 'th_udon_bangkok_hospital_udon_thani',
    name: 'Bangkok Hospital Udon Thani',
    country: 'TH',
    city: 'Udon Thani',
    regionTag: 'Udon Thani',
    policy: '10,000 THB Minimum · 200,000 THB Max Cap',
    lat: 17.4048,
    lng: 102.7937,
    gmaps: {
      // placeId: 'REPLACE_WITH_PLACE_ID',
    },
  },
  {
    id: 'th_hua_hin_bangkok_hospital_hua_hin',
    name: 'Bangkok Hospital Hua Hin',
    country: 'TH',
    city: 'Hua Hin',
    regionTag: 'Hua Hin',
    policy: 'Inpatient Only',
    lat: 12.6074,
    lng: 99.9577,
    gmaps: {
      // placeId: 'REPLACE_WITH_PLACE_ID',
    },
  },
  {
    id: 'th_chiang_rai_bangkok_hospital_chiang_rai',
    name: 'Bangkok Hospital Chiang Rai',
    country: 'TH',
    city: 'Chiang Rai',
    regionTag: 'Chiang Rai',
    policy: '10,000 THB Minimum',
    lat: 19.9105,
    lng: 99.8406,
    gmaps: {
      // placeId: 'REPLACE_WITH_PLACE_ID',
    },
  },
  {
    id: 'th_pak_chong_bangkok_hospital_pak_chong',
    name: 'Bangkok Hospital Pak Chong',
    country: 'TH',
    city: 'Pak Chong',
    regionTag: 'Nakhon Ratchasima',
    policy: '5,000 THB Minimum',
    lat: 14.7088,
    lng: 101.416,
    gmaps: {
      // placeId: 'REPLACE_WITH_PLACE_ID',
    },
  },
  {
    id: 'th_cnx_chiangmai_ram',
    name: 'Chiangmai Ram Hospital',
    country: 'TH',
    city: 'Chiang Mai',
    regionTag: 'Chiang Mai',
    policy: '10,000 THB Minimum',
    lat: 18.7942,
    lng: 98.9817,
    gmaps: {
      // placeId: 'REPLACE_WITH_PLACE_ID',
    },
  },
  {
    id: 'th_bkk_samitivej_bangkok',
    name: 'Samitivej Bangkok',
    country: 'TH',
    city: 'Bangkok',
    regionTag: 'Bangkok',
    policy: 'No Limits or Caps',
    lat: 13.7395,
    lng: 100.5824,
    gmaps: {
      // placeId: 'REPLACE_WITH_PLACE_ID',
    },
  },
  {
    id: 'th_bkk_samitivej_srinakarin',
    name: 'Samitivej Srinakarin',
    country: 'TH',
    city: 'Bangkok',
    regionTag: 'Srinakarin',
    policy: 'No Limits or Caps',
    lat: 13.7427,
    lng: 100.6429,
    gmaps: {
      // placeId: 'REPLACE_WITH_PLACE_ID',
    },
  },
  {
    id: 'th_sriracha_samitivej_sriracha',
    name: 'Samitivej Sriracha',
    country: 'TH',
    city: 'Si Racha',
    regionTag: 'Chonburi',
    policy: 'No Limits or Caps',
    lat: 13.1533,
    lng: 100.9311,
    gmaps: {
      // placeId: 'REPLACE_WITH_PLACE_ID',
    },
  },
  {
    id: 'th_phuket_miracles_asia_rehab',
    name: 'Miracles Asia: Rehabilitation',
    country: 'TH',
    city: 'Phuket',
    regionTag: 'Rehabilitation',
    policy: 'No Limits or Caps',
    lat: 7.8900,
    lng: 98.3850,
    gmaps: {
      // placeId: 'REPLACE_WITH_PLACE_ID',
    },
  },
  {
    id: 'th_cnx_ingjai_clinic',
    name: 'Ingjai Clinic',
    country: 'TH',
    city: 'Chiang Mai',
    regionTag: 'Mental Health',
    policy: 'No Limits or Caps',
    lat: 18.7900,
    lng: 98.9900,
    gmaps: {
      // placeId: 'REPLACE_WITH_PLACE_ID',
    },
  },
  {
    id: 'th_jomtien_heroes_total_wellness',
    name: 'Heroes Total Wellness',
    country: 'TH',
    city: 'Jomtien',
    regionTag: 'Chonburi',
    policy: 'No Limits or Caps',
    lat: 12.8872,
    lng: 100.8742,
    gmaps: {
      // placeId: 'REPLACE_WITH_PLACE_ID',
    },
  },
];

export default function ProvidersPage() {
  // Keep the providers array STABLE across renders to avoid re-initting the map
  const providers = useMemo<ProviderType[]>(() => PROVIDERS_RAW, []);
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
          initial={{ lat: 14.5995, lng: 120.9842, zoom: 6 }}
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
          <li>Use “Open in Google Maps” for verified listing when available.</li>
          <li>Populate <code>gmaps.placeId</code> for each entry to lock identity and coordinates.</li>
          <li>Entries with only a <code>placeId</code> (no lat/lng) will still render; the map resolves geometry on demand.</li>
        </ul>
      </aside>
    </section>
  );
}