module.exports = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.experiments = {topLevelAwait: true}
    return config
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_GO_REVISION: process.env.NEXT_PUBLIC_GO_REVISION,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  }
}
