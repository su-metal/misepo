
import React, { useState, useLayoutEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

interface GuestTourProps {
  isOpen: boolean;
  onClose: () => void;
  inputRef: React.RefObject<HTMLDivElement>;
  buttonRef: React.RefObject<HTMLButtonElement>;
  instagramRef: React.RefObject<HTMLButtonElement>;
  purposeRef?: React.RefObject<HTMLDivElement>;
  styleRef?: React.RefObject<HTMLDivElement>;
  onRunGenerator?: () => void;
}

const GuestTour: React.FC<GuestTourProps> = ({ isOpen, onClose, inputRef, buttonRef, instagramRef, purposeRef, styleRef, onRunGenerator }) => {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // ハイライト枠の余白サイズ（px）
  const PADDING = 10;

  // ステップ定義をメモ化して無限レンダリング（Error #185）を防止
  // isOpenを依存配列に追加し、ツアー開始時にref.currentが確実に存在するように再計算させる
  const steps = useMemo(() => {
    const rawSteps = [
      {
        target: instagramRef,
        text: "投稿するSNSを選びます",
        position: 'bottom',
      },
      {
        target: purposeRef,
        text: "投稿の目的を選びます",
        position: 'right',
        condition: !!(purposeRef && purposeRef.current)
      },
      {
        target: styleRef,
        text: "スタイルを決めます",
        subText: "トーンや長さは、登録後に自由に調整できます",
        position: 'right',
        condition: !!(styleRef && styleRef.current)
      },
      {
        target: inputRef,
        text: "投稿したい内容を入力します",
        position: 'top',
      },
      {
        target: buttonRef,
        text: "あとは、ボタンをタップするだけ",
        position: 'top',
      }
    ];

    // Refが存在しない（条件を満たさない）ステップを除外
    return rawSteps.filter(s => (s as any).condition === undefined || (s as any).condition);
  }, [instagramRef, purposeRef, styleRef, inputRef, buttonRef, isOpen]);

  // ターゲットの位置情報を取得して更新
  const updatePosition = () => {
    if (!steps[step] || !steps[step].target || !steps[step].target.current) return;
    
    const currentTarget = steps[step].target.current;
    if (currentTarget) {
      const rect = currentTarget.getBoundingClientRect();
      setTargetRect(rect);
    }
  };

  useLayoutEffect(() => {
    if (isOpen && steps[step]) {
      const currentTarget = steps[step].target.current;
      
      // スクロール連動：ステップ変更時にターゲットを画面中央へスムーズスクロール
      if (currentTarget) {
        currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      updatePosition();
      // スクロールやリサイズに対応
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, step, steps]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // 最終ステップの場合、生成処理を実行してから閉じる
      if (onRunGenerator) {
        onRunGenerator();
      }
      finishTour();
    }
  };

  const finishTour = () => {
    onClose();
  };

  if (!isOpen || !targetRect || !steps[step]) return null;

  // 表示位置の計算
  const currentStep = steps[step];
  const currentPos = (currentStep as any).position;
  // 上に表示する場合、メッセージテキストの分を含めて少し上にマージンを取る (-130px)
  let tooltipTop = targetRect.top - 130; 
  let tooltipLeft = targetRect.left + (targetRect.width / 2);
  let arrowClass = "absolute -bottom-2 left-1/2 -transtone-x-1/2 w-4 h-4 bg-white rotate-45"; // デフォルトは矢印が下

  if (currentPos === 'bottom') {
     // 余白(PADDING)の分だけさらに下にずらす
     tooltipTop = targetRect.bottom + 20 + PADDING; 
     arrowClass = "absolute -top-2 left-1/2 -transtone-x-1/2 w-4 h-4 bg-white rotate-45"; 
  } else if (currentPos === 'right') {
     // 右側に表示（PC画面など）
     if (window.innerWidth > 768) {
        tooltipTop = targetRect.top + (targetRect.height / 2) - 40;
        // 余白(PADDING)の分だけさらに右にずらす
        tooltipLeft = targetRect.right + 20 + PADDING; 
        arrowClass = "absolute top-1/2 -transtone-y-1/2 -left-2 w-4 h-4 bg-white rotate-45";
     } else {
        // モバイルなら上下にフォールバック（ここではTop扱い）
        tooltipTop = targetRect.top - 130;
     }
  }

  const isLastStep = step === steps.length - 1;

  // Render logic for tooltip style
  const tooltipStyle: React.CSSProperties = {
     top: tooltipTop,
     left: tooltipLeft,
     transform: currentPos === 'right' && window.innerWidth > 768 ? 'translateY(0)' : 'translateX(-50%)',
     width: 'max-content',
     maxWidth: '90vw'
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* 
        スポットライト効果
        PADDINGの分だけ枠を広げる
      */}
      <div 
        className="absolute transition-all duration-500 ease-in-out pointer-events-none"
        style={{
          top: targetRect.top - PADDING,
          left: targetRect.left - PADDING,
          width: targetRect.width + (PADDING * 2),
          height: targetRect.height + (PADDING * 2),
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)', // 暗幕
          borderRadius: step === steps.length - 1 ? '1.25rem' : '1rem', // 少し角丸を大きく
        }}
      />
      
      {/* クリック妨害用の透明レイヤー (Nextへ誘導) */}
      <div 
        className="absolute inset-0 z-10" 
        onClick={handleNext} 
        title="次へ"
      />

      {/* ツールチップ */}
      <div 
        className="absolute z-20 flex flex-col items-center transition-all duration-500 ease-in-out pointer-events-none"
        style={tooltipStyle}
      >
        <div className="bg-white text-stone-800 px-6 py-4 rounded-2xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center gap-2">
          {/* 吹き出しの三角 */}
          <div className={arrowClass}></div>
          
          <p className="font-bold text-base md:text-lg text-center leading-snug">
            {(currentStep as any).text}
          </p>
          
          {(currentStep as any).subText && (
            <p className="text-xs text-stone-400 font-medium text-center">
              {(currentStep as any).subText}
            </p>
          )}
          
          <div className="flex items-center gap-1 mt-1">
             {steps.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${step === i ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
             ))}
          </div>
        </div>

        {/* 誘導メッセージ */}
        <p className={`text-white text-xs font-bold mt-3 animate-pulse drop-shadow-md pointer-events-none ${isLastStep ? 'text-sm text-yellow-300 scale-110' : ''}`}>
           {isLastStep ? '👇 ボタンをタップして生成！' : '画面をタップして進む'}
        </p>
      </div>

      {/* スキップボタン */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          finishTour();
        }}
        className="absolute top-6 right-6 z-30 text-white/70 hover:text-white text-xs font-bold bg-black/20 hover:bg-black/40 px-3 py-1.5 rounded-full transition-colors"
      >
        スキップ
      </button>
    </div>,
    document.body
  );
};

export default GuestTour;
