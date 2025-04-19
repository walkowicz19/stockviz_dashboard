
import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import FileUpload from '@/components/FileUpload';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import DonutChart from '@/components/charts/DonutChart';
import AreaChart from '@/components/charts/AreaChart';
import GaugeChart from '@/components/charts/GaugeChart';
import StatsCard from '@/components/StatsCard';
import { toast } from '@/components/ui/sonner';
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

  // Sample data for initial display
  const sampleData = [
    { Date: "2024-12-20", "Adj Close": 134.6999969, Close: 134.6999969, High: 135.2799988, Low: 128.2200012, Open: 129.8099976, Volume: 306528600 },
    { Date: "2024-12-23", "Adj Close": 139.6699982, Close: 139.6699982, High: 139.7899933, Low: 135.1199951, Open: 136.2799988, Volume: 176053500 },
    { Date: "2024-12-24", "Adj Close": 140.2200012, Close: 140.2200012, High: 141.8999939, Low: 138.6499939, Open: 140, Volume: 105157000 },
    { Date: "2024-12-26", "Adj Close": 139.9299927, Close: 139.9299927, High: 140.8500061, Low: 137.7299957, Open: 139.6999969, Volume: 116205600 },
    { Date: "2024-12-27", "Adj Close": 137.0099945, Close: 137.0099945, High: 139.0200043, Low: 134.7100067, Open: 138.5500031, Volume: 170582600 },
    { Date: "2024-12-30", "Adj Close": 137.4900055, Close: 137.4900055, High: 140.2700043, Low: 134.0200043, Open: 134.8300018, Volume: 167734700 },
    { Date: "2024-12-31", "Adj Close": 134.2899933, Close: 134.2899933, High: 138.0700073, Low: 133.8300018, Open: 138.0299988, Volume: 155659200 },
    { Date: "2025-01-02", "Adj Close": 138.3099976, Close: 138.3099976, High: 138.8800049, Low: 134.6300049, Open: 136, Volume: 198247200 },
    { Date: "2025-01-03", "Adj Close": 144.4700012, Close: 144.4700012, High: 144.8999939, Low: 139.7299957, Open: 140.0099945, Volume: 229322500 },
    { Date: "2025-01-06", "Adj Close": 149.4299927, Close: 149.4299927, High: 152.1600037, Low: 147.8200073, Open: 148.5899963, Volume: 265377400 }
  ];

  const handleDataLoaded = (data: any[]) => {
    if (data && data.length > 0) {
      console.log("Data loaded:", data.length, "rows");
      console.log("First row:", data[0]);
      
      // Convert string numbers to actual numbers
      const processedData = data.map(item => {
        const newItem: StockData = {};
        Object.keys(item).forEach(key => {
          const value = item[key];
          if (typeof value === 'string' && !isNaN(Number(value)) && key !== 'Date' && key !== 'Symbol' && key !== 'Ticker') {
            newItem[key] = Number(value);
          } else {
            newItem[key] = value;
          }
        });
        return newItem;
      });
      
      setStockData(processedData);
      setHasData(true);
      toast.success(`Data loaded successfully! (${data.length} rows)`);
    } else {
      toast.error("No data found in the uploaded file");
    }
  };

  const prepareChartData = () => {
    if (!hasData || stockData.length === 0) {
      return {
        data: sampleData,
        dateKey: 'Date',
        numericKeys: ['High', 'Low', 'Open', 'Close', 'Volume', 'Adj Close']
      };
    }

    const firstRow = stockData[0];
    const keys = Object.keys(firstRow);
    
    // Find date key
    const dateKey = keys.find(key => 
      key.toLowerCase().includes('date') || 
      key.toLowerCase() === 'time' ||
      (typeof firstRow[key] === 'string' && 
        (firstRow[key].includes('-') || firstRow[key].includes('/')) &&
        !isNaN(Date.parse(firstRow[key]))
      )
    ) || keys[0];

    // Find numeric keys for charts
    const numericKeys = keys.filter(key => 
      typeof firstRow[key] === 'number' || 
      (!isNaN(parseFloat(firstRow[key])) && key !== dateKey)
    );

    return {
      data: stockData,
      dateKey,
      numericKeys
    };
  };

  const samplePortfolio = [
    { name: 'High', value: 152.16 },
    { name: 'Low', value: 128.22 },
    { name: 'Open', value: 129.81 },
    { name: 'Close', value: 149.43 }
  ];

  const { data, dateKey, numericKeys } = prepareChartData();

  const getPortfolioData = () => {
    if (hasData && stockData.length > 0) {
      const keys = Object.keys(stockData[0]);
      
      // Try to find symbol and weight keys
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
      
      // If we have both keys, use them
      if (symbolKey && weightKey) {
        return stockData.map(item => ({
          name: item[symbolKey],
          value: Number(item[weightKey])
        }));
      }
      
      // Fallback: Use the last date's values for keys like High, Low, Open, Close
      const lastRow = stockData[stockData.length - 1];
      const relevantKeys = ['high', 'low', 'open', 'close'].filter(key => 
        keys.some(k => k.toLowerCase() === key || k.toLowerCase().includes(key))
      );
      
      if (relevantKeys.length > 0) {
        return relevantKeys.map(key => {
          const actualKey = keys.find(k => k.toLowerCase() === key || k.toLowerCase().includes(key));
          return {
            name: actualKey || key,
            value: actualKey ? Number(lastRow[actualKey]) : 0
          };
        });
      }
    }
    
    // Default portfolio data
    return samplePortfolio;
  };

  const portfolioData = getPortfolioData();

  // Get latest values for stats cards
  const getLatestValue = (key: string) => {
    if (hasData && stockData.length > 0) {
      const lastRow = stockData[stockData.length - 1];
      const matchingKey = Object.keys(lastRow).find(k => 
        k.toLowerCase() === key.toLowerCase() || 
        k.toLowerCase().includes(key.toLowerCase())
      );
      
      if (matchingKey) {
        return lastRow[matchingKey];
      }
    }
    return null;
  };

  // Get volume for stats card
  const getVolume = () => {
    const volume = getLatestValue('volume');
    if (volume !== null) {
      return `${(Number(volume) / 1000000).toFixed(2)}M`;
    }
    return "1.45M"; // Default
  };

  // Get price for stats card
  const getPrice = () => {
    const close = getLatestValue('close');
    if (close !== null) {
      return `$${Number(close).toLocaleString()}`;
    }
    return "$24,567"; // Default
  };

  useEffect(() => {
    if (hasData) {
      console.log("Chart data prepared:", { dateKey, numericKeys });
    }
  }, [hasData, stockData]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 md:ml-64">
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-4 md:p-6">
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            <div className="col-span-full">
              <FileUpload onDataLoaded={handleDataLoaded} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard 
                title="Total Value" 
                value={hasData ? getPrice() : "$24,567"}
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
                value={hasData ? getVolume() : "1.45M"}
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
                barKeys={[numericKeys.find(key => key.toLowerCase().includes('volume')) || numericKeys[1]]} 
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
