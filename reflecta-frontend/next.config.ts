import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  // Ensure Turbopack treats THIS folder as the root
  turbopack: { root: path.resolve(__dirname) },

  // Optional (only to silence a dev warning if you open via LAN IP)
  allowedDevOrigins: [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://192.168.1.37:3000',
  ],
};

export default nextConfig;
