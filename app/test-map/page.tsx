// app/test-map/page.tsx
'use client';

import { useEffect } from 'react';

export default function TestMap() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_MAPS_API_KEY;
    if (!key) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 13.7563, lng: 100.5018 }, // Bangkok
        zoom: 8,
        mapTypeControl: false,
        streetViewControl: false,
      });
      new google.maps.Marker({
        position: { lat: 13.7563, lng: 100.5018 },
        map,
        title: 'Bangkok',
      });
    };
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center container">
      <h1 className="h1 mb-4">Map Test</h1>
      <div id="map" style={{ height: '500px', width: '100%', borderRadius: '1rem' }} />
    </section>
  );
}