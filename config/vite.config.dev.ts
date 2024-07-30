import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'development',
    server: {
      host: "0.0.0.0",
      open: false,
      fs: {
        strict: true,
      },
    },
    plugins: [],
  },
  baseConfig
);
