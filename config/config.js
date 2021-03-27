import * as path from "path";

export default {
  base: '/render-api/',
  publicPath: '/render-api/',
  outputPath: 'docs',
  title: 'RenderApi',
  description: 'render react components through api',
  logo: 'https://gitee.com/llixianjie/m78/raw/master/public/logo.png',
  mode: 'doc',
  resolve: {
    includes: [path.resolve(__dirname, '../src/docs'), '../README.md'],
  },
  alias: {
    '@m78/render-api': path.resolve(__dirname, '../src/index.ts'),
  },
  dynamicImport: {},
  exportStatic: {},
}
