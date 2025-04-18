
import React from 'react';
import { BarChart, ChartPieIcon, Package, Settings, Users, Home, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
}

const DashboardSidebar = ({ isOpen }: SidebarProps) => {
  const navItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: BarChart, label: 'Analytics' },
    { icon: ChartPieIcon, label: 'Reports' },
    { icon: Package, label: 'Stock Data' },
    { icon: Users, label: 'Team' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-slate-200 bg-white/80 backdrop-blur-sm transition-transform md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
        <div className="rounded-md bg-blue-gradient p-1">
          <div className="h-6 w-6 text-white font-semibold flex items-center justify-center">S</div>
        </div>
        <h1 className="text-lg font-semibold">StockViz</h1>
      </div>
      
      <nav className="flex-1 overflow-auto p-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100",
                item.active && "bg-blue-50 text-blue-600 font-medium"
              )}
            >
              <item.icon className={cn("h-4 w-4", item.active && "text-blue-600")} />
              {item.label}
            </button>
          ))}
        </div>
      </nav>
      
      <div className="border-t border-slate-200 p-4">
        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
