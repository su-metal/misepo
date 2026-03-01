import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './tests/e2e/demo',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  // デモ録画専用なのでタイムアウトを長めに設定 (5分)
  timeout: 300000,
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://localhost:3000',
    // 録画時にUI操作が安定するように設定
    headless: true, // CI環境やバックグラウンド生成ではtrueにする
    viewport: { width: 1920, height: 1080 },
    // 録画設定: 常に録画し、1080pで出力する
    video: {
      mode: 'on',
      size: { width: 1920, height: 1080 },
    },
    // 必要であれば認証状態を読み込む（TODO: テストログイン時に要検討）
    // storageState: 'playwright/.auth/user.json',
  },
  projects: [
    {
      name: 'demo',
    },
  ],
  outputDir: 'public/remotion/videos/', // ここに生成されたWebMが保存される
});
