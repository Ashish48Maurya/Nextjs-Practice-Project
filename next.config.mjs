/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode:false,
    experimental: {
        appDir: true,
        serverComponentsExternalPackages:["mongoose"],
    }
};

export default nextConfig;
