
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

const StatsCard = ({ title, value, change, icon }: StatsCardProps) => {
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            
            {change !== undefined && (
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <ArrowUpIcon className="h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 text-rose-500" />
                )}
                <p className={cn(
                  "text-xs font-medium",
                  isPositive ? "text-emerald-500" : "text-rose-500"
                )}>
                  {Math.abs(change)}%
                </p>
              </div>
            )}
          </div>
          
          {icon && (
            <div className="p-2 rounded-full bg-blue-50 text-blue-500">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
