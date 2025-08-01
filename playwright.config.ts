import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    video: 'on',
    screenshot: 'only-on-failure',
    trace: 'on',
  },
  reporter: [['html', { open: 'never' }]],
});
