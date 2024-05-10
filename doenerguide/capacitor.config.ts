import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.doenerguide.app',
  appName: 'doenerguide',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
