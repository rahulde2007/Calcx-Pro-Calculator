import React, { useState, useCallback } from 'react';
import type { CalculationHistoryItem } from '../../types/calculator';
import { HistoryItem } from './HistoryItem';
import { Modal } from '../common/Modal';
import { exportHistoryAsCSV } from '../../utils/exportHistory';

export interface HistoryPanelProps {
  readonly items: readonly CalculationHistoryItem[];
  readonly onSelectItem?: ((item: CalculationHistoryItem) => void) | undefined;
  readonly onClearHistory?: (() => void) | undefined;
  readonly onDeleteItem?: ((id: string) => void) | undefined;
  readonly onExportHistory?: (() => void) | undefined;
  readonly onClose?: (() => void) | undefined;
  readonly className?: string | undefined;
}

/**
 * History panel drawer component adhering to reference neumorphic tokens.
 * Supports individual item deletion, copy actions, RFC 4180 CSV export,
 * and a modal confirmation for clearing all history.
 */
export const HistoryPanel: React.FC<HistoryPanelProps> = React.memo(({
  items,
  onSelectItem,
  onClearHistory,
  onDeleteItem,
  onExportHistory,
  onClose,
  className,
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  const handleExport = useCallback(() => {
    if (items.length === 0) return;
    if (onExportHistory) {
      onExportHistory();
    } else {
      exportHistoryAsCSV(items);
    }
  }, [items, onExportHistory]);

  const handleConfirmClear = useCallback(() => {
    onClearHistory?.();
    setIsConfirmModalOpen(false);
  }, [onClearHistory]);

  return (
    <>
      <aside
        aria-label="Calculation History"
        className={`
          w-full bg-[var(--bg-color)] flex flex-col h-full
          ${className ?? 'rounded-[35px] border border-white/5 p-4 sm:p-5 shadow-calc-shell'}
        `}
      >
        {/* Header with Title, Count Badge, Export, Clear, and Close Actions */}
        <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5 mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="font-orbitron text-xs font-bold uppercase tracking-wider text-[var(--history-color)]">
              History
            </h3>
            {items.length > 0 && (
              <span className="text-[10px] font-orbitron px-2 py-0.5 rounded-full neumorphic-inset text-[var(--op-right-color)] font-bold">
                {items.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExport}
              disabled={items.length === 0}
              aria-label="Export history as CSV"
              title={items.length === 0 ? 'No history to export' : 'Export history as CSV'}
              className="
                neumorphic-btn min-h-[34px] px-3 py-1 text-xs rounded-full font-orbitron font-medium transition-all flex items-center justify-center
                text-[var(--history-color)] hover:text-[var(--text-color)]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)]
                disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none
              "
            >
              Export
            </button>

            {/* Clear All Button */}
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(true)}
                aria-label="Clear all calculation history"
                className="
                  neumorphic-btn min-h-[34px] px-3 py-1 text-xs rounded-full font-orbitron font-semibold transition-all flex items-center justify-center
                  text-[var(--ac-color)]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ac-color)]
                "
              >
                Clear
              </button>
            )}

            {/* Close Button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close history panel"
                title="Close history panel"
                className="
                  neumorphic-btn min-h-[34px] min-w-[34px] p-1.5 text-xs rounded-full font-medium transition-all flex items-center justify-center
                  text-[var(--history-color)] hover:text-[var(--text-color)]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)]
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Calculation List with touch optimization */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin smooth-scroll">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-56 text-center p-4 select-none">
              <div className="w-12 h-12 rounded-full neumorphic-inset flex items-center justify-center text-[var(--history-color)] mb-2.5 text-lg">
                ⏱
              </div>
              <span className="text-xs font-orbitron font-semibold text-[var(--history-color)]">No calculations yet</span>
              <span className="text-[11px] font-poppins text-[var(--history-color)] opacity-70 mt-1 max-w-[200px] leading-relaxed">
                Evaluations performed in standard or scientific mode will appear here.
              </span>
            </div>
          ) : (
            items.map((item) => (
              <HistoryItem
                key={item.id}
                item={item}
                onSelect={onSelectItem}
                onDelete={onDeleteItem}
              />
            ))
          )}
        </div>
      </aside>

      {/* Clear All Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Clear Calculation History"
      >
        <div className="space-y-4">
          <p className="text-xs font-poppins text-[var(--history-color)] leading-relaxed">
            Are you sure you want to clear all {items.length} calculation record{items.length === 1 ? '' : 's'}?
            This will permanently remove saved history. Your current calculator display, expression, and memory will not be affected.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              autoFocus
              onClick={() => setIsConfirmModalOpen(false)}
              className="
                neumorphic-btn min-h-[40px] px-5 py-2 text-xs font-orbitron font-medium rounded-full
                text-[var(--text-color)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)]
              "
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmClear}
              className="
                neumorphic-btn min-h-[40px] px-5 py-2 text-xs font-orbitron font-bold rounded-full bg-[var(--ac-color)] text-white
                transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ac-color)]
              "
            >
              Clear All History
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
});

HistoryPanel.displayName = 'HistoryPanel';
