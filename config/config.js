import * as path from "path";

export default {
  base: '/render-api/',
  publicPath: '/render-api/',
  outputPath: 'docs',
  title: 'RenderApi',
  description: 'render react components through api',
  logo: '/logo.png',
  mode: 'doc',
  resolve: {
    includes: [path.resolve(__dirname, '../doc'), '../README.md'],
  },
  alias: {
    '@m78/render-api': path.resolve(__dirname, '../src/index.ts'),
  },
  // chunks: ['app'],
  dynamicImport: {},
  exportStatic: {
    // dynamicRoot: true,
  },
}
