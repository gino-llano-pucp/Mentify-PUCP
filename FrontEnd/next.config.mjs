/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
                port: '',
                pathname: '/api/**',
            },
            {
                // Nuevo patrón para lh3.googleusercontent.com
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '', // Deja el puerto vacío si el servicio usa el puerto estándar de HTTPS (443)
                pathname: '/**', // Permite cualquier ruta bajo este dominio
            },
        ],
        dangerouslyAllowSVG: true,
        domains: ['ui-avatars.com'],
    },
    webpack: (config) => {
        // Grab the existing rule that handles SVG imports
        const fileLoaderRule = config.module.rules.find((rule) =>
        rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
        // Reapply the existing rule, but only for svg imports ending in ?url
        {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
        },
        // Convert all other *.svg imports to React components
        {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
        },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
    },
  };

export default nextConfig;
