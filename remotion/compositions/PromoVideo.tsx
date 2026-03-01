import React from 'react';
import { AbsoluteFill, Sequence, Video, staticFile, useVideoConfig, spring, useCurrentFrame, interpolate } from 'remotion';

// デモ動画のタイトルやテキストのフック
const TitleHook: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = interpolate(frame, [0, 15, 75, 90], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const translateY = interpolate(frame, [0, 15], [50, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#e8e4ff', opacity }}>
            <h1 style={{
                fontSize: 80,
                fontWeight: 'bold',
                color: '#111',
                transform: `translateY(${translateY}px)`,
                textAlign: 'center',
                lineHeight: 1.5
            }}>
                メモ書きから、<br />
                <span style={{ color: '#1823ff' }}>プロの SNS 投稿を。</span>
            </h1>
        </AbsoluteFill>
    );
};

// Playwrightで録画したブラウザ操作動画を埋め込むコンポーネント
const DemoVideoEmbed: React.FC = () => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
    const [videoError, setVideoError] = React.useState(false);

    const { width, height } = useVideoConfig();

    return (
        <AbsoluteFill style={{ opacity, backgroundColor: '#f5f0ff', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
                width: width * 0.8,
                height: height * 0.8,
                backgroundColor: '#fff',
                borderRadius: 24,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                {/* ブラウザのモックバー */}
                <div style={{ height: 48, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
                    <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#ff5f56', marginRight: 8 }} />
                    <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#ffbd2e', marginRight: 8 }} />
                    <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#27c93f' }} />
                </div>
                {/* 録画動画を再生する領域 */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', textAlign: 'center' }}>
                    {!videoError ? (
                        <Video
                            src={staticFile('remotion/videos/misepo-demo.webm')}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            muted={true}
                            onError={() => setVideoError(true)}
                            // ビデオの読み込み待ち時間を60秒に延長
                            delayRenderTimeoutInMilliseconds={60000}
                        />
                    ) : (
                        <div style={{ color: '#fff', fontSize: 32, lineHeight: 1.5 }}>
                            動画ファイルが見つかりません。<br />
                            <span style={{ fontSize: 24, color: '#aaa' }}>
                                先に <code>npm run demo:record</code> を実行してください。
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* 上からの説明ポップアップアニメーション */}
            <div style={{
                position: 'absolute',
                top: 80,
                backgroundColor: '#1823ff',
                color: 'white',
                padding: '20px 40px',
                borderRadius: 40,
                fontSize: 48,
                fontWeight: 'bold',
                transform: `scale(${spring({ fps: 30, frame: Math.max(0, frame - 30), config: { damping: 12 } })})`
            }}>
                短いメモを入力するだけ！
            </div>
        </AbsoluteFill>
    );
};

// 最後に表示するCTA (Call to Action)
const CTASection: React.FC = () => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
    const scale = spring({ fps: 30, frame: frame - 15, config: { damping: 12 } });

    return (
        <AbsoluteFill style={{ backgroundColor: '#1823ff', color: 'white', justifyContent: 'center', alignItems: 'center', opacity }}>
            <h2 style={{ fontSize: 100, fontWeight: 'bold', marginBottom: 40, transform: `scale(${scale})` }}>
                MisePo で、SNS 運用をスマートに。
            </h2>
            <p style={{ fontSize: 50, opacity: interpolate(frame, [30, 45], [0, 1]) }}>
                MisePo.app
            </p>
        </AbsoluteFill>
    );
};

export const PromoVideo: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#fff' }}>
            {/* Sequence 1: タイトルのフック (3秒 = 90フレーム) */}
            <Sequence from={0} durationInFrames={90}>
                <TitleHook />
            </Sequence>

            {/* Sequence 2: デモ動画の操作説明 (おおよそ30秒 = 900フレーム) */}
            <Sequence from={90} durationInFrames={900}>
                <DemoVideoEmbed />
            </Sequence>

            {/* Sequence 3: CTA (約7秒 = 210フレーム) */}
            <Sequence from={990} durationInFrames={210}>
                <CTASection />
            </Sequence>
        </AbsoluteFill>
    );
};
