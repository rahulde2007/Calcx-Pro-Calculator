import React from 'react';
import { CalculatorButton } from './CalculatorButton';

export interface MemoryControlsProps {
  readonly hasMemory: boolean;
  readonly onMemoryClear: () => void;
  readonly onMemoryRecall: () => void;
  readonly onMemoryAdd: () => void;
  readonly onMemorySubtract: () => void;
  readonly className?: string | undefined;
  readonly isCompact?: boolean | undefined;
}

/**
 * Compact neumorphic memory control bar (MC, MR, M+, M−).
 * Integrates cleanly above keypads in both Standard and Scientific modes.
 */
export const MemoryControls: React.FC<MemoryControlsProps> = React.memo(({
  hasMemory,
  onMemoryClear,
  onMemoryRecall,
  onMemoryAdd,
  onMemorySubtract,
  className = '',
  isCompact = false,
}) => {
  const btnHeightClass = isCompact ? 'h-7 sm:h-8 text-[11px]' : 'h-8 sm:h-9 text-xs sm:text-sm';
  const gapClass = isCompact ? 'gap-1.5 xs:gap-2' : 'gap-2.5 xs:gap-3 sm:gap-3.5';

  return (
    <div
      role="group"
      aria-label="Memory Controls"
      className={`grid grid-cols-4 ${gapClass} w-full ${className}`}
      style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
    >
      <CalculatorButton
        id="btn-mc"
        label="MC"
        ariaLabel="Memory Clear"
        variant="secondary"
        className={`${btnHeightClass} font-orbitron font-semibold tracking-wider rounded-full ${
          hasMemory ? 'text-[var(--ac-color)]' : 'text-[var(--history-color)] opacity-60'
        }`}
        onClick={onMemoryClear}
      />
      <CalculatorButton
        id="btn-mr"
        label="MR"
        ariaLabel="Memory Recall"
        variant="secondary"
        className={`${btnHeightClass} font-orbitron font-bold tracking-wider rounded-full ${
          hasMemory ? 'text-[var(--op-right-color)]' : 'text-[var(--history-color)] opacity-60'
        }`}
        onClick={onMemoryRecall}
      />
      <CalculatorButton
        id="btn-m-plus"
        label="M+"
        ariaLabel="Memory Add"
        variant="secondary"
        className={`${btnHeightClass} font-orbitron font-semibold tracking-wider rounded-full text-[var(--text-color)] hover:text-[var(--op-right-color)]`}
        onClick={onMemoryAdd}
      />
      <CalculatorButton
        id="btn-m-minus"
        label="M−"
        ariaLabel="Memory Subtract"
        variant="secondary"
        className={`${btnHeightClass} font-orbitron font-semibold tracking-wider rounded-full text-[var(--text-color)] hover:text-[var(--op-right-color)]`}
        onClick={onMemorySubtract}
      />
    </div>
  );
});

MemoryControls.displayName = 'MemoryControls';
