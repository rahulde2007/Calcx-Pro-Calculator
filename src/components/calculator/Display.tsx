import React from 'react';

export interface DisplayProps {
  readonly expression?: string | undefined;
  readonly value: string;
  readonly isError?: boolean | undefined;
  readonly errorMessage?: string | null | undefined;
  readonly modeBadge?: string | undefined;
  readonly hasMemory?: boolean | undefined;
  readonly memoryValue?: number | undefined;
  readonly isCompact?: boolean | undefined;
  /** Live evaluated result shown while user types — null hides it */
  readonly livePreview?: string | null | undefined;
}

// Dynamically scale typography based on number length to prevent overflow
function getDynamicFontSize(str: string, compact: boolean): string {
  const len = str.length;
  if (compact) {
    if (len > 18) return 'text-lg sm:text-xl';
    if (len > 14) return 'text-xl sm:text-2xl';
    if (len > 10) return 'text-2xl sm:text-3xl';
    if (len > 7) return 'text-3xl sm:text-4xl';
    return 'text-3xl xs:text-4xl sm:text-[2.5rem]';
  }
  if (len > 18) return 'text-xl sm:text-2xl';
  if (len > 14) return 'text-2xl sm:text-3xl';
  if (len > 10) return 'text-3xl sm:text-4xl';
  if (len > 7) return 'text-4xl sm:text-[2.75rem]';
  return 'text-4xl sm:text-5xl';
}

/**
 * Frosted Glass Display with digital reflection matching reference design.
 * Features glassmorphism backdrop-blur, subtle inner glow, diagonal sheen beam animation,
 * Orbitron typography, DEG/RAD badges, memory indicator, and live preview.
 */
export const Display: React.FC<DisplayProps> = React.memo(({
  expression = '',
  value,
  isError = false,
  errorMessage = null,
  modeBadge = 'DEG',
  hasMemory = false,
  memoryValue,
  isCompact = false,
  livePreview = null,
}) => {
  const isMemoryActive = Boolean(hasMemory || (memoryValue !== undefined && memoryValue !== 0));

  const displayText = isError ? (errorMessage ?? 'Error') : value;
  const fontSizeClass = isError
    ? (isCompact ? 'text-xl sm:text-2xl font-medium text-[var(--ac-color)]' : 'text-2xl sm:text-3xl font-medium text-[var(--ac-color)]')
    : `${getDynamicFontSize(displayText, isCompact)} font-bold text-[var(--text-color)]`;

  return (
    <div
      role="region"
      aria-label="Calculator Display"
      className={`
        neumorphic-display rounded-[20px] flex flex-col justify-between shrink-0
        ${isCompact ? 'p-2.5 xs:p-3 sm:p-3.5 min-h-[96px]' : 'p-3.5 sm:p-4 min-h-[110px]'}
      `}
    >
      {/* Digital Glass Reflection Sheen */}
      <div className="glass-reflection" aria-hidden="true" />

      {/* Top Status & Expression History Row */}
      <div className={`relative z-10 flex items-center justify-between gap-2 select-none ${isCompact ? 'mb-1' : 'mb-2'}`}>
        {/* Indicators on the left */}
        <div className="flex items-center gap-1.5">
          {modeBadge && (
            <span
              className="text-[10px] font-orbitron font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-color)]/60 border border-[var(--glass-border)] text-[var(--history-color)] uppercase tracking-wider shadow-sm"
              aria-label={`Angle mode: ${modeBadge}`}
            >
              {modeBadge}
            </span>
          )}
          {isMemoryActive && (
            <span
              className="text-[10px] font-orbitron font-bold px-2 py-0.5 rounded-full bg-[var(--op-right-color)]/20 border border-[var(--op-right-color)]/40 text-[var(--op-right-color)] tracking-wider shadow-sm"
              aria-label={memoryValue !== undefined ? `Memory stored: ${memoryValue}` : 'Memory stored'}
            >
              M
            </span>
          )}
        </div>

        {/* Expression buffer */}
        <div
          id="history"
          className="flex-1 text-right font-orbitron text-xs sm:text-[14px] text-[var(--history-color)] tracking-[2px] font-medium overflow-x-auto whitespace-nowrap scrollbar-none pl-2 transition-colors duration-500"
          aria-label={`Current expression: ${expression || 'none'}`}
        >
          {expression || '\u00A0'}
        </div>
      </div>

      {/* Main Result Value Display */}
      <div
        id="value"
        className="relative z-10 flex flex-col items-end w-full overflow-hidden"
        aria-live="polite"
        aria-atomic="true"
      >
        <span
          className={`
            font-orbitron tracking-[1px] text-right
            select-all overflow-x-auto whitespace-nowrap scrollbar-none
            dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.18)]
            transition-colors duration-500
            ${fontSizeClass}
          `}
        >
          {displayText}
        </span>

        {/* Live preview: shown while typing a valid evaluable expression */}
        {livePreview && !isError && (
          <span
            className={`
              font-orbitron tracking-wide text-right text-[var(--op-right-color)]
              overflow-x-auto whitespace-nowrap scrollbar-none opacity-90
              ${isCompact ? 'text-sm xs:text-base' : 'text-base sm:text-lg'}
            `}
            aria-label={`Live result: ${livePreview}`}
          >
            = {livePreview}
          </span>
        )}
      </div>
    </div>
  );
});

Display.displayName = 'Display';
