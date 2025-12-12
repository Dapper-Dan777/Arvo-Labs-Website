/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export' entfernt, da Clerk Server-seitige Funktionalität benötigt
  reactStrictMode: false, // Deaktiviert, um doppeltes Rendering zu vermeiden
  eslint: {
    // Linting darf lokal laufen, aber nicht den Vercel-Build abbrechen
    ignoreDuringBuilds: true,
  },
  // Unterdrücke Warnungen für params in Next.js 15
  experimental: {
    // Deaktiviere die params-Warnung, da wir keine dynamischen Routen verwenden
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Logging reduzieren
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
}

module.exports = nextConfig


