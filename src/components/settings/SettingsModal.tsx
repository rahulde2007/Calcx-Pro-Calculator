import React from 'react';
import { Modal } from '../common/Modal';
import type {
  ThemePreference,
  CalculatorMode,
  AngleUnit,
} from '../../types/calculator';

export interface SettingsModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly themePreference: ThemePreference;
  readonly onThemeChange: (theme: ThemePreference) => void;
  readonly mode: CalculatorMode;
  readonly onModeChange: (mode: CalculatorMode) => void;
  readonly angleUnit: AngleUnit;
  readonly onAngleUnitChange: (unit: AngleUnit) => void;
}

const THEME_OPTIONS: readonly { readonly value: ThemePreference; readonly label: string; readonly desc: string }[] = [
  { value: 'system', label: 'System', desc: 'Auto' },
  { value: 'light', label: 'Light', desc: 'Clean' },
  { value: 'dark', label: 'Dark', desc: 'Cosmic' },
];

const MODE_OPTIONS: readonly { readonly value: CalculatorMode; readonly label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'scientific', label: 'Scientific' },
];

const ANGLE_OPTIONS: readonly { readonly value: AngleUnit; readonly label: string; readonly symbol: string }[] = [
  { value: 'deg', label: 'Degrees', symbol: 'DEG' },
  { value: 'rad', label: 'Radians', symbol: 'RAD' },
  { value: 'grad', label: 'Gradians', symbol: 'GRAD' },
];

/**
 * Accessible, neumorphic Settings dialog controlling appearance and calculation parameters.
 * Directly mutates canonical calculator preferences with zero parallel state.
 */
export const SettingsModal: React.FC<SettingsModalProps> = React.memo(({
  isOpen,
  onClose,
  themePreference,
  onThemeChange,
  mode,
  onModeChange,
  angleUnit,
  onAngleUnitChange,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Calculator Settings">
      <div className="space-y-6 pt-1">
        {/* Appearance / Theme */}
        <section aria-labelledby="settings-theme-heading">
          <div className="flex items-center justify-between mb-2">
            <h3
              id="settings-theme-heading"
              className="font-orbitron text-xs font-bold uppercase tracking-wider text-[var(--history-color)]"
            >
              Appearance
            </h3>
            <span className="font-orbitron text-[11px] text-[var(--history-color)]">
              Active: <strong className="text-[var(--text-color)] capitalize">{themePreference}</strong>
            </span>
          </div>
          <div
            role="radiogroup"
            aria-labelledby="settings-theme-heading"
            className="grid grid-cols-3 gap-2.5"
          >
            {THEME_OPTIONS.map((opt) => {
              const isSelected = themePreference === opt.value;
              return (
                <button
                  key={opt.value}
                  id={`theme-option-${opt.value}`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onThemeChange(opt.value)}
                  className={`min-h-[46px] flex flex-col items-center justify-center px-3 py-2 rounded-2xl text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)] ${
                    isSelected
                      ? 'bg-[var(--op-right-color)] text-white shadow-sm font-bold'
                      : 'neumorphic-btn text-[var(--history-color)] hover:text-[var(--text-color)]'
                  }`}
                >
                  <span className="font-poppins">{opt.label}</span>
                  <span className={`text-[10px] mt-0.5 font-orbitron ${isSelected ? 'text-white/80' : 'text-[var(--history-color)] opacity-70'}`}>
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Calculator Mode */}
        <section aria-labelledby="settings-mode-heading">
          <div className="flex items-center justify-between mb-2">
            <h3
              id="settings-mode-heading"
              className="font-orbitron text-xs font-bold uppercase tracking-wider text-[var(--history-color)]"
            >
              Keypad Mode
            </h3>
            <span className="font-orbitron text-[11px] text-[var(--history-color)]">
              Active: <strong className="text-[var(--text-color)] capitalize">{mode}</strong>
            </span>
          </div>
          <div
            role="radiogroup"
            aria-labelledby="settings-mode-heading"
            className="grid grid-cols-2 gap-2.5"
          >
            {MODE_OPTIONS.map((opt) => {
              const isSelected = mode === opt.value;
              return (
                <button
                  key={opt.value}
                  id={`mode-option-${opt.value}`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onModeChange(opt.value)}
                  className={`min-h-[44px] flex items-center justify-center px-4 py-2 rounded-2xl text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)] ${
                    isSelected
                      ? 'bg-[var(--op-right-color)] text-white shadow-sm font-bold'
                      : 'neumorphic-btn text-[var(--history-color)] hover:text-[var(--text-color)]'
                  }`}
                >
                  <span className="font-poppins">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Angle Unit */}
        <section aria-labelledby="settings-angle-heading">
          <div className="flex items-center justify-between mb-2">
            <h3
              id="settings-angle-heading"
              className="font-orbitron text-xs font-bold uppercase tracking-wider text-[var(--history-color)]"
            >
              Angle Unit (Trigonometry)
            </h3>
            <span className="font-orbitron text-[11px] text-[var(--history-color)]">
              Active: <strong className="text-[var(--text-color)] uppercase">{angleUnit}</strong>
            </span>
          </div>
          <div
            role="radiogroup"
            aria-labelledby="settings-angle-heading"
            className="grid grid-cols-3 gap-2.5"
          >
            {ANGLE_OPTIONS.map((opt) => {
              const isSelected = angleUnit === opt.value;
              return (
                <button
                  key={opt.value}
                  id={`angle-option-${opt.value}`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onAngleUnitChange(opt.value)}
                  className={`min-h-[46px] flex flex-col items-center justify-center px-2 py-2 rounded-2xl text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)] ${
                    isSelected
                      ? 'bg-[var(--op-right-color)] text-white shadow-sm font-bold'
                      : 'neumorphic-btn text-[var(--history-color)] hover:text-[var(--text-color)]'
                  }`}
                >
                  <span className="font-orbitron font-semibold">{opt.symbol}</span>
                  <span className={`text-[10px] mt-0.5 font-poppins ${isSelected ? 'text-white/80' : 'text-[var(--history-color)] opacity-70'}`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Persistence Contract Informational Badge */}
        <div className="neumorphic-inset rounded-2xl p-3.5 text-[11px] text-[var(--history-color)] leading-relaxed font-poppins">
          Preferences (theme, mode, angle unit) and calculation history automatically persist in your browser. Memory registers (MC/MR/M+/M−) are strictly session-only.
        </div>

        {/* Done / Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="neumorphic-btn neumorphic-btn-equals min-h-[40px] px-6 py-2 rounded-full font-orbitron text-xs font-bold tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)]"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
});

SettingsModal.displayName = 'SettingsModal';
