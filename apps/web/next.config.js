const withTM = require('next-transpile-modules')(['@better-ts-errors/engine'])

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = withTM(nextConfig)
