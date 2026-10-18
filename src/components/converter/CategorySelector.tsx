import React from 'react';
import type { CategoryDefinition, CategoryId } from '../../converter/types';

export interface CategorySelectorProps {
  readonly categories: readonly CategoryDefinition[];
  readonly selectedCategoryId: CategoryId;
  readonly onSelectCategory: (id: CategoryId) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <nav
      aria-label="Unit Categories"
      className="w-full overflow-x-auto pb-1.5 scrollbar-thin"
    >
      <div className="flex items-center gap-1.5 min-w-max">
        {categories.map((cat) => {
          const isSelected = cat.id === selectedCategoryId;
          return (
            <button
              key={cat.id}
              id={`cat-tab-${cat.id}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`converter-panel-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`
                min-h-[34px] px-3 py-1 rounded-full text-[11px] font-orbitron font-medium transition-all duration-150 flex items-center gap-1 select-none whitespace-nowrap
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--op-right-color)]
                ${
                  isSelected
                    ? 'bg-[var(--op-right-color)] text-white shadow-sm font-bold'
                    : 'neumorphic-btn text-[var(--history-color)] hover:text-[var(--text-color)]'
                }
              `}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
