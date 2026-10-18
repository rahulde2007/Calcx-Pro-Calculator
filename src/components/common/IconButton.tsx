import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly ariaLabel: string;
  readonly children: React.ReactNode;
  readonly variant?: 'default' | 'ghost' | 'active' | undefined;
  readonly size?: 'sm' | 'md' | 'lg' | undefined;
}

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-3.5 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
} as const;

const VARIANT_CLASSES = {
  default:
    'neumorphic-btn text-[var(--history-color)] hover:text-[var(--text-color)] border border-white/5 shadow-sm',
  ghost:
    'bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-[var(--history-color)] hover:text-[var(--text-color)]',
  active:
    'neumorphic-btn bg-[var(--op-right-color)] text-white shadow-sm font-semibold',
} as const;

/**
 * Reusable icon button component adhering to neumorphic design tokens.
 * Memoized for high performance and minimum re-renders.
 */
export const IconButton: React.FC<IconButtonProps> = React.memo(({
  ariaLabel,
  children,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  ...rest
}) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center min-w-[38px] min-h-[38px] rounded-full font-medium
        select-none transition-all duration-150 ease-out font-poppins
        active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)]
        disabled:opacity-40 disabled:cursor-not-allowed
        motion-reduce:transition-none motion-reduce:active:scale-100
        ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
});

IconButton.displayName = 'IconButton';
