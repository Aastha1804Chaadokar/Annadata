/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', 'framer-motion', 'lucide-react', 'styled-jsx'],
};

module.exports = nextConfig;
