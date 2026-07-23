/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'img.1shop.tw' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    taint: true,
  },
}

export default nextConfig
