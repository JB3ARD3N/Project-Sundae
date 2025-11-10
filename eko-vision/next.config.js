/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'octbnfykltfdkuiyvynr.supabase.co']
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'eKo.vision'
  }
};

module.exports = nextConfig;
