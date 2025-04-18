
import React from 'react';
import { LineChart as ReChartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LineChartProps {
  data: any[];
  title: string;
  xKey: string;
  lineKeys: string[];
  colors?: string[];
}

const LineChart = ({ 
  data, 
  title, 
  xKey, 
  lineKeys, 
  colors = ['#1EAEDB', '#33C3F0', '#0FA0CE'] 
}: LineChartProps) => {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <ReChartsLineChart
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
              {lineKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </ReChartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LineChart;
