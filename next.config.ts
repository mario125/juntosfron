// next.config.js
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',  // Habilitar exportación estática
  reactStrictMode: true, // Modo estricto de React
  trailingSlash: true, // Asegurar el uso de barras al final de las URLs
};

module.exports = nextConfig;
