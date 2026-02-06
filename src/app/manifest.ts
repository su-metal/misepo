import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MisePo',
    short_name: 'MisePo',
    description: '飲食店・美容室特化のSNS投稿作成AIアシスタント',
    start_url: '/generate',
    display: 'standalone',
    scope: '/',
    background_color: '#f0eae4',
    theme_color: '#1823ff',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
