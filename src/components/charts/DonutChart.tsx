
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DonutChartProps {
  data: any[];
  title: string;
  valueKey: string;
  nameKey: string;
  colors?: string[];
}

const DonutChart = ({ data, title, valueKey, nameKey, colors = ['#1EAEDB', '#33C3F0', '#0FA0CE', '#5ED3F3', '#008CB4'] }: DonutChartProps) => {
  // Filter out entries with zero or null values
  const filteredData = data.filter(item => item[valueKey] && Number(item[valueKey]) > 0);
  
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey={valueKey}
                nameKey={nameKey}
              >
                {filteredData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, '']} />
              <Legend formatter={(value) => <span className="text-xs">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonutChart;
