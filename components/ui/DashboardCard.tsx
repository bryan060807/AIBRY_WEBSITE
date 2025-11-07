'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
}

export default function DashboardCard({ children, className }: DashboardCardProps) {
  return (
    <div
      className={clsx(
        'bg-[#0e0f11] border border-gray-800 rounded-2xl shadow-md p-6 flex flex-col transition-transform duration-200 hover:scale-[1.01] hover:border-[#83c0cc]/40',
        className
      )}
    >
      {children}
    </div>
  );
}
