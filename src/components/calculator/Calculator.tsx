import React, { useCallback } from 'react';
import { Display } from './Display';
import { Keypad } from './Keypad';
import { ScientificKeypad } from './ScientificKeypad';
import { AngleUnitSelector } from './AngleUnitSelector';
import { MemoryControls } from './MemoryControls';
import { useCalculator, type UseCalculatorReturn } from '../../hooks/useCalculator';
import { useKeyboard } from '../../hooks/useKeyboard';

export interface CalculatorProps {
  readonly calculator?: UseCalculatorReturn | undefined;
  readonly onOpenConverter?: (() => void) | undefined;
  readonly isConverterOpen?: boolean | undefined;
  readonly keyboardEnabled?: boolean | undefined;
}

interface CalculatorViewProps {
  readonly calc: UseCalculatorReturn;
  readonly onOpenConverter?: (() => void) | undefined;
  readonly isConverterOpen?: boolean | undefined;
  readonly keyboardEnabled?: boolean | undefined;
}

/**
 * Presentational core for the Calculator.
 * Wrapped in React.memo to prevent unnecessary repaints.
 */
const CalculatorView: React.FC<CalculatorViewProps> = React.memo(({
  calc,
  onOpenConverter,
  isConverterOpen = false,
  keyboardEnabled = true,
}) => {
  const {
    state,
    dispatch,
    inputDigit,
    inputOperator,
    inputDecimal,
    inputParenthesis,
    inputFunction,
    inputConstant,
    inputPostfix,
    clearAll,
    deleteBackspace,
    calculate,
    setMode,
    setAngleUnit,
    memoryClear,
    memoryRecall,
    memoryAdd,
    memorySubtract,
    livePreview,
  } = calc;

  // Listen to physical keyboard events with modal isolation
  useKeyboard({ enabled: keyboardEnabled, onAction: dispatch });

  const isScientific = state.mode === 'scientific';

  const handleMemoryAdd = useCallback(() => {
    memoryAdd();
  }, [memoryAdd]);

  const handleMemorySubtract = useCallback(() => {
    memorySubtract();
  }, [memorySubtract]);

  const handleSetStandard = useCallback(() => {
    setMode('standard');
  }, [setMode]);

  const handleSetScientific = useCallback(() => {
    setMode('scientific');
  }, [setMode]);

  return (
    <div
      className={`
        calculator relative w-full flex-1 min-h-0
        rounded-[35px] bg-[var(--bg-color)]
        border border-white/5
        shadow-calc-shell
        flex flex-col
        transition-all duration-500
        ${isScientific
          ? 'p-3 xs:p-4 sm:p-5 gap-2 xs:gap-2.5 sm:gap-3'
          : 'p-4 xs:p-5 sm:p-6 gap-3 xs:gap-3.5 sm:gap-4'}
      `}
    >
      {/* Header / Utility Bar */}
      <header className="flex items-center justify-between px-1 select-none">
        {/* Brand Beacon */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-orbitron text-xs font-bold tracking-wider text-[var(--text-color)] uppercase">
            Calcx<span className="text-[var(--op-right-color)] ml-0.5">Pro</span>
          </span>
        </div>

        {/* Mode Selector Tabs (Segmented Inset Pill) */}
        <div
          role="tablist"
          aria-label="Calculator Modes"
          className="flex items-center p-0.5 sm:p-1 rounded-full neumorphic-inset"
        >
          <button
            type="button"
            role="tab"
            aria-selected={!isConverterOpen && state.mode === 'standard'}
            onClick={handleSetStandard}
            className={`
              min-h-[30px] sm:min-h-[32px] px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-medium rounded-full transition-all duration-200 flex items-center justify-center font-orbitron
              ${!isConverterOpen && state.mode === 'standard'
                ? 'bg-[var(--op-right-color)] text-white shadow-sm font-bold'
                : 'text-[var(--history-color)] hover:text-[var(--text-color)]'}
            `}
          >
            Standard
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isConverterOpen && state.mode === 'scientific'}
            onClick={handleSetScientific}
            className={`
              min-h-[30px] sm:min-h-[32px] px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-medium rounded-full transition-all duration-200 flex items-center justify-center font-orbitron
              ${!isConverterOpen && state.mode === 'scientific'
                ? 'bg-[var(--op-right-color)] text-white shadow-sm font-bold'
                : 'text-[var(--history-color)] hover:text-[var(--text-color)]'}
            `}
          >
            Scientific
          </button>
          {onOpenConverter && (
            <button
              type="button"
              role="tab"
              aria-selected={isConverterOpen}
              onClick={onOpenConverter}
              className={`
                min-h-[30px] sm:min-h-[32px] px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-medium rounded-full transition-all duration-200 flex items-center justify-center font-orbitron
                ${isConverterOpen
                  ? 'bg-[var(--op-right-color)] text-white shadow-sm font-bold'
                  : 'text-[var(--history-color)] hover:text-[var(--text-color)]'}
              `}
            >
              Converter
            </button>
          )}
        </div>
      </header>

      {/* Display Area */}
      <section aria-label="Display Area" className="w-full">
        <Display
          expression={state.expression}
          value={state.displayValue}
          isError={state.isError}
          errorMessage={state.errorMessage}
          modeBadge={state.angleUnit.toUpperCase()}
          hasMemory={state.memory !== 0}
          memoryValue={state.memory}
          isCompact={isScientific}
          livePreview={livePreview}
        />
      </section>

      {/* Memory Controls (Universal in Standard & Scientific Modes) */}
      <section aria-label="Memory Controls" className="w-full">
        <MemoryControls
          hasMemory={state.memory !== 0}
          onMemoryClear={memoryClear}
          onMemoryRecall={memoryRecall}
          onMemoryAdd={handleMemoryAdd}
          onMemorySubtract={handleMemorySubtract}
          isCompact={isScientific}
        />
      </section>

      {/* Angle Unit Selector (Scientific Mode Only) */}
      {state.mode === 'scientific' && (
        <section aria-label="Angle Unit Selector" className="w-full animate-fadeIn">
          <AngleUnitSelector
            currentUnit={state.angleUnit}
            onSelectUnit={setAngleUnit}
          />
        </section>
      )}

      {/* Keypad Area — flex-1 to fill remaining height */}
      <section aria-label="Keypad Area" className="w-full flex-1 min-h-0 flex flex-col">
        {state.mode === 'scientific' ? (
          <ScientificKeypad
            onDigitClick={inputDigit}
            onOperatorClick={inputOperator}
            onDecimalClick={inputDecimal}
            onParenthesisClick={inputParenthesis}
            onFunctionClick={inputFunction}
            onConstantClick={inputConstant}
            onPostfixClick={inputPostfix}
            onClearClick={clearAll}
            onEqualClick={calculate}
            onBackspaceClick={deleteBackspace}
          />
        ) : (
          <Keypad
            onDigitClick={inputDigit}
            onOperatorClick={inputOperator}
            onDecimalClick={inputDecimal}
            onParenthesisClick={inputParenthesis}
            onClearClick={clearAll}
            onEqualClick={calculate}
            onBackspaceClick={deleteBackspace}
          />
        )}
      </section>

      {/* Footer status readout */}
      <div className="flex items-center justify-between px-2 pt-1.5 border-t border-black/5 dark:border-white/5 text-[9px] sm:text-[10px] font-orbitron tracking-wider text-[var(--history-color)] opacity-80">
        <span className="uppercase">
          MODE: {state.mode} &bull; STATUS: {state.status}
        </span>
        <span>ENGINE: SHUNTING-YARD</span>
      </div>
    </div>
  );
});

CalculatorView.displayName = 'CalculatorView';

/**
 * Standalone wrapper for Calculator when no external instance is passed.
 * Separated to avoid calling useCalculator() conditionally or redundantly.
 */
const CalculatorStandalone: React.FC<Omit<CalculatorProps, 'calculator'>> = (props) => {
  const calc = useCalculator();
  return <CalculatorView calc={calc} {...props} />;
};

/**
 * Interactive Calculator Container Component.
 * Binds the reactive state machine and keyboard inputs to Display, Keypad, and ScientificKeypad.
 */
export const Calculator: React.FC<CalculatorProps> = ({
  calculator,
  ...props
}) => {
  if (calculator) {
    return <CalculatorView calc={calculator} {...props} />;
  }
  return <CalculatorStandalone {...props} />;
};
