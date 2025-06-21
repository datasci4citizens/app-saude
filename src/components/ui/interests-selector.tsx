import type React from "react";
import { useEffect, useState } from "react";

// TypeScript interface for props
interface ItemType {
  id: number | string;
  title: string;
  icon: string;
}

interface InterestsSelectorProps {
  items: ItemType[];
  onSelectionChange?: (selectedItems: (string | number)[]) => void;
}

const InterestsSelector: React.FC<InterestsSelectorProps> = ({
  items,
  onSelectionChange,
}) => {
  const [columnCount, setColumnCount] = useState(4);
  const [itemHeights, setItemHeights] = useState<
    Record<string | number, number>
  >({});
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);

  // Generate random heights for each item (between 150px and 300px)
  useEffect(() => {
    const heights: Record<string | number, number> = {};
    items.forEach((item) => {
      heights[item.id] = Math.floor(Math.random() * (300 - 150 + 1)) + 150;
    });
    setItemHeights(heights);
  }, [items]);

  // Determine column count based on screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setColumnCount(2);
      } else if (width < 900) {
        setColumnCount(3);
      } else {
        setColumnCount(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Notify parent component when selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedItems);
    }
  }, [selectedItems, onSelectionChange]);

  // Handle item selection/deselection
  const toggleItem = (id: string | number) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Distribute items among columns
  const getColumnsData = () => {
    if (columnCount <= 0) {
      return [items]; // Return all items in one column if columnCount is invalid
    }

    const columns: ItemType[][] = [];
    for (let i = 0; i < columnCount; i++) {
      columns.push([]);
    }

    items.forEach((item, index) => {
      if (columnCount > 0) {
        const columnIndex = index % columnCount;
        if (columns[columnIndex]) {
          columns[columnIndex].push(item);
        }
      }
    });

    return columns;
  };

  const columns = getColumnsData();

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex w-full gap-3">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-3 flex-1">
            {column.map((item) => {
              const isSelected = selectedItems.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`
                    ${isSelected ? "bg-selected" : "bg-selection hover:bg-selected/70"} 
                    rounded-lg p-4 flex flex-col text-white relative cursor-pointer
                    transition-colors duration-200
                  `}
                  style={{ height: `${itemHeights[item.id]}px` }}
                  onClick={() => toggleItem(item.id)}
                >
                  <span
                    className={`text-2xl mb-2 icon-${item.icon}`}
                    aria-hidden="true"
                  ></span>
                  <span className="text-typography font-bold absolute bottom-4">
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterestsSelector;
