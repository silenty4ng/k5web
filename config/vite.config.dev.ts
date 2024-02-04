import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: false,
      fs: {
        strict: true,
      },
    },
    plugins: [],
  },
  baseConfig
);
