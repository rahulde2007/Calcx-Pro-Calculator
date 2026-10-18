import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  CategoryId,
  UnitId,
  ConversionResult,
} from '../../converter/types';
import type { CurrencyState } from '../../converter/currency/types';
import { CATEGORIES, getCategory } from '../../converter/categories';
import { getUnit, getUnitsForCategory } from '../../converter/units';
import { convert } from '../../converter/index';
import { LiveCurrencyProvider } from '../../converter/currency/provider';
import { CategorySelector } from './CategorySelector';
import { UnitSelect } from './UnitSelect';
import { ConverterResult } from './ConverterResult';
import { CurrencyStatus } from './CurrencyStatus';

export interface UnitConverterProps {
  readonly onClose?: (() => void) | undefined;
  readonly className?: string | undefined;
}

const currencyProvider = new LiveCurrencyProvider();

export const UnitConverter: React.FC<UnitConverterProps> = React.memo(({
  onClose,
  className = '',
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId>('length');
  const [fromUnitId, setFromUnitId] = useState<UnitId>('m');
  const [toUnitId, setToUnitId] = useState<UnitId>('cm');
  const [inputValue, setInputValue] = useState<string>('1');

  // Currency State
  const [currencyState, setCurrencyState] = useState<CurrencyState>({
    status: 'idle',
    rates: null,
    errorMessage: null,
    lastFetched: null,
  });

  // Available units for current category
  const availableUnits = useMemo(
    () => getUnitsForCategory(selectedCategoryId),
    [selectedCategoryId]
  );

  // Fetch currency rates when currency category is active
  const fetchCurrencyRates = useCallback(async () => {
    setCurrencyState((prev) => ({ ...prev, status: 'loading', errorMessage: null }));
    try {
      const rates = await currencyProvider.fetchRates('USD');
      if (rates) {
        setCurrencyState({
          status: 'success',
          rates,
          errorMessage: null,
          lastFetched: Date.now(),
        });
      } else {
        setCurrencyState({
          status: 'error',
          rates: null,
          errorMessage: 'Live exchange rate unavailable',
          lastFetched: null,
        });
      }
    } catch {
      setCurrencyState({
        status: 'error',
        rates: null,
        errorMessage: 'Failed to connect to currency service',
        lastFetched: null,
      });
    }
  }, []);

  useEffect(() => {
    if (selectedCategoryId === 'currency' && currencyState.status === 'idle') {
      void fetchCurrencyRates();
    }
  }, [selectedCategoryId, currencyState.status, fetchCurrencyRates]);

  // Handle category change
  const handleCategoryChange = (catId: CategoryId) => {
    setSelectedCategoryId(catId);
    const cat = getCategory(catId);
    if (cat) {
      setFromUnitId(cat.defaultFrom);
      setToUnitId(cat.defaultTo);
    }
  };

  // Swap From and To units
  const handleSwap = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  // Clear / Reset
  const handleReset = () => {
    setInputValue('1');
    const cat = getCategory(selectedCategoryId);
    if (cat) {
      setFromUnitId(cat.defaultFrom);
      setToUnitId(cat.defaultTo);
    }
  };

  // Execute conversion
  const result: ConversionResult | null = useMemo(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return null;

    const numericVal = parseFloat(trimmed);
    if (Number.isNaN(numericVal)) {
      return {
        success: false,
        error: 'Please enter a valid number',
        code: 'INVALID_INPUT',
      };
    }

    return convert(
      numericVal,
      fromUnitId,
      toUnitId,
      selectedCategoryId,
      currencyState.rates
    );
  }, [inputValue, fromUnitId, toUnitId, selectedCategoryId, currencyState.rates]);

  const fromUnit = getUnit(fromUnitId);
  const toUnit = getUnit(toUnitId);

  return (
    <aside
      aria-label="Unit Converter"
      className={`
        w-full flex flex-col
        ${className ?? 'rounded-[35px] border border-white/5 p-4 sm:p-5 shadow-calc-shell bg-[var(--bg-color)]'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-black/5 dark:border-white/5 mb-3 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--op-right-color)]" />
          </span>
          <h2 className="font-orbitron text-xs font-bold uppercase tracking-wider text-[var(--text-color)]">
            Unit Converter
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleReset}
            title="Reset conversion input"
            aria-label="Reset conversion input"
            className="
              neumorphic-btn min-h-[30px] px-3 py-1 text-[11px] rounded-full font-orbitron font-medium transition-all
              text-[var(--history-color)] hover:text-[var(--text-color)]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)]
            "
          >
            Reset
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close unit converter"
              title="Close unit converter"
              className="
                neumorphic-btn min-h-[30px] min-w-[30px] p-1 text-xs rounded-full font-medium transition-all flex items-center justify-center
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

      {/* Category Tabs */}
      <div className="shrink-0 mb-3">
        <CategorySelector
          categories={CATEGORIES}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleCategoryChange}
        />
      </div>

      {/* Converter Body */}
      <div className="flex flex-col gap-3">
        {/* Currency Status Banner */}
        {selectedCategoryId === 'currency' && (
          <CurrencyStatus state={currencyState} onRetry={fetchCurrencyRates} />
        )}

        {/* Numeric Input */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between font-orbitron text-[10px] font-bold uppercase tracking-wider text-[var(--history-color)]">
            <span>Value</span>
            {fromUnit && (
              <span className="font-poppins text-[var(--history-color)] opacity-70 font-normal truncate max-w-[200px]">
                {fromUnit.label} ({fromUnit.symbol})
              </span>
            )}
          </div>
          <div className="relative">
            <input
              id="converter-input-value"
              type="text"
              inputMode="decimal"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value..."
              className="
                w-full min-h-[44px] px-3.5 py-2 rounded-2xl neumorphic-inset
                text-[var(--text-color)] text-base sm:text-lg font-orbitron font-semibold
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)]
                transition-all placeholder:text-[var(--history-color)]/40
              "
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue('')}
                aria-label="Clear input"
                title="Clear input"
                className="
                  absolute inset-y-0 right-0 px-3 flex items-center text-[var(--history-color)]
                  hover:text-[var(--text-color)] transition-colors
                "
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* From & To Unit Selection with Swap Button */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
          <UnitSelect
            id="converter-from-unit"
            label="From"
            value={fromUnitId}
            units={availableUnits}
            onChange={setFromUnitId}
          />

          {/* Swap Button */}
          <div className="flex justify-center pb-0.5">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap From and To units"
              title="Swap From and To units"
              className="
                neumorphic-btn min-h-[40px] min-w-[40px] p-2 rounded-full
                text-[var(--history-color)] hover:text-[var(--op-right-color)]
                flex items-center justify-center transition-transform duration-200 active:rotate-180
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)]
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          <UnitSelect
            id="converter-to-unit"
            label="To"
            value={toUnitId}
            units={availableUnits}
            onChange={setToUnitId}
          />
        </div>

        {/* Result Readout */}
        <ConverterResult
          result={result}
          toUnit={toUnit}
          inputValue={inputValue}
        />

        {/* Quick Value Presets */}
        <div className="pt-0.5">
          <span className="font-orbitron text-[10px] font-bold uppercase tracking-wider text-[var(--history-color)] mb-1.5 block">
            Quick Values
          </span>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {['1', '5', '10', '50', '100'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setInputValue(preset)}
                className="
                  neumorphic-btn min-h-[32px] xs:min-h-[34px] py-1 text-xs font-orbitron font-medium rounded-full
                  text-[var(--history-color)] hover:text-[var(--text-color)]
                  transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--op-right-color)]
                "
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
});

UnitConverter.displayName = 'UnitConverter';
