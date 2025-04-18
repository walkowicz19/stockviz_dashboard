
import React from 'react';
import { BarChart as ReChartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BarChartProps {
  data: any[];
  title: string;
  xKey: string;
  barKeys: string[];
  colors?: string[];
  stacked?: boolean;
}

const BarChart = ({ 
  data, 
  title, 
  xKey, 
  barKeys, 
  colors = ['#1EAEDB', '#33C3F0', '#0FA0CE'], 
  stacked = false 
}: BarChartProps) => {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <ReChartsBarChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey={xKey} 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
              />
              <Tooltip />
              {barKeys.map((key, index) => (
                <Bar 
                  key={key}
                  dataKey={key}
                  stackId={stacked ? "stack" : undefined}
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </ReChartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChart;
