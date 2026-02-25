import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'MisePo（ミセポ） — 美容院・飲食店向けSNS投稿＆口コミ返信AI';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1823ff 0%, #3b3ee8 50%, #1823ff 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 背景装飾: ドット */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* 背景装飾: グロー */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '200px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
          }}
        />

        {/* バッジ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '100px',
            padding: '10px 24px',
            marginBottom: '36px',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', fontWeight: '700', letterSpacing: '0.1em' }}>
            美容院・飲食店向けSNS運用AI
          </span>
        </div>

        {/* メインタイトル */}
        <div
          style={{
            color: 'white',
            fontSize: '68px',
            fontWeight: '900',
            lineHeight: 1.1,
            marginBottom: '32px',
            letterSpacing: '-0.03em',
          }}
        >
          想いを、一瞬で言葉に。
        </div>

        {/* サブタイトル */}
        <div
          style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: '28px',
            fontWeight: '600',
            lineHeight: 1.5,
            maxWidth: '700px',
            marginBottom: '48px',
          }}
        >
          Google口コミ返信・インスタ投稿を<br />メモ一行から10秒で自動生成
        </div>

        {/* フッター */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              background: 'white',
              borderRadius: '100px',
              padding: '14px 36px',
              color: '#1823ff',
              fontSize: '22px',
              fontWeight: '900',
            }}
          >
            7日間無料で試す
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '20px', fontWeight: '700' }}>
            misepo.jp
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
