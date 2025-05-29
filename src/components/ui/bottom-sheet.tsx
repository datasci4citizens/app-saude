// components/ui/bottom-sheet.tsx
import React, { useEffect, useRef } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ 
  isOpen, 
  onClose, 
  children,
  title 
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent scrolling on body
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = ''; // Restore scrolling
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center transition-opacity duration-300">
      <div 
        ref={sheetRef}
        className="bg-primary rounded-t-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-transform duration-300 ease-out"
        style={{
          boxShadow: '0px -4px 20px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 bg-gray-400 rounded-full"></div>
        </div>
        
        {title && (
          <div className="px-4 py-3 border-b border-gray-700">
            <h2 className="text-lg font-bold text-typography">{title}</h2>
          </div>
        )}
        
        <div className="max-h-[calc(90vh-60px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;