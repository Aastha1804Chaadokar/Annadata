/** @type {import('next').NextConfig} */
process.env.NEXT_IGNORE_INCORRECT_LOCKFILE = '1';

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', 'framer-motion', 'lucide-react', 'styled-jsx'],
  async rewrites() {
    return [
      {
        source: '/marketplace',
        destination: '/market',
      },
    ];
  },
};

module.exports = nextConfig;
