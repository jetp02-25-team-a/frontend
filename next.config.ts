import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 關閉React Strict Mode工具(避免useEffect執行兩次)
  reactStrictMode: false,
  // eslint設定
  eslint: {
    // 忽略build時的eslint錯誤
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 忽略build時的typescript錯誤
    ignoreBuildErrors: false,
  },
  images: {
    // 從遠端連結圖片用的設定
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      {
        protocol: 'https',
        // ⭐️ 將 Faker 圖片的來源域名加入
        hostname: 'loremflickr.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  devIndicators: false,

  async rewrites() {
    const apiTarget = process.env.EXPRESS_SERVER_URL || 'http://localhost:3002';

    return [
      {
        // 前端呼叫： /api/users
        source: '/api/:path*',

        // Next.js 轉發到： http://localhost:5000/api/users
        destination: `${apiTarget}/api/:path*`, // <--- 在這裡加上 /api
      },
    ];
  },
};

export default nextConfig;
