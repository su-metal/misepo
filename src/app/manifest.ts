import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MisePo',
    short_name: 'MisePo',
    description: '飲食店・美容室特化のSNS投稿作成AIアシスタント',
    start_url: '/generate',
    display: 'standalone',
    scope: '/',
    background_color: '#E8F1F2',
    theme_color: '#E8F1F2',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
