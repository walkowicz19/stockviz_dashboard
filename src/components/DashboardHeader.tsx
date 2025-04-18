import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Menu, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}
const DashboardHeader = ({
  onToggleSidebar
}: DashboardHeaderProps) => {
  return <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-b-slate-200 bg-white/80 backdrop-blur-sm px-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-blue-500 p-1">
            <div className="h-6 w-6 text-white font-semibold flex items-center justify-center">N</div>
          </div>
          <h1 className="text-lg font-semibold">NVIDIA Stock Data 2025</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="outline" className="hidden md:flex bg-blue-gradient text-white hover:bg-blue-700">
          Get Premium
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              3
            </span>
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <MessageSquare className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              5
            </span>
          </Button>
          
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="bg-blue-gradient text-white">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>;
};
export default DashboardHeader;