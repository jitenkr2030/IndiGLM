'use client';

import React from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {children}
    </div>
  );
}