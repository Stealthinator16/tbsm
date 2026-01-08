'use client';

import React, { useEffect, useState } from 'react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function MobileDrawer({ isOpen, onClose, children, title }: MobileDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Only lock scroll on mobile devices where the drawer is actually visible
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 z-[101] transition-transform duration-300 ease-out transform rounded-t-3xl ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '85vh' }}
      >
        <div className="flex flex-col h-full">
          {/* Handle */}
          <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto my-4 flex-shrink-0" onClick={onClose} />
          
          <div className="px-6 pb-12 overflow-y-auto">
            {title && (
              <h2 className="text-xs font-bold text-tbsm-red uppercase mb-6 tracking-widest text-center">
                {title}
              </h2>
            )}
            {children}
          </div>
        </div>
      </div>
    </>
  );
}