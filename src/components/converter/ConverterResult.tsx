import React from 'react';
import type { ConversionResult, UnitDefinition } from '../../converter/types';

export interface ConverterResultProps {
  readonly result: ConversionResult | null;
  readonly toUnit: UnitDefinition | undefined;
  readonly inputValue: string;
}

export const ConverterResult: React.FC<ConverterResultProps> = ({
  result,
  toUnit,
  inputValue,
}) => {
  if (!inputValue.trim()) {
    return (
      <div className="flex flex-col gap-0.5 p-3 rounded-2xl neumorphic-inset border border-white/5">
        <span className="font-orbitron text-[10px] font-bold uppercase tracking-wider text-[var(--history-color)]">Result</span>
        <div className="text-xl xs:text-2xl font-orbitron text-[var(--history-color)] opacity-50 select-none">—</div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  if (!result.success) {
    return (
      <div className="flex flex-col gap-0.5 p-3 rounded-2xl neumorphic-inset border border-[var(--ac-color)]/30 text-[var(--ac-color)]">
        <span className="font-orbitron text-[10px] font-bold uppercase tracking-wider">Result</span>
        <div className="text-xs xs:text-sm font-poppins font-medium">{result.error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-3 rounded-2xl neumorphic-inset border border-white/5">
      <div className="flex items-center justify-between">
        <span className="font-orbitron text-[10px] font-bold uppercase tracking-wider text-[var(--history-color)]">Result</span>
        {toUnit && (
          <span className="text-[11px] font-orbitron font-medium text-[var(--op-right-color)] truncate max-w-[180px]">
            {toUnit.label} ({toUnit.symbol})
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2 overflow-x-auto py-0.5 scrollbar-none">
        <span className="text-xl xs:text-2xl font-orbitron font-bold text-[var(--text-color)] tracking-tight">
          {result.formatted}
        </span>
        {toUnit && (
          <span className="text-xs font-orbitron font-medium text-[var(--history-color)] shrink-0">
            {toUnit.symbol}
          </span>
        )}
      </div>

      {result.note && (
        <div className="text-[10px] font-poppins text-[var(--history-color)] pt-1 border-t border-black/5 dark:border-white/5 leading-tight">
          ℹ {result.note}
        </div>
      )}
    </div>
  );
};
