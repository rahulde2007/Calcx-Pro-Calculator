import React, { useEffect } from 'react';

export interface ModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly children: React.ReactNode;
}

/**
 * Accessible Modal dialog component adhering to Neumorphic design tokens.
 */
export const Modal: React.FC<ModalProps> = React.memo(({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-[30px] bg-[var(--bg-color)] border border-white/10 p-6 shadow-calc-shell text-[var(--text-color)] transition-colors duration-500">
        <div className="flex items-center justify-between pb-3.5 border-b border-black/5 dark:border-white/5">
          <h2 id="modal-title" className="text-base font-orbitron font-bold text-[var(--text-color)] tracking-wide">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="neumorphic-btn rounded-full min-w-[36px] min-h-[36px] flex items-center justify-center p-1 text-sm text-[var(--history-color)] hover:text-[var(--text-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)]"
          >
            ✕
          </button>
        </div>
        <div className="pt-4 text-[var(--history-color)] text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';
