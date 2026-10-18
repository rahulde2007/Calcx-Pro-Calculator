import React from 'react';
import type { AngleUnit } from '../../types/calculator';

export interface AngleUnitSelectorProps {
  readonly currentUnit: AngleUnit;
  readonly onSelectUnit: (unit: AngleUnit) => void;
  readonly className?: string | undefined;
}

interface UnitOption {
  readonly id: AngleUnit;
  readonly label: string;
  readonly ariaLabel: string;
}

const UNITS: readonly UnitOption[] = [
  { id: 'deg', label: 'DEG', ariaLabel: 'Degrees' },
  { id: 'rad', label: 'RAD', ariaLabel: 'Radians' },
  { id: 'grad', label: 'GRAD', ariaLabel: 'Gradians' },
];

/**
 * Neumorphic segmented angle unit selector for Scientific Mode.
 * Controls trigonometric evaluation mode across DEG, RAD, and GRAD.
 */
export const AngleUnitSelector: React.FC<AngleUnitSelectorProps> = React.memo(({
  currentUnit,
  onSelectUnit,
  className = '',
}) => {
  return (
    <div
      role="radiogroup"
      aria-label="Angle measurement unit"
      className={`
        flex items-center justify-between p-1 rounded-full
        neumorphic-inset w-full
        ${className}
      `}
    >
      {UNITS.map((unit) => {
        const isActive = currentUnit === unit.id;
        return (
          <button
            key={unit.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={unit.ariaLabel}
            onClick={() => onSelectUnit(unit.id)}
            className={`
              flex-1 min-h-[30px] sm:min-h-[34px] flex items-center justify-center py-1 px-2 text-[10px] sm:text-xs font-orbitron font-semibold tracking-wider rounded-full
              select-none transition-all duration-200 ease-out text-center
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)]
              active:scale-[0.96]
              ${isActive
                ? 'bg-[var(--op-right-color)] text-white shadow-sm font-bold'
                : 'text-[var(--history-color)] hover:text-[var(--text-color)]'}
            `}
          >
            {unit.label}
          </button>
        );
      })}
    </div>
  );
});

AngleUnitSelector.displayName = 'AngleUnitSelector';
