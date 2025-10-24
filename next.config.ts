/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            // Common image hosting services
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'assets.aceternity.com' },
            { protocol: 'https', hostname: 'static.dezeen.com' },
            { protocol: 'https', hostname: 'www.victoryxr.com' },
            { protocol: 'https', hostname: 'github.com' },
            { protocol: 'https', hostname: 'imgur.com' },
            { protocol: 'https', hostname: 'i.imgur.com' },
            { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
        ],
    },
    eslint: {
        // Ne bloque PAS le build en cas d'erreurs eslint
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
