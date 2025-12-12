/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: false, // Deaktiviert, um doppeltes Rendering zu vermeiden
  // Unterstützung für src/ Verzeichnis
  // Next.js sucht automatisch nach app/ oder src/app/
  webpack: (config, { isServer }) => {
    // Schließe nur src/pages/ und src/App.jsx aus dem Build aus (React Router Dateien)
    // src/components/dashboard/ wird weiterhin benötigt
    const srcPagesPath = path.resolve(__dirname, 'src/pages');
    const srcAppPath = path.resolve(__dirname, 'src/App.jsx');
    const srcComponentsNavPath = path.resolve(__dirname, 'src/components/Navigation.jsx');
    
    // Erstelle eine Funktion, um zu prüfen, ob ein Pfad ausgeschlossen werden soll
    const shouldExclude = (resourcePath) => {
      const normalizedPath = resourcePath.replace(/\\/g, '/');
      return (
        normalizedPath.includes('/src/pages/') ||
        normalizedPath.includes('/src/App.jsx') ||
        normalizedPath.includes('/src/components/Navigation.jsx')
      );
    };
    
    // Füge src/pages/ zu allen relevanten Regeln als exclude hinzu
    config.module.rules.forEach((rule) => {
      if (rule.test && (rule.test.toString().includes('jsx') || rule.test.toString().includes('tsx') || rule.test.toString().includes('js') || rule.test.toString().includes('ts'))) {
        // Erstelle eine benutzerdefinierte exclude-Funktion
        const originalExclude = rule.exclude;
        rule.exclude = (resourcePath) => {
          // Prüfe zuerst die benutzerdefinierte Logik
          if (shouldExclude(resourcePath)) {
            return true;
          }
          // Dann die ursprüngliche exclude-Logik
          if (typeof originalExclude === 'function') {
            return originalExclude(resourcePath);
          }
          if (Array.isArray(originalExclude)) {
            return originalExclude.some(ex => {
              if (typeof ex === 'function') {
                return ex(resourcePath);
              }
              if (typeof ex === 'string') {
                return resourcePath.includes(ex);
              }
              return false;
            });
          }
          if (originalExclude instanceof RegExp) {
            return originalExclude.test(resourcePath);
          }
          return false;
        };
      }
    });
    
    return config;
  },
}

module.exports = nextConfig


