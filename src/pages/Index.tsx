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
import { useToast } from '@/hooks/use-toast';
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
      console.log("Sample data:", data[0]);
    } else {
      toast({
        title: "Error",
        description: "No data found in the uploaded file",
        variant: "destructive"
      });
    }
  };

  // Example historical stock data
  const sampleData = [
    { Date: "1999-01-22", "Adj Close": 0.037615169, Close: 0.041016001, High: 0.048827998, Low: 0.038802002, Open: 0.043749999, Volume: 2714688000 },
    { Date: "1999-01-25", "Adj Close": 0.041555878, Close: 0.045313001, High: 0.045832999, Low: 0.041016001, Open: 0.044271, Volume: 510480000 },
    { Date: "1999-01-26", "Adj Close": 0.038331419, Close: 0.041797001, High: 0.046744999, Low: 0.041145999, Open: 0.045832999, Volume: 343200000 },
    { Date: "1999-01-27", "Adj Close": 0.03821218, Close: 0.041666999, High: 0.042969, Low: 0.039583001, Open: 0.041926999, Volume: 244368000 },
    { Date: "1999-01-28", "Adj Close": 0.038092051, Close: 0.041536, High: 0.041926999, Low: 0.041276, Open: 0.041666999, Volume: 227520000 },
    { Date: "1999-01-29", "Adj Close": 0.036300983, Close: 0.039583001, High: 0.041666999, Low: 0.039583001, Open: 0.041536, Volume: 244032000 },
    { Date: "1999-02-01", "Adj Close": 0.037018139, Close: 0.040364999, High: 0.040624999, Low: 0.039583001, Open: 0.039583001, Volume: 154704000 },
    { Date: "1999-02-02", "Adj Close": 0.034152262, Close: 0.037239999, High: 0.040624999, Low: 0.036068, Open: 0.039583001, Volume: 264096000 },
    { Date: "1999-02-03", "Adj Close": 0.034868501, Close: 0.038020998, High: 0.038541999, Low: 0.036458001, Open: 0.036719002, Volume: 75120000 },
    { Date: "1999-02-04", "Adj Close": 0.036778785, Close: 0.040104002, High: 0.041145999, Low: 0.038020998, Open: 0.038541999, Volume: 181920000 }
  ];
  
  const samplePortfolio = [
    { name: 'High', value: 30 },
    { name: 'Low', value: 25 },
    { name: 'Open', value: 23 },
    { name: 'Close', value: 22 },
  ];

  // Helper function to extract data from uploaded stock data or use sample data
  const prepareChartData = () => {
    const dataToUse = hasData && stockData.length > 0 ? stockData : sampleData;
    
    return {
      data: dataToUse,
      dateKey: 'Date',
      numericKeys: ['High', 'Low', 'Open', 'Close', 'Volume', 'Adj Close']
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

  const portfolioData = hasData && stockData.length > 0 ? getPortfolioData() : samplePortfolio;

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
