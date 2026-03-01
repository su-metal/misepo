import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// このテストは録画専用です
test('PR動画用デモ録画', async ({ page, context }) => {
  // モバイルビューポートに固定 (iPhone 12/13/14 等の標準サイズ)
  await page.setViewportSize({ width: 390, height: 844 });

  // 認証およびクレジットチェックをバイパスするためのクッキー設定
  // (API側で isDemoMode を判定して無制限プランを返すように修正済み)
  await context.addCookies([
    {
      name: 'demo-mode',
      value: 'true',
      domain: 'localhost',
      path: '/',
    }
  ]);

  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`Browser console error: ${msg.text()}`);
  });

  // --- APIのモック (ネットワークリソース枯渇 ERR_INSUFFICIENT_RESOURCES 対策) ---
  
  await page.route('**/api/me/plan*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        plan: 'pro',
        status: 'active',
        canUseApp: true,
        isPro: true,
        limit: 1000,
        usage: 0,
        usage_period: 'monthly'
      })
    });
  });

  await page.route('**/api/me/store-profile*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        profile: {
          name: 'MisePo Cafe',
          industry: '飲食・カフェ',
          description: '新作スイーツが自慢のカフェです。',
          instagramFooter: '\n\n#MisePo #Cafe #スイーツ'
        }
      })
    });
  });

  await page.route('**/api/me/history*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, history: [] }) });
  });

  await page.route('**/api/me/presets*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, presets: [] }) });
  });

  await page.route('**/api/me/learning*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, items: [] }) });
  });

  // 生成処理は安定した結果をスピーディ（1.5秒）に返すようにモック化
  await page.route('**/api/generate', async (route) => {
    console.log('Intercepted /api/generate');
    // 人間らしいローディング時間を演出
    await new Promise(r => setTimeout(r, 1500));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        run_id: 'demo-run-123',
        results: [
          {
            platform: 'Instagram',
            posts: [
              "🌰 新作・栗パフェ明日からSTART 🌰\n\n秋の味覚を詰め込んだ、贅沢な新作パフェが完成しました！\n明日から販売開始です✨\n\nゴロゴロと入った渋皮栗と、滑らかなマロンクリームが相性抜群。\n期間限定なので、ぜひお早めにご賞味くださいね。\n\n皆様のご来店をお待ちしております🍂\n\n#栗パフェ #新作スイーツ #秋の味覚 #カフェ巡り #限定メニュー #MisePo"
            ]
          }
        ]
      })
    });
  });

  // --- 操作開始 ---

  // 1. ページへ遷移
  console.log('Navigating to /generate...');
  await page.goto('http://localhost:3000/generate');
  await page.waitForTimeout(2000); // 初期ロードを待つ

  // 2. プラットフォーム選択 (モバイル表示のBentoGrid内で「Instagram」を選択)
  console.log('Selecting Instagram...');
  const instagramBtn = page.locator('text=Instagram').filter({ visible: true }).first();
  await instagramBtn.waitFor({ state: 'visible', timeout: 15000 });
  await instagramBtn.click({ force: true });
  await page.waitForTimeout(1000); // 遷移アニメーション待ち
  
  // 3. 「次へ」または「New Post」ボタンをクリック（モバイル用に調整）
  // モバイルではドロワーが開くか、直接次へ進む
  const nextBtn = page.locator('button[aria-label="New Post"], button:has-text("次へ")').first();
  if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(1000);
  }

  // 4. メモを入力 ("新作の栗パフェ、明日から開始。")
  console.log('Typing memo...');
  const textArea = page.locator('textarea').first();
  // 人間らしく1文字ずつ入力
  await textArea.pressSequentially('新作の栗パフェ、明日から開始。', { delay: 80 }); 
  await page.waitForTimeout(1000);

  // 5. 確認画面へ
  console.log('Moving to Confirm...');
  const confirmBtn = page.getByRole('button', { name: /確認画面へ/i });
  await confirmBtn.click();
  await page.waitForTimeout(1000);

  // 6. 投稿文を生成
  console.log('Generating...');
  const generateBtn = page.getByRole('button', { name: /投稿文を生成/i });
  await generateBtn.waitFor({ state: 'visible' });
  await generateBtn.click({ force: true });
  
  // デバッグ用: 失敗時の画面確認
  await page.waitForTimeout(2000); // UIの更新を少し待つ
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log("--- Body Text ---");
  console.log(bodyText.substring(0, 500) + '...');
  await page.screenshot({ path: 'public/remotion/videos/debug-before-wait.png' });

  // 生成完了を待つ (栗パフェという文字が表示されるまで)
  await page.waitForFunction(() => {
    const textareas = Array.from(document.querySelectorAll('textarea'));
    return textareas.some(ta => ta.value.includes('新作・栗パフェ'));
  }, { timeout: 15000 });
  await page.waitForTimeout(1500); // 生成された喜びの余韻

  // 7. 結果の表示確認（ゆっくりスクロールして全体を見せる）
  console.log('Scrolling result...');
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(1000);
  await page.mouse.wheel(0, 300);
  
  // タイムラインを少し長めにキープ (動画編集の余白用)
  console.log('Final padding wait started...');
  await page.waitForTimeout(15000); 

  // 終了と保存
  await page.context().close();
  
  // 録画されたビデオファイルを探す
  const video = await page.video();
  if (video) {
    const videoPath = await video.path();
    const destPath = path.join(process.cwd(), 'public/remotion/videos/misepo-demo.webm');
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    // すでに存在する場合は削除
    if (fs.existsSync(destPath)) {
        fs.unlinkSync(destPath);
    }
    fs.copyFileSync(videoPath, destPath);
    console.log(`Video saved to: ${destPath}`);
  }
});
