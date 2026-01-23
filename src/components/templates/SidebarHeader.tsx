'use client';

import { Icon } from '@iconify/react';

interface SidebarHeaderProps {
  title?: string;
  icon?: string;
  onClose?: () => void;
  isMobile?: boolean;
}

export function SidebarHeader({ 
  title = "Dashboard", 
  icon = "solar:chart-bold",
  onClose,
  isMobile = false 
}: SidebarHeaderProps) {
  return (
    <div className={`flex items-center ${isMobile ? 'justify-between mb-8' : 'gap-3 mb-8'}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
          <Icon 
            icon={icon} 
            className="w-6 h-6 text-blue-600 dark:text-blue-300" 
          />
        </div>
        <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </span>
      </div>
      
      {isMobile && onClose && (
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Close sidebar"
        >
          <Icon 
            icon="solar:alt-arrow-left-bold" 
            className="w-5 h-5 text-gray-500 dark:text-gray-400" 
          />
        </button>
      )}
    </div>
  );
}