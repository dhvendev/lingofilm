/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: "https",
            hostname: "s3.lingofilm.ru",
            port: "",
            pathname: "/**"
        }]
    }
};
export default nextConfig;
