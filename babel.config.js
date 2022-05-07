module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        corejs: {
          version: 3,
          proposals: true, // 使用尚在“提议”阶段特性的 polyfill
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  env: {
    development: {
      // babel-plugin-dynamic-import-node plugin only does one thing by converting all import() to require().
      // This plugin can significantly increase the speed of hot updates, when you have a large number of pages.
      // https://panjiachen.github.io/vue-element-admin-site/guide/advanced/lazy-loading.html
      plugins: [
        'dynamic-import-node',
        // 以下插件具有先后顺序
        // 首先编译装饰器语法
        [
          '@babel/plugin-proposal-decorators',
          {
            legacy: true,
          },
        ],
        // 再编译 class 语法
        '@babel/plugin-proposal-class-properties',
      ],
    },
  },
}
