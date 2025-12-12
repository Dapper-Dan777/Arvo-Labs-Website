/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Deaktiviert, um doppeltes Rendering zu vermeiden
  eslint: {
    // Linting darf lokal laufen, aber nicht den Vercel-Build abbrechen
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig


