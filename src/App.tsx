import React, { useState, useEffect, useCallback } from 'react';
import { Calculator } from './components/calculator/Calculator';
import { HistoryPanel } from './components/history/HistoryPanel';
import { UnitConverter } from './components/converter/UnitConverter';
import { Modal } from './components/common/Modal';
import { IconButton } from './components/common/IconButton';
import { SettingsModal } from './components/settings/SettingsModal';
import { useCalculator } from './hooks/useCalculator';
import { useTheme } from './hooks/useTheme';
import type { CalculationHistoryItem } from './types/calculator';

/**
 * Calcx-Pro Root Shell.
 * Integrates the fully interactive calculation engine with the UI shell,
 * real-time calculation history, physical keyboard support, and reference Neumorphic styling.
 */
export const App: React.FC = () => {
  const calculator = useCalculator();
  const { resolvedTheme } = useTheme(calculator.state.themePreference);

  const [isKeyboardHelpOpen, setIsKeyboardHelpOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isConverterOpen, setIsConverterOpen] = useState<boolean>(false);

  const isAnyModalOpen = isKeyboardHelpOpen || isSettingsOpen || isHistoryOpen || isConverterOpen;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isHistoryOpen) setIsHistoryOpen(false);
        if (isConverterOpen) setIsConverterOpen(false);
        if (isKeyboardHelpOpen) setIsKeyboardHelpOpen(false);
        if (isSettingsOpen) setIsSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHistoryOpen, isConverterOpen, isKeyboardHelpOpen, isSettingsOpen]);

  const handleToggleThemeSwitch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const nextIsDark = e.target.checked;
    calculator.setThemePreference(nextIsDark ? 'dark' : 'light');

    // Trigger reference browser reflow animations
    const calcBody = document.querySelector('.calculator');
    const displayArea = document.querySelector('.neumorphic-display');

    if (calcBody) {
      calcBody.classList.remove('animate-switch');
      void (calcBody as HTMLElement).offsetWidth;
      calcBody.classList.add('animate-switch');
    }

    if (displayArea) {
      displayArea.classList.remove('animate-flare');
      void (displayArea as HTMLElement).offsetWidth;
      displayArea.classList.add('animate-flare');
    }
  }, [calculator]);

  const handleToggleConverter = useCallback(() => {
    setIsConverterOpen((prev) => !prev);
  }, []);

  const handleCloseConverter = useCallback(() => {
    setIsConverterOpen(false);
  }, []);

  const handleToggleHistory = useCallback(() => {
    setIsHistoryOpen((prev) => !prev);
  }, []);

  const handleCloseHistory = useCallback(() => {
    setIsHistoryOpen(false);
  }, []);

  const handleOpenShortcuts = useCallback(() => {
    setIsKeyboardHelpOpen(true);
  }, []);

  const handleCloseShortcuts = useCallback(() => {
    setIsKeyboardHelpOpen(false);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const handleSelectHistoryItem = useCallback((item: CalculationHistoryItem) => {
    calculator.loadHistoryItem(item);
  }, [calculator]);

  const handleClearHistory = useCallback(() => {
    calculator.clearHistory();
  }, [calculator]);

  const handleDeleteHistoryItem = useCallback((id: string) => {
    calculator.deleteHistoryItem(id);
  }, [calculator]);

  const historyLength = calculator.state.history.length;
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="relative h-screen overflow-hidden bg-[var(--bg-color)] text-[var(--text-color)] flex flex-col transition-colors duration-600">
      {/* Reference Glowing Orbs Background */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />

      {/* Top Application Bar */}
      <header className="border-b border-black/5 dark:border-white/5 bg-[var(--bg-color)]/70 backdrop-blur-xl sticky top-0 z-30 px-3 xs:px-4 sm:px-8 py-2 sm:py-3 transition-colors duration-600">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img
              src="/icons/icon-09.gif"
              alt="Calcx-Pro Logo"
              className="h-8 sm:h-9 w-auto object-contain shrink-0 select-none dark:mix-blend-screen"
            />
            <div>
              <h1 className="text-base sm:text-lg font-orbitron font-bold tracking-tight text-[var(--text-color)]">
                Calcx<span className="text-[var(--op-right-color)] ml-0.5">Pro</span>
              </h1>
              <p className="text-[10px] sm:text-[11px] font-poppins text-[var(--history-color)]">Precision Engineering Calculator</p>
            </div>
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <IconButton
              ariaLabel={
                historyLength > 0
                  ? `Calculation History (${historyLength} item${historyLength === 1 ? '' : 's'})`
                  : 'Calculation History'
              }
              title="Calculation History"
              variant={isHistoryOpen ? 'active' : 'default'}
              size="sm"
              onClick={handleToggleHistory}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="text-xs font-medium px-1 hidden sm:inline">History</span>
              {historyLength > 0 && (
                <span className="text-[10px] font-orbitron px-1.5 py-0.2 rounded-full bg-[var(--op-right-color)]/20 text-[var(--op-right-color)] font-bold ml-0.5">
                  {historyLength}
                </span>
              )}
            </IconButton>

            <IconButton
              ariaLabel="Keyboard Shortcuts Information"
              title="Keyboard Shortcuts"
              variant="default"
              size="sm"
              onClick={handleOpenShortcuts}
            >
              <span className="text-xs font-medium px-1 hidden sm:inline">Shortcuts</span>
              <span className="text-xs font-medium px-1 sm:hidden">⌨</span>
            </IconButton>

            <IconButton
              ariaLabel="Calculator Settings"
              title="Calculator Settings"
              variant="default"
              size="sm"
              onClick={handleOpenSettings}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-xs font-medium px-1 hidden sm:inline">Settings</span>
            </IconButton>
          </div>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="flex-1 min-h-0 w-full overflow-hidden flex flex-col items-center justify-center px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3.5 z-10">
        {/* Reference Neumorphic Theme Switch Wrapper */}
        <div className="theme-switch-wrapper mb-2.5 sm:mb-3.5 select-none">
          <span className="theme-label" id="theme-label">
            {isDark ? 'PRO MODE' : 'NORMAL MODE'}
          </span>
          <label className="theme-switch" htmlFor="theme-checkbox" aria-label="Toggle theme mode">
            <input
              type="checkbox"
              id="theme-checkbox"
              checked={isDark}
              onChange={handleToggleThemeSwitch}
              aria-labelledby="theme-label"
            />
            <div className="slider round" />
          </label>
        </div>

        <div className="w-full max-w-[340px] xs:max-w-[370px] sm:max-w-[420px] flex-1 min-h-0 flex flex-col">
          {/* Main Stage: Connected Calculator Shell */}
          <section aria-label="Interactive Calculator" className="w-full flex-1 min-h-0 flex flex-col">
            <Calculator
              calculator={calculator}
              onOpenConverter={handleToggleConverter}
              isConverterOpen={isConverterOpen}
              keyboardEnabled={!isAnyModalOpen}
            />
          </section>
        </div>
      </main>

      {/* Calculation History Slide-Over Drawer / Modal Overlay */}
      {isHistoryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Calculation History"
          className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseHistory();
          }}
        >
          <div
            className="
              relative w-full max-w-full sm:max-w-md h-full bg-[var(--bg-color)] border-l border-white/5
              shadow-2xl flex flex-col p-4 sm:p-5 overflow-hidden transition-transform duration-200
            "
          >
            <HistoryPanel
              items={calculator.state.history}
              onSelectItem={handleSelectHistoryItem}
              onClearHistory={handleClearHistory}
              onDeleteItem={handleDeleteHistoryItem}
              onClose={handleCloseHistory}
              className="h-full border-0 rounded-none shadow-none p-0 bg-transparent"
            />
          </div>
        </div>
      )}

      {/* Unit Converter Overlay */}
      {isConverterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Unit Converter"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 sm:p-6 bg-black/50 backdrop-blur-sm transition-opacity duration-200 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseConverter();
          }}
        >
          <div
            className="
              relative w-full max-w-[360px] xs:max-w-[390px] sm:max-w-[440px]
              rounded-[35px] bg-[var(--bg-color)] border border-white/5
              shadow-calc-shell p-4 sm:p-5 flex flex-col my-auto
            "
          >
            <UnitConverter
              onClose={handleCloseConverter}
              className="border-0 rounded-none shadow-none p-0 bg-transparent"
            />
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      <Modal
        isOpen={isKeyboardHelpOpen}
        onClose={handleCloseShortcuts}
        title="Physical Keyboard Shortcuts"
      >
        <div className="space-y-3 text-xs text-[var(--history-color)]">
          <div className="grid grid-cols-2 gap-2 text-[var(--text-color)]">
            <div className="p-2 rounded-xl neumorphic-inset">
              <span className="font-orbitron text-[var(--op-right-color)] font-semibold">0 – 9</span>
              <p className="text-[11px] text-[var(--history-color)] mt-0.5">Numeric Input / NumPad</p>
            </div>
            <div className="p-2 rounded-xl neumorphic-inset">
              <span className="font-orbitron text-[var(--op-right-color)] font-semibold">+ − * / %</span>
              <p className="text-[11px] text-[var(--history-color)] mt-0.5">Operators</p>
            </div>
            <div className="p-2 rounded-xl neumorphic-inset">
              <span className="font-orbitron text-[var(--op-right-color)] font-semibold">^  !</span>
              <p className="text-[11px] text-[var(--history-color)] mt-0.5">Power & Factorial</p>
            </div>
            <div className="p-2 rounded-xl neumorphic-inset">
              <span className="font-orbitron text-[var(--op-right-color)] font-semibold">( )</span>
              <p className="text-[11px] text-[var(--history-color)] mt-0.5">Parentheses Grouping</p>
            </div>
            <div className="p-2 rounded-xl neumorphic-inset">
              <span className="font-orbitron text-[var(--op-right-color)] font-semibold">Enter / =</span>
              <p className="text-[11px] text-[var(--history-color)] mt-0.5">Calculate Result</p>
            </div>
            <div className="p-2 rounded-xl neumorphic-inset">
              <span className="font-orbitron text-[var(--op-right-color)] font-semibold">Backspace</span>
              <p className="text-[11px] text-[var(--history-color)] mt-0.5">Delete Character</p>
            </div>
            <div className="p-2 rounded-xl neumorphic-inset">
              <span className="font-orbitron text-[var(--ac-color)] font-semibold">Escape</span>
              <p className="text-[11px] text-[var(--history-color)] mt-0.5">All Clear (AC)</p>
            </div>
          </div>
          <p className="text-[11px] text-[var(--history-color)] pt-2 border-t border-black/5 dark:border-white/5 font-poppins">
            NumPad keys on desktop keyboards are fully supported.
          </p>
        </div>
      </Modal>

      {/* Calculator Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        themePreference={calculator.state.themePreference}
        onThemeChange={calculator.setThemePreference}
        mode={calculator.state.mode}
        onModeChange={calculator.setMode}
        angleUnit={calculator.state.angleUnit}
        onAngleUnitChange={calculator.setAngleUnit}
      />

      {/* Application Footer */}
      <footer className="shrink-0 border-t border-black/5 dark:border-white/5 bg-[var(--bg-color)]/70 backdrop-blur-md py-2 px-4 sm:px-8 text-center text-xs text-[var(--history-color)] select-none transition-colors duration-600 z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-orbitron text-[10px] sm:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Interactive Shunting-Yard Engine &bull; Zero `eval()` &bull; Strict TypeScript</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-orbitron">Calcx-Pro &copy; 2026</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
