import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { PromoVideo } from './compositions/PromoVideo';

export const RemotionRoot: React.FC = () => {
    return (
        <React.Fragment>
            {/* 1920x1080 (30fps) で約30秒〜1分程度の動画を作成（今回は1200フレーム≒40秒） */}
            <Composition
                id="PromoVideo"
                component={PromoVideo}
                durationInFrames={1200}
                fps={30}
                width={1920}
                height={1080}
            />
        </React.Fragment>
    );
};

// Remotionにこのコンポーネントをプロジェクトのルートとして登録する
registerRoot(RemotionRoot);
