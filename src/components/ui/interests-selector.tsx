import React, { useEffect, useState } from 'react';

// TypeScript interface for props
interface ItemType {
  id: number | string;
  title: string;
  icon: string;
}

interface InterestsSelectorProps {
  items: ItemType[];
}

const InterestsSelector: React.FC<InterestsSelectorProps> = ({ items }) => {
  const [columnCount, setColumnCount] = useState(4);
  const [itemHeights, setItemHeights] = useState<Record<string | number, number>>({});
  
  // Generate random heights for each item (between 150px and 300px)
  useEffect(() => {
    const heights: Record<string | number, number> = {};
    items.forEach(item => {
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
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="w-full overflow-x-auto p-2.5">
      <div className={`grid gap-3 w-full grid-cols-${columnCount}`}>
        {items.map((item) => (
          <div 
            key={item.id} 
            className="bg-red-500 rounded-lg p-4 flex flex-col text-white relative"
            style={{ height: `${itemHeights[item.id]}px` }}
          >
            <span className={`text-2xl mb-2 icon-${item.icon}`} aria-hidden="true"></span>
            <span className="text-base font-bold absolute bottom-4">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterestsSelector;