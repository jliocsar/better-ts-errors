const withTM = require('next-transpile-modules')(['@better-ts-errors/parser'])

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn-icons-png.flaticon.com'],
  },
}

module.exports = withTM(nextConfig)
