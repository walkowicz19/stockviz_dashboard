
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import FileUpload from '@/components/FileUpload';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import DonutChart from '@/components/charts/DonutChart';
import AreaChart from '@/components/charts/AreaChart';
import GaugeChart from '@/components/charts/GaugeChart';
import StatsCard from '@/components/StatsCard';
import { useToast } from '@/components/ui/toast';
import { 
  BarChart2, 
  TrendingUp, 
  DollarSign, 
  Activity 
} from 'lucide-react';

interface StockData {
  [key: string]: any;
}

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [hasData, setHasData] = useState(false);
  const { toast } = useToast();

  const handleDataLoaded = (data: any[]) => {
    if (data.length > 0) {
      setStockData(data);
      setHasData(true);
      
      // Log the first item to help debug the data structure
      console.log("Sample data:", data[0]);
    } else {
      toast({
        title: "Error",
        description: "No data found in the uploaded file",
        variant: "destructive"
      });
    }
  };

  // Sample data in case no data is loaded
  const sampleData = [
    { date: 'Jan', price: 100, volume: 1200, return: 5 },
    { date: 'Feb', price: 120, volume: 1400, return: 7 },
    { date: 'Mar', price: 110, volume: 1100, return: -2 },
    { date: 'Apr', price: 130, volume: 1500, return: 8 },
    { date: 'May', price: 140, volume: 1700, return: 6 },
  ];
  
  const samplePortfolio = [
    { name: 'AAPL', value: 30 },
    { name: 'MSFT', value: 25 },
    { name: 'AMZN', value: 20 },
    { name: 'GOOGL', value: 15 },
    { name: 'FB', value: 10 },
  ];

  // Helper function to extract data from uploaded stock data or use sample data
  const prepareChartData = () => {
    if (hasData && stockData.length > 0) {
      // Get all keys from the first data item to use as potential data points
      const keys = Object.keys(stockData[0]);
      
      // Find potential date/time column (often the first column)
      const dateKey = keys.find(key => 
        key.toLowerCase().includes('date') || 
        key.toLowerCase().includes('time') || 
        key.toLowerCase().includes('period')
      ) || keys[0];
      
      // Find numeric columns for values
      const numericKeys = keys.filter(key => 
        typeof stockData[0][key] === 'number' || 
        !isNaN(Number(stockData[0][key]))
      );
      
      return {
        data: stockData,
        dateKey,
        numericKeys
      };
    }
    
    return {
      data: sampleData,
      dateKey: 'date',
      numericKeys: ['price', 'volume', 'return']
    };
  };

  const { data, dateKey, numericKeys } = prepareChartData();
  
  // Extract stock symbols and their weights if available
  const getPortfolioData = () => {
    if (hasData && stockData.length > 0) {
      // Try to find columns that might contain stock symbols and weights
      const keys = Object.keys(stockData[0]);
      const symbolKey = keys.find(key => 
        key.toLowerCase().includes('symbol') || 
        key.toLowerCase().includes('ticker') || 
        key.toLowerCase().includes('stock')
      );
      
      const weightKey = keys.find(key => 
        key.toLowerCase().includes('weight') || 
        key.toLowerCase().includes('allocation') || 
        key.toLowerCase().includes('percentage')
      );
      
      if (symbolKey && weightKey) {
        return stockData.map(item => ({
          name: item[symbolKey],
          value: Number(item[weightKey])
        }));
      }
    }
    
    return samplePortfolio;
  };

  const portfolioData = getPortfolioData();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 md:ml-64">
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-4 md:p-6">
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {!hasData && (
              <div className="col-span-full">
                <FileUpload onDataLoaded={handleDataLoaded} />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard 
                title="Total Value" 
                value="$24,567" 
                change={2.5} 
                icon={<DollarSign className="h-4 w-4" />} 
              />
              <StatsCard 
                title="Daily Return" 
                value="1.2%" 
                change={0.8} 
                icon={<TrendingUp className="h-4 w-4" />} 
              />
              <StatsCard 
                title="Volume" 
                value="1.45M" 
                change={-3.2} 
                icon={<BarChart2 className="h-4 w-4" />} 
              />
              <StatsCard 
                title="Volatility" 
                value="0.89" 
                change={-0.5} 
                icon={<Activity className="h-4 w-4" />} 
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <LineChart 
                data={data} 
                title="Price Performance" 
                xKey={dateKey} 
                lineKeys={numericKeys.slice(0, 2)} 
              />
              <BarChart 
                data={data} 
                title="Volume Analysis" 
                xKey={dateKey} 
                barKeys={[numericKeys[1] || 'volume']} 
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <DonutChart 
                data={portfolioData} 
                title="Portfolio Allocation" 
                valueKey="value" 
                nameKey="name" 
              />
              <AreaChart 
                data={data} 
                title="Cumulative Returns" 
                xKey={dateKey} 
                areaKeys={[numericKeys[2] || 'return']} 
              />
              <GaugeChart 
                title="Performance vs Benchmark" 
                value={65} 
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
