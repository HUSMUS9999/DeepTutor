/** @type {import('next').NextConfig} */

const nextConfig = {
  // Move dev indicator to bottom-right corner
  devIndicators: {
    position: "bottom-right",
  },

  // Transpile mermaid and related packages for proper ESM handling
  transpilePackages: ["mermaid"],

  // Turbopack configuration (Next.js 16+ uses Turbopack by default for dev)
  turbopack: {
    resolveAlias: {
      // Fix for mermaid's cytoscape dependency - use CJS version
      cytoscape: "cytoscape/dist/cytoscape.cjs.js",
    },
  },

  // Webpack configuration (used for production builds - next build)
  webpack: (config) => {
    const path = require("path");
    config.resolve.alias = {
      ...config.resolve.alias,
      cytoscape: path.resolve(
        __dirname,
        "node_modules/cytoscape/dist/cytoscape.cjs.js",
      ),
    };
    return config;
  },

  // Proxy API requests to backend (for Render deployment where only one port is exposed)
  async rewrites() {
    // In production on Render, proxy to internal backend
    // BACKEND_URL can be set to internal URL, defaults to localhost:8001
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8001';
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
