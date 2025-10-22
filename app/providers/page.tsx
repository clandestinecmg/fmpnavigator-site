// app/providers/page.tsx
import ProvidersMap from '@/components/ProvidersMap';

type BaseProvider = {
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

// --- Your data (PH + TH) without precise coords (rough hints below) ---
const PH: BaseProvider[] = [
  {
    id: 'ph_cavite_divine_grace_medical_center',
    name: 'Divine Grace Medical Center (DGMC)',
    country: 'PH',
    city: 'General Trias, Cavite',
    regionTag: 'Cavite',
    phone: '+63464860100',
    policy:
      'Confirmed by the VA Manila VISN21 as a current direct-billing provider. Verify with the HMO desk prior to visits.',
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
  },
];

const TH: BaseProvider[] = [
  { id: 'th_bkk_bangkok_hospital_bangkok', name: 'Bangkok Hospital Bangkok', country: 'TH', city: 'Bangkok', regionTag: 'Bangkok', policy: '10,000 THB Minimum' },
  { id: 'th_pattaya_bangkok_hospital_pattaya', name: 'Bangkok Hospital Pattaya', country: 'TH', city: 'Pattaya', regionTag: 'Pattaya', caution: 'Currently forcing veterans to sign FDA-waivers that compromise treatment plans. Avoid until further notice.', policy: 'Investigating; avoid' },
  { id: 'th_cnx_bangkok_hospital_chiang_mai', name: 'Bangkok Hospital Chiang Mai', country: 'TH', city: 'Chiang Mai', regionTag: 'Chiang Mai', policy: '5,000 THB Minimum' },
  { id: 'th_udon_bangkok_hospital_udon_thani', name: 'Bangkok Hospital Udon Thani', country: 'TH', city: 'Udon Thani', regionTag: 'Udon Thani', policy: '10,000 THB Minimum · 200,000 THB Max Cap' },
  { id: 'th_hua_hin_bangkok_hospital_hua_hin', name: 'Bangkok Hospital Hua Hin', country: 'TH', city: 'Hua Hin', regionTag: 'Hua Hin', policy: 'Inpatient Only' },
  { id: 'th_chiang_rai_bangkok_hospital_chiang_rai', name: 'Bangkok Hospital Chiang Rai', country: 'TH', city: 'Chiang Rai', regionTag: 'Chiang Rai', policy: '10,000 THB Minimum' },
  { id: 'th_pak_chong_bangkok_hospital_pak_chong', name: 'Bangkok Hospital Pak Chong', country: 'TH', city: 'Pak Chong', regionTag: 'Nakhon Ratchasima', policy: '5,000 THB Minimum' },
  { id: 'th_cnx_chiangmai_ram', name: 'Chiangmai Ram Hospital', country: 'TH', city: 'Chiang Mai', regionTag: 'Chiang Mai', policy: '10,000 THB Minimum' },
  { id: 'th_bkk_samitivej_bangkok', name: 'Samitivej Bangkok', country: 'TH', city: 'Bangkok', regionTag: 'Bangkok', policy: 'No Limits or Caps' },
  { id: 'th_bkk_samitivej_srinakarin', name: 'Samitivej Srinakarin', country: 'TH', city: 'Bangkok', regionTag: 'Srinakarin', policy: 'No Limits or Caps' },
  { id: 'th_sriracha_samitivej_sriracha', name: 'Samitivej Sriracha', country: 'TH', city: 'Si Racha', regionTag: 'Chonburi', policy: 'No Limits or Caps' },
  { id: 'th_phuket_miracles_asia_rehab', name: 'Miracles Asia: Rehabilitation', country: 'TH', city: 'Phuket', regionTag: 'Rehabilitation', policy: 'No Limits or Caps' },
  { id: 'th_cnx_ingjai_clinic', name: 'Ingjai Clinic', country: 'TH', city: 'Chiang Mai', regionTag: 'Mental Health', policy: 'No Limits or Caps' },
  { id: 'th_jomtien_heroes_total_wellness', name: 'Heroes Total Wellness', country: 'TH', city: 'Jomtien', regionTag: 'Chonburi', policy: 'No Limits or Caps' },
];

// QUICK & DIRTY COORD HINTS (replace with exact coords later)
const roughGeo = (p: BaseProvider) => {
  const c = p.city.toLowerCase();
  if (p.country === 'PH') {
    if (c.includes('angeles')) return { lat: 15.147, lng: 120.586 };
    if (c.includes('mandaluyong')) return { lat: 14.583, lng: 121.056 };
    if (c.includes('manila')) return { lat: 14.5995, lng: 120.9842 };
    if (c.includes('tanza')) return { lat: 14.334, lng: 120.853 };
    if (c.includes('general trias')) return { lat: 14.386, lng: 120.881 };
    if (c.includes('iloilo')) return { lat: 10.72, lng: 122.562 };
    return { lat: 14.6, lng: 121.0 };
  }
  if (c.includes('bangkok')) return { lat: 13.7563, lng: 100.5018 };
  if (c.includes('pattaya')) return { lat: 12.9236, lng: 100.8825 };
  if (c.includes('chiang mai')) return { lat: 18.7883, lng: 98.9853 };
  if (c.includes('udon')) return { lat: 17.4138, lng: 102.7877 };
  if (c.includes('hua hin')) return { lat: 12.5684, lng: 99.9577 };
  if (c.includes('chiang rai')) return { lat: 19.9105, lng: 99.8406 };
  if (c.includes('pak chong')) return { lat: 14.7088, lng: 101.4160 };
  if (c.includes('si racha') || c.includes('sriracha')) return { lat: 13.1737, lng: 100.9311 };
  if (c.includes('phuket')) return { lat: 7.8804, lng: 98.3923 };
  if (c.includes('jomtien')) return { lat: 12.8859, lng: 100.8727 };
  return { lat: 13.7563, lng: 100.5018 };
};

export default function ProvidersPage() {
  const providers = [...PH, ...TH].map((p) => ({ ...p, ...roughGeo(p) }));

  return (
    <section className="container py-8 space-y-6">
      <header>
        <h1 className="h1">Direct-Billing Providers</h1>
        <p className="muted mt-2">
          Locations reported as direct-billing. Please verify with each hospital’s HMO/insurance desk prior to visits; participation can change.
        </p>
      </header>

      <ProvidersMap providers={providers} />

      <aside className="card">
        <h2 className="h2 mb-2">Notes</h2>
        <ul className="list-disc ml-6 space-y-1 text-[var(--muted-foreground)]">
          <li>Use the marker cards for quick “Directions”.</li>
          <li>We’ll refine coordinates and add countries beyond PH/TH next.</li>
        </ul>
      </aside>
    </section>
  );
}