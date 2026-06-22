/**
 * Image resource files used to compress the output of the production environment
 * 图片压缩
 * https://github.com/FatehAK/vite-plugin-image-optimizer
 */
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default function configImageminPlugin() {
  return ViteImageOptimizer({
    test: /\.(jpe?g|png|gif|webp|svg|avif)$/i,
    logStats: true,
    png: {
      quality: 90,
    },
    jpeg: {
      quality: 80,
    },
    jpg: {
      quality: 80,
    },
    webp: {
      quality: 80,
    },
    avif: {
      quality: 80,
    },
    svg: {
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              cleanupNumericValues: false,
              cleanupIds: {
                minify: false,
                remove: false,
              },
              convertPathData: false,
            },
          },
        },
        'sortAttrs',
        {
          name: 'addAttributesToSVGElement',
          params: {
            attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
          },
        },
      ],
    },
  });
}