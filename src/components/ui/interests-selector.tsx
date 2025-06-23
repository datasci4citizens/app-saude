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
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);

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
      }
      return [...prev, id];
    });
  };

  // Distribute items among columns
  const getColumnsData = () => {
    const columns: ItemType[][] = Array.from({ length: columnCount }, () => []);
    items.forEach((item, index) => {
      const column = columns[index % columnCount];
      if (column) {
        column.push(item);
      }
    });
    return columns;
  };

  const columns = getColumnsData();

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex w-full gap-3">
        {columns.map((column, columnIndex) => (
          <div
            key={`col-${columnIndex}-${column.length}`}
            className="flex flex-col w-full gap-3"
          >
            {column.map((item) => (
              <div
                key={item.id}
                className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  selectedItems.includes(item.id)
                    ? "ring-4 ring-offset-2 ring-selection"
                    : ""
                }`}
                onClick={() => toggleItem(item.id)}
                style={{
                  height: `${
                    Math.floor(Math.random() * (300 - 150 + 1)) + 150
                  }px`,
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <i className={`${item.icon} text-2xl mb-2`} />
                  <h3 className="font-bold text-lg">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterestsSelector;
