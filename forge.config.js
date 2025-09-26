module.exports = {
  packagerConfig: {
    name: 'K5Web',
    asar: true,
    icon: 'icon.ico',
    appCopyright: "Copyright (c) 2025 Silent YANG. All rights reserved."
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
		    "setupIcon": __dirname + "/icon.ico",
		    "iconUrl": __dirname + "/icon.ico",
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
    {
      name: '@rabbitholesyndrome/electron-forge-maker-portable',
      config: {
        appId: 'com.vicicode.k5web',
        productName: 'K5Web',
        icon: 'icon.ico'
      },
      portable: {
        artifactName: 'k5web.exe'
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
