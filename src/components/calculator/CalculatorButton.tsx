import React from 'react';
import type { ButtonVariant } from '../../types/calculator';

export interface CalculatorButtonProps {
  readonly id?: string | undefined;
  readonly label: string | React.ReactNode;
  readonly ariaLabel?: string | undefined;
  readonly variant?: ButtonVariant | undefined;
  readonly spanCols?: number | undefined;
  readonly disabled?: boolean | undefined;
  readonly subLabel?: string | undefined;
  readonly isHighlighted?: boolean | undefined;
  readonly onClick?: (() => void) | undefined;
  readonly className?: string | undefined;
}

// Map variant to reference neumorphic styles
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  number: 'text-[var(--text-color)] font-medium',
  digit: 'text-[var(--text-color)] font-medium',
  operator: 'text-[var(--op-right-color)] font-normal text-xl sm:text-2xl',
  function: 'text-[var(--op-top-color)] font-semibold text-sm sm:text-base',
  action: 'text-[var(--op-top-color)] font-semibold text-sm sm:text-base',
  danger: 'text-[var(--ac-color)] font-bold text-base sm:text-lg',
  equals: 'neumorphic-btn-equals font-bold text-xl sm:text-2xl',
  special: 'text-[var(--text-color)] font-medium text-sm sm:text-base',
  secondary: 'text-[var(--op-top-color)] font-medium text-xs sm:text-sm',
};

const SPAN_CLASSES: Record<number, string> = {
  1: 'col-span-1 aspect-square',
  2: 'col-span-2 aspect-auto rounded-full px-5 justify-start',
  3: 'col-span-3 aspect-auto rounded-full px-5',
  4: 'col-span-4 aspect-auto rounded-full px-6',
};

/**
 * Neumorphic Calculator Button primitive matching reference design.
 * Features soft raised and inset shadows, active transform scaling,
 * variant colors (numbers, right-ops, top-ops, AC danger, equals),
 * Orbitron styling for dots, and WCAG AA accessibility focus rings.
 */
export const CalculatorButton: React.FC<CalculatorButtonProps> = React.memo(({
  id,
  label,
  ariaLabel,
  variant = 'number',
  spanCols = 1,
  disabled = false,
  subLabel,
  isHighlighted = false,
  onClick,
  className = '',
}) => {
  const computedAriaLabel = ariaLabel ?? (typeof label === 'string' ? label : undefined);
  const isEquals = variant === 'equals';
  const isDot = id === 'btn-decimal' || label === '.';

  // Sizing: default aspect-square or stretch for spanned rows
  const hasCustomHeight = Boolean(className && (className.includes('h-') || className.includes('min-h-')));
  const defaultHeightClass = hasCustomHeight ? '' : (spanCols > 1 ? 'h-12 xs:h-13 sm:h-14' : 'w-full');

  const hasCustomText = Boolean(className && className.includes('text-'));
  const defaultTextClass = hasCustomText ? '' : (isDot ? 'font-orbitron font-bold text-2xl pb-1' : 'text-base sm:text-lg');

  return (
    <button
      id={id}
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={computedAriaLabel}
      className={`
        neumorphic-btn
        ${isEquals ? 'neumorphic-btn-equals' : ''}
        group relative flex items-center justify-center
        ${defaultHeightClass}
        ${SPAN_CLASSES[spanCols] ?? 'col-span-1'}
        ${VARIANT_STYLES[variant]}
        ${defaultTextClass}
        select-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-color)]
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        motion-reduce:transition-none motion-reduce:active:transform-none
        ${isHighlighted ? 'ring-2 ring-[var(--op-right-color)] ring-offset-2 ring-offset-[var(--bg-color)]' : ''}
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center justify-center gap-1">
        {label}
      </span>

      {/* Optional sub-label (e.g. keyboard shortcut or alternate operation) */}
      {subLabel && (
        <span className="absolute bottom-1 right-2 z-10 text-[9px] sm:text-[10px] font-mono text-[var(--history-color)] opacity-70 group-hover:opacity-100 transition-opacity">
          {subLabel}
        </span>
      )}
    </button>
  );
});

CalculatorButton.displayName = 'CalculatorButton';
