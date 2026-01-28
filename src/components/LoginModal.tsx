
import React, { useEffect } from 'react';
import { CloseIcon } from './Icons';
import LoginPanel from './LoginPanel';
import { useScrollLock } from '../hooks/useScrollLock';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginGoogle: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginGoogle }) => {
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative transform transition-all scale-100"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 transition-colors z-10"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <LoginPanel
          title="ログイン / 新規登録"
          description={"アカウントを作成して、\nお店専用のAI広報担当を育てましょう。"}
          onLoginGoogle={onLoginGoogle}
          helperText="利用規約 と プライバシーポリシー に同意した上でログインしてください。"
        />
      </div>
    </div>
  );
};

export default LoginModal;
