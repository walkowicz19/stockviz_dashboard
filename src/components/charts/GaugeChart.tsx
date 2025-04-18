
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GaugeChartProps {
  title: string;
  value: number;
  min?: number;
  max?: number;
  colors?: string[];
}

const GaugeChart = ({ 
  title, 
  value, 
  min = 0, 
  max = 100,
  colors = ['#1EAEDB', '#e0e0e0']
}: GaugeChartProps) => {
  // Ensure value is within bounds
  const normalizedValue = Math.max(min, Math.min(max, value));
  const percentage = ((normalizedValue - min) / (max - min)) * 100;
  
  // Create data for the gauge
  const data = [
    { name: 'Value', value: percentage },
    { name: 'Empty', value: 100 - percentage }
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="h-[150px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={0}
                dataKey="value"
              >
                <Cell key="cell-0" fill={colors[0]} />
                <Cell key="cell-1" fill={colors[1]} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold">{value}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GaugeChart;
