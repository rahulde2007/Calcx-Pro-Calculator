import React, { useState, useEffect, useRef } from 'react';
import type { CalculationHistoryItem } from '../../types/calculator';
import { copyToClipboard } from '../../utils/clipboard';

export interface HistoryItemProps {
  readonly item: CalculationHistoryItem;
  readonly onSelect?: ((item: CalculationHistoryItem) => void) | undefined;
  readonly onDelete?: ((id: string) => void) | undefined;
}

/**
 * Renders an individual calculation entry matching reference neumorphic styling.
 * Features quick reuse, copy result, copy expression, individual deletion,
 * accessible feedback, and WCAG AA minimum 44px touch targets.
 */
export const HistoryItem: React.FC<HistoryItemProps> = React.memo(({
  item,
  onSelect,
  onDelete,
}) => {
  const [copiedTarget, setCopiedTarget] = useState<'result' | 'expression' | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async (target: 'result' | 'expression', e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = target === 'result' ? item.result : item.expression;
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopiedTarget(target);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setCopiedTarget((current) => (current === target ? null : current));
        timeoutRef.current = null;
      }, 1500);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(item.id);
  };

  return (
    <div
      role="group"
      aria-label={`Calculation: ${item.expression} = ${item.result}`}
      className="
        group relative rounded-2xl neumorphic-inset p-3 transition-all duration-200
        flex flex-col gap-2 border border-white/5
      "
    >
      {/* Primary Clickable Area for Calculation Reuse */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect?.(item)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect?.(item);
          }
        }}
        aria-label={`Reuse calculation: ${item.expression} = ${item.result}`}
        className="
          w-full text-right cursor-pointer select-none rounded-xl p-1
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)]
        "
      >
        <div className="text-xs font-orbitron text-[var(--history-color)] truncate tracking-wider">
          {item.expression}
        </div>
        <div className="text-base font-bold font-orbitron text-[var(--text-color)] mt-0.5 tracking-wide truncate">
          = {item.result}
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5 text-xs">
        {/* Left Action: Reuse */}
        <button
          type="button"
          onClick={() => onSelect?.(item)}
          aria-label="Reuse calculation"
          title="Recall into calculator"
          className="
            min-h-[38px] min-w-[38px] px-2.5 py-1 rounded-full flex items-center justify-center gap-1
            text-[11px] font-orbitron font-medium text-[var(--history-color)] hover:text-[var(--op-right-color)]
            transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)]
          "
        >
          <span aria-hidden="true" className="text-sm">↺</span>
          <span className="hidden xs:inline">Reuse</span>
        </button>

        {/* Right Actions: Copy Result, Copy Expr, Delete */}
        <div className="flex items-center gap-1">
          {/* Copy Result */}
          <button
            type="button"
            onClick={(e) => handleCopy('result', e)}
            aria-label={copiedTarget === 'result' ? 'Result copied to clipboard' : 'Copy result'}
            title="Copy result"
            className={`
              min-h-[38px] px-2.5 py-1 rounded-full flex items-center justify-center gap-1
              text-[11px] font-orbitron transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)]
              ${
                copiedTarget === 'result'
                  ? 'text-emerald-400 font-bold bg-emerald-500/10'
                  : 'text-[var(--history-color)] hover:text-[var(--text-color)]'
              }
            `}
          >
            {copiedTarget === 'result' ? (
              <>
                <span aria-hidden="true">✓</span>
                <span className="text-[10px]">Copied</span>
              </>
            ) : (
              <>
                <span aria-hidden="true" className="text-xs">⎘</span>
                <span className="text-[10px] hidden xs:inline">Ans</span>
              </>
            )}
          </button>

          {/* Copy Expression */}
          <button
            type="button"
            onClick={(e) => handleCopy('expression', e)}
            aria-label={copiedTarget === 'expression' ? 'Expression copied to clipboard' : 'Copy expression'}
            title="Copy expression"
            className={`
              min-h-[38px] px-2.5 py-1 rounded-full flex items-center justify-center gap-1
              text-[11px] font-orbitron transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)]
              ${
                copiedTarget === 'expression'
                  ? 'text-emerald-400 font-bold bg-emerald-500/10'
                  : 'text-[var(--history-color)] hover:text-[var(--text-color)]'
              }
            `}
          >
            {copiedTarget === 'expression' ? (
              <>
                <span aria-hidden="true">✓</span>
                <span className="text-[10px]">Copied</span>
              </>
            ) : (
              <>
                <span aria-hidden="true" className="text-xs">⎘</span>
                <span className="text-[10px] hidden xs:inline">Expr</span>
              </>
            )}
          </button>

          {/* Delete Item */}
          <button
            type="button"
            onClick={handleDelete}
            aria-label="Delete history item"
            title="Delete item"
            className="
              min-h-[38px] min-w-[38px] p-2 rounded-full flex items-center justify-center
              text-[var(--history-color)] hover:text-[var(--ac-color)]
              transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ac-color)]
            "
          >
            <span aria-hidden="true" className="text-sm font-semibold">✕</span>
          </button>
        </div>
      </div>
    </div>
  );
});

HistoryItem.displayName = 'HistoryItem';
