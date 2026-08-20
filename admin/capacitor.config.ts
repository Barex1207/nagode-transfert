import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nagodetransfert.admin',
  appName: 'NagodeAdmin',
  webDir: 'dist',
  // Points the native shell at the live production admin instead of bundling
  // a snapshot of the web build, so the app always shows the current
  // deployed version without needing a new APK for every change.
  server: {
    url: 'https://nagode-transfert-fu5p-ruddy.vercel.app',
    cleartext: false,
  },
};

export default config;
