import type React from 'react';
import { useEffect, useRef } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children, title }) => {
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
    <div className="fixed inset-0 bg-typography/40 backdrop-blur-hover z-50 flex items-end w-full justify-center transition-all duration-300">
      <div
        ref={sheetRef}
        className={`
          bg-background 
          rounded-t-3xl 
          w-full 
          max-h-[90vh] 
          overflow-hidden
          transform 
          transition-all 
          duration-300 
          ease-bounce-soft
          border-t-2
          border-x-2
          border-accent1/20
          shadow-hover-lg
          hover-glow
          ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
        `}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-muted rounded-full transition-colors duration-200 hover:bg-accent1/60" />
        </div>

        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-card-border/50 bg-card/30">
            <h2 className="text-titulowindow text-typography font-work-sans tracking-tight">
              {title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto scrollbar-thin scrollbar-track-card scrollbar-thumb-muted">
          <div className="px-6 py-4">{children}</div>
        </div>

        {/* Bottom Fade Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default BottomSheet;
