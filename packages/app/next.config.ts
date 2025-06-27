/** @type {import('next').NextConfig} */

import withPWAConfig from 'next-pwa';

const withPWA = withPWAConfig({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
