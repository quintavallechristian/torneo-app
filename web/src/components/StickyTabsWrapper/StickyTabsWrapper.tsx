'use client';

import { useEffect, useRef, useState } from 'react';

interface StickyTabsWrapperProps {
  children: React.ReactNode;
  className?: string;
  topOffset?: string;
}

export default function StickyTabsWrapper({
  children,
  className = 'pb-4 py-4 px-2',
  topOffset = 'top-0',
}: StickyTabsWrapperProps) {
  const [isSticky, setIsSticky] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        // Extract numeric value from topOffset (e.g., "68px" -> 68, "0" -> 0)
        const offset =
          topOffset === 'top-0'
            ? 0
            : parseInt(topOffset.replace(/[^\d]/g, '')) || 0;
        // Element is sticky when it's at the top position
        setIsSticky(rect.top <= offset);
      }
    };

    // Initial check
    handleScroll();

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [topOffset]);

  return (
    <div
      ref={ref}
      className={`-mx-12 px-12 sticky ${topOffset} z-20 mb-0 transition-all duration-200 ${className} ${
        isSticky
          ? 'bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm'
          : ''
      }`}
    >
      {children}
    </div>
  );
}
