import React from 'react';
import type { UnitDefinition, UnitId } from '../../converter/types';

export interface UnitSelectProps {
  readonly id: string;
  readonly label: string;
  readonly value: UnitId;
  readonly units: readonly UnitDefinition[];
  readonly onChange: (unitId: UnitId) => void;
}

export const UnitSelect: React.FC<UnitSelectProps> = ({
  id,
  label,
  value,
  units,
  onChange,
}) => {
  // Group units if any have a group attribute
  const hasGroups = units.some((u) => u.group !== undefined);

  let content: React.ReactNode;
  if (hasGroups) {
    const groups: Record<string, UnitDefinition[]> = {};
    const ungrouped: UnitDefinition[] = [];

    for (const u of units) {
      if (u.group) {
        const list = groups[u.group] ?? [];
        list.push(u);
        groups[u.group] = list;
      } else {
        ungrouped.push(u);
      }
    }

    content = (
      <>
        {Object.entries(groups).map(([groupName, groupUnits]) => (
          <optgroup key={groupName} label={groupName} className="bg-[var(--bg-color)] text-[var(--text-color)] font-semibold">
            {groupUnits.map((u) => (
              <option key={u.id} value={u.id} className="bg-[var(--bg-color)] text-[var(--text-color)] font-normal">
                {u.label} ({u.symbol})
              </option>
            ))}
          </optgroup>
        ))}
        {ungrouped.map((u) => (
          <option key={u.id} value={u.id} className="bg-[var(--bg-color)] text-[var(--text-color)] font-normal">
            {u.label} ({u.symbol})
          </option>
        ))}
      </>
    );
  } else {
    content = units.map((u) => (
      <option key={u.id} value={u.id} className="bg-[var(--bg-color)] text-[var(--text-color)] font-normal">
        {u.label} ({u.symbol})
      </option>
    ));
  }

  return (
    <div className="flex flex-col gap-1 w-full min-w-0">
      <label htmlFor={id} className="font-orbitron text-[10px] font-bold uppercase tracking-wider text-[var(--history-color)]">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as UnitId)}
          className="
            w-full min-h-[40px] xs:min-h-[42px] px-3 py-1.5 pr-8 rounded-2xl neumorphic-inset
            text-[var(--text-color)] text-xs xs:text-sm font-poppins font-medium transition-all appearance-none cursor-pointer truncate
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)]
          "
        >
          {content}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[var(--history-color)]">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
