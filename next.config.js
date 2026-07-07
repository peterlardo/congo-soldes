/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  outputFileTracingIncludes: {
    '/*': ['./node_modules/.prisma/client/**/*'],
    '/api/**/*': ['./node_modules/.prisma/client/**/*'],
  },
}

module.exports = nextConfig
