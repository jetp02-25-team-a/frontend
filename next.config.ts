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
      // 🌐 既有的圖片來源
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'loremflickr.com', port: '' },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3005',
        pathname: '/**',
      },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'maps.googleapis.com' },
      { protocol: 'https', hostname: 'lh4.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh5.googleusercontent.com' },

      // 🏛️ 基於 SQL 檔案中景點圖片的域名配置
      { protocol: 'https', hostname: 'ws.moi.gov.tw', pathname: '/**' },
      { protocol: 'https', hostname: 'upload.wikimedia.org', pathname: '/**' },
      { protocol: 'https', hostname: 'fupo.tw', pathname: '/**' },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media-cdn.tripadvisor.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dynamic-media-cdn.tripadvisor.com',
        pathname: '/**',
      },
      { protocol: 'https', hostname: 'www.abic.com.tw', pathname: '/**' },
      { protocol: 'https', hostname: 'www.dbnsa.gov.tw', pathname: '/**' },
      { protocol: 'https', hostname: 'www.settour.com.tw', pathname: '/**' },
      { protocol: 'https', hostname: 'www.taiwan.net.tw', pathname: '/**' },
      { protocol: 'https', hostname: 'travel.nantou.gov.tw', pathname: '/**' },
      { protocol: 'https', hostname: 'www.matsu-nsa.gov.tw', pathname: '/**' },
      { protocol: 'https', hostname: 'kmweb.moa.gov.tw', pathname: '/**' },
      { protocol: 'https', hostname: 'ezgo.ardswc.gov.tw', pathname: '/**' },
      { protocol: 'https', hostname: 'minimiigo.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdntwrunning.biji.co', pathname: '/**' },
      { protocol: 'https', hostname: 'zh.wikipedia.org', pathname: '/**' },
      { protocol: 'https', hostname: 'commons.wikimedia.org', pathname: '/**' },
      { protocol: 'https', hostname: 'drive.google.com', pathname: '/**' },
      { protocol: 'https', hostname: 's.yimg.com' },
      { protocol: 'https', hostname: '*' },
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
