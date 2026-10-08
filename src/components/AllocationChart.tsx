import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { Holding } from '../types/portfolio';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e', '#06b6d4'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(val);
    
    return (
      <div className="bg-white border border-zinc-200 p-3 rounded-lg shadow-xl animate-tooltip">
        <p className="font-medium text-zinc-900 text-sm mb-1">{data.name}</p>
        <div className="flex gap-4 items-center justify-between text-sm">
          <span className="text-zinc-500">Value:</span>
          <span className="font-semibold tabular-nums text-zinc-900">{formatCurrency(data.value)}</span>
        </div>
        <div className="flex gap-4 items-center justify-between text-sm mt-0.5">
          <span className="text-zinc-500">Allocation:</span>
          <span className="font-semibold tabular-nums text-zinc-900">{data.percentage.toFixed(1)}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function AllocationChart({ holdings }: { holdings: Holding[] }) {
  // 1. Transform the raw holdings data into the format Recharts expects
  const totalPortfolioValue = holdings.reduce((sum, h) => sum + (h.unitsOwned * h.currentPrice), 0);
  
  const chartData = holdings.map(holding => {
    const value = holding.unitsOwned * holding.currentPrice;
    return {
      name: holding.name,
      value: value,
      percentage: totalPortfolioValue > 0 ? (value / totalPortfolioValue) * 100 : 0
    };
  }).filter(item => item.value > 0); // Don't graph empty assets

  // 2. Sort by value descending so the largest slice is always first
  chartData.sort((a, b) => b.value - a.value);

  if (chartData.length === 0) return null;

  return (
    <div className="mt-8 border border-zinc-200 rounded-xl bg-white p-6 shadow-[0_1px_3px_rgb(0,0,0,0.02)] flex flex-col md:flex-row items-center gap-8">
      
      {/* Chart Section */}
     <div className="w-full md:w-1/2 h-64 select-none [&_*]:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60} // This creates the "Donut" hole
              outerRadius={90}
              paddingAngle={2} // Adds professional spacing between slices
              dataKey="value"
              stroke="none" // Removes the default border around slices
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} isAnimationActive={false} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend Section */}
      <div className="w-full md:w-1/2 space-y-3">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4">Asset Allocation</h3>
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }} 
              />
              <span className="text-zinc-600 leading-tight">{entry.name}</span>
            </div>
            <span className="font-medium tabular-nums text-zinc-900">
              {entry.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}