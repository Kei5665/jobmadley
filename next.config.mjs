/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
        pathname: '/**',
      },
      // 念のためサブドメインが付くケースも許可
      {
        protocol: 'https',
        hostname: '**.microcms-assets.io',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
