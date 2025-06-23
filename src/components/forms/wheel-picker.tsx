import type React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface WheelPickerProps {
  data: string[];
  selected: string;
  onChange: (value: string) => void;
  height?: number;
  width?: number;
  itemHeight?: number;
  children?: React.ReactNode;
}

export const WheelPicker: React.FC<WheelPickerProps> = ({
  data,
  selected,
  onChange,
  height = 150,
  width = 80,
  itemHeight = 30,
  children,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(
    data.indexOf(selected) !== -1 ? data.indexOf(selected) : 0,
  );
  const [_, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const index = data.indexOf(selected);
    if (index !== -1 && index !== selectedIndex) {
      setSelectedIndex(index);
      scrollToIndex(index, false);
    }
  }, [selected, data, selectedIndex]);

  useEffect(() => {
    scrollToIndex(selectedIndex, false);
  }, [selectedIndex]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current)
        window.clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const scrollToIndex = (index: number, smooth = true) => {
    if (containerRef.current) {
      const scrollPosition = index * itemHeight;
      containerRef.current.scrollTo({
        top: scrollPosition,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };

  const handleScrollStart = () => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
  };

  const handleScroll = () => {
    if (!containerRef.current || !data.length) return;

    if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = window.setTimeout(() => {
      const scrollTop = containerRef.current?.scrollTop;
      if (scrollTop === undefined) return;
      const index = Math.round(scrollTop / itemHeight);
      const validIndex = Math.max(0, Math.min(index, data.length - 1));

      if (validIndex !== selectedIndex) {
        setSelectedIndex(validIndex);
        onChange(data[validIndex] as string);
      }

      scrollToIndex(validIndex);
      setIsScrolling(false);
    }, 150);
  };

  const middlePosition = height / 2 - itemHeight / 2;

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      style={{
        height: `${height}px`,
        width: `${width}px`,
      }}
    >
      <div
        className="absolute pointer-events-none z-10 w-full"
        style={{
          height: `${itemHeight}px`,
          top: `${middlePosition}px`,
        }}
      >
        {children}
      </div>

      <div
        ref={containerRef}
        className="h-full overflow-y-auto overscroll-contain touch-manipulation scrollbar-none"
        onScroll={handleScroll}
        onTouchStart={handleScrollStart}
        onMouseDown={handleScrollStart}
        onWheel={handleScrollStart}
      >
        <div
          style={{
            paddingTop: `${middlePosition}px`,
            paddingBottom: `${middlePosition}px`,
          }}
        >
          {data.map((item) => {
            const distance = Math.abs(data.indexOf(item) - selectedIndex);
            const opacity = calculateOpacity(distance);

            return (
              <div
                key={item}
                onClick={() => {
                  const index = data.indexOf(item);
                  setSelectedIndex(index);
                  onChange(item);
                  scrollToIndex(index);
                }}
                className={cn(
                  "text-center text-base cursor-pointer transition-opacity duration-200",
                  data.indexOf(item) === selectedIndex
                    ? "font-bold text-typography"
                    : "font-normal text-gray2-foreground",
                )}
                style={{
                  height: `${itemHeight}px`,
                  lineHeight: `${itemHeight}px`,
                  opacity: opacity,
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .touch-manipulation {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
};

const calculateOpacity = (distance: number): number => {
  if (distance === 0) return 1;
  if (distance === 1) return 0.8;
  if (distance === 2) return 0.6;
  if (distance === 3) return 0.4;
  return 0.2;
};
