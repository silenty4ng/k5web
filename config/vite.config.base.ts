import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import configArcoStyleImportPlugin from './plugin/arcoStyleImport';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';

import htmlPlugin from "vite-plugin-html-config";

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    vueJsx(),
    svgLoader({ svgoConfig: {} }),
    configArcoStyleImportPlugin(),
    AutoImport({
      resolvers: [TDesignResolver({
        library: 'vue-next'
      })],
    }),
    Components({
      resolvers: [TDesignResolver({
        library: 'vue-next'
      }), ArcoResolver()],
    }),
    htmlPlugin({
      metas: [
        {
          name: "builtTime",
          content: Math.ceil(parseInt(new Date().toISOString().replace(/[.:TZ-]/g, '')) / 1000).toString()
        },
      ]
    })
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, '../src'),
      },
      {
        find: 'assets',
        replacement: resolve(__dirname, '../src/assets'),
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js', // Resolve the i18n warning issue
      },
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm-bundler.js', // compile template
      },
    ],
    extensions: ['.ts', '.js', '.css'],
  },
  define: {
    'process.env': {},
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            'src/assets/style/breakpoint.less'
          )}";`,
        },
        javascriptEnabled: true,
      },
    },
    postcss: {
      plugins: [
        require('postcss-px-to-viewport')({
          viewportWidth: 2560, // 视口宽度，对应设计稿宽度
          viewporHeight: 1392, // 视口高度，对应设计稿高度
          unitPrecision: 3, // 指定px转换之后的小数位数
          viewportUnit: 'vw', // 转换的单位
          fontViewportUnit: 'vw', // 字体使用的单位
          replace: false, //  是否直接更换属性值，而不添加备用属性
          selectorBlackList: ['.ignore', '.hairlines', '.arco', '.layout'], // 指定不转换的类
          exclude: /(\/|\\)(node_modules)(\/|\\)/, //禁止更改第三方UI框架样式
          minPixelValue: 15, // 小于或等于1px不转换
          mediaQuery: true, // 允许在媒体查询中转换
        })
      ]
    }
  },
});
