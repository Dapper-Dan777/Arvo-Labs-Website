/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: false, // Deaktiviert, um doppeltes Rendering zu vermeiden
  // Unterstützung für src/ Verzeichnis
  // Next.js sucht automatisch nach app/ oder src/app/
  webpack: (config, { isServer }) => {
    // Schließe src/ Verzeichnis aus dem Build aus (React Router Dateien)
    // Diese Dateien sind für ein separates Vite-Projekt gedacht
    const srcPath = path.resolve(__dirname, 'src');
    
    // Füge src/ zu allen relevanten Regeln als exclude hinzu
    config.module.rules.forEach((rule) => {
      if (rule.test && (rule.test.toString().includes('jsx') || rule.test.toString().includes('tsx') || rule.test.toString().includes('js') || rule.test.toString().includes('ts'))) {
        if (!rule.exclude) {
          rule.exclude = [];
        }
        if (Array.isArray(rule.exclude)) {
          if (!rule.exclude.some(ex => ex && ex.toString && ex.toString().includes('src'))) {
            rule.exclude.push(srcPath);
          }
        } else if (rule.exclude) {
          rule.exclude = [rule.exclude, srcPath];
        } else {
          rule.exclude = srcPath;
        }
      }
    });
    
    // Ignoriere auch in resolve
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    return config;
  },
}

module.exports = nextConfig


