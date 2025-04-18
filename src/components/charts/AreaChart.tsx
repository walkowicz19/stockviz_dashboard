
import React from 'react';
import { AreaChart as ReChartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AreaChartProps {
  data: any[];
  title: string;
  xKey: string;
  areaKeys: string[];
  colors?: { stroke: string; fill: string }[];
}

const AreaChart = ({ 
  data, 
  title, 
  xKey, 
  areaKeys,
  colors = [
    { stroke: '#1EAEDB', fill: 'url(#colorBlue)' },
    { stroke: '#33C3F0', fill: 'url(#colorLightBlue)' },
    { stroke: '#0FA0CE', fill: 'url(#colorDarkBlue)' }
  ]
}: AreaChartProps) => {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <ReChartsAreaChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1EAEDB" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1EAEDB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLightBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#33C3F0" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#33C3F0" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDarkBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0FA0CE" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0FA0CE" stopOpacity={0} />
                </linearGradient>
              </defs>
              
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
              
              {areaKeys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length].stroke}
                  fillOpacity={1}
                  fill={colors[index % colors.length].fill}
                />
              ))}
            </ReChartsAreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AreaChart;
