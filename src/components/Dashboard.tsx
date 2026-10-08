import { useState } from 'react';
import { mockHoldings } from '../data/mockData';
import type { Holding, AssetCategory } from '../types/portfolio';
import { useLocalStorage } from '../hooks/useLocalStorage'; 
import AllocationChart from './AllocationChart';

export default function Dashboard() {
  // 'portfolio_data' is the unique key the browser uses to save this specific data
  const [holdings, setHoldings] = useLocalStorage<Holding[]>('portfolio_data', mockHoldings);
  
  // 2. State for the "Add Investment" form
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<AssetCategory>('MARKET_TRADED');
  const [newValue, setNewValue] = useState('');
  const [newYield, setNewYield] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Business Logic: Now calculating from 'holdings' state, not the static mock data
  const totalValue = holdings.reduce((sum, holding) => sum + (holding.unitsOwned * holding.currentPrice), 0);
  
  const totalAnnualIncome = holdings.reduce((sum, holding) => {
    const holdingValue = holding.unitsOwned * holding.currentPrice;
    return sum + (holdingValue * (holding.yieldRate / 100));
  }, 0);

  const blendedYield = totalValue > 0 ? (totalAnnualIncome / totalValue) * 100 : 0;

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(val);
  const formatPercent = (val: number) => `${val.toFixed(2)}%`;

  // Form submission handler
  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from refreshing on submit

    if (!newName || !newValue || !newYield) return; // Basic validation

    const newHolding: Holding = {
      id: crypto.randomUUID(), // Generates a standard unique ID
      name: newName,
      category: newCategory,
      unitsOwned: 1, // Simplifying: treating the input value as 1 unit at X price for now
      averageCostBasis: Number(newValue),
      currentPrice: Number(newValue),
      yieldRate: Number(newYield),
      payoutFrequency: 'ANNUALLY',
    };

    // Immutable state update
    setHoldings([...holdings, newHolding]);

    // Reset form
    setNewName('');
    setNewValue('');
    setNewYield('');
  };

  const confirmDelete = () => {
    if (!deletingId) return;
    
    // Create a new array containing everything EXCEPT the item with the matching ID
    const updatedHoldings = holdings.filter(holding => holding.id !== deletingId);
    setHoldings(updatedHoldings);
    
    // Close the modal
    setDeletingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-10 font-sans text-zinc-900">
      
      {/* RESTORED TITLE & OVERSIZED HERO */}
      <div className="mb-16 pt-8">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-400 mb-6">Portfolio Dashboard</h1>
        <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-3">
          Total Net Worth
        </p>
        <h1 className="text-7xl font-bold tracking-tighter tabular-nums text-zinc-950">
          {formatCurrency(totalValue)}
        </h1>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 border-t border-zinc-200 pt-8">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
             <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Annual Yield</p>
          </div>
          <p className="text-3xl font-semibold tracking-tight tabular-nums text-emerald-600">
            +{formatCurrency(totalAnnualIncome)}
          </p>
        </div>

        <div>
           <div className="flex items-center gap-2 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
             <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Blended Rate</p>
          </div>
          <p className="text-3xl font-semibold tracking-tight tabular-nums text-blue-600">
            {formatPercent(blendedYield)}
          </p>
        </div>
      </div>

      {/* ADD INVESTMENT FORM */}
      <div className="mb-8 p-6 bg-zinc-50 border border-zinc-200 rounded-xl">
        <h2 className="text-sm font-semibold mb-4">Add New Investment</h2>
        <form onSubmit={handleAddHolding} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Asset Name</label>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. ASM 3" className="w-full h-10 px-3 border border-zinc-300 rounded-md text-sm" />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Category</label>
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as AssetCategory)} className="w-full h-10 px-3 border border-zinc-300 rounded-md text-sm bg-white">
              <option value="MARKET_TRADED">Market Traded</option>
              <option value="FIXED_FUND">Fixed Fund</option>
              <option value="CASH_SAVINGS">Cash Savings</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Total Value (RM)</label>
            <input type="number" value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="1000" className="w-full h-10 px-3 border border-zinc-300 rounded-md text-sm" />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Yield (%)</label>
            <div className="flex gap-2">
              <input type="number" step="0.01" value={newYield} onChange={(e) => setNewYield(e.target.value)} placeholder="4.5" className="w-full h-10 px-3 border border-zinc-300 rounded-md text-sm" />
              <button type="submit" className="h-10 bg-zinc-900 text-white px-4 rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors">Add</button>
            </div>
          </div>
        </form>
      </div>

      {/* Holdings Table */}
      <div className="border border-zinc-200 rounded-xl bg-white overflow-hidden shadow-[0_1px_3px_rgb(0,0,0,0.02)]">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/50">
              <th className="py-3 px-5 font-medium text-zinc-500">Asset</th>
              <th className="py-3 px-5 font-medium text-zinc-500">Type</th>
              <th className="py-3 px-5 font-medium text-zinc-500 text-right">Allocation</th>
              <th className="py-3 px-5 font-medium text-zinc-500 text-right">Yield</th>
              <th className="py-3 px-5 font-medium text-zinc-500 text-right">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {holdings.map((holding) => (
              <tr key={holding.id} className="hover:bg-zinc-50/80 transition-colors group">
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-zinc-900">{holding.name}</p>
                    {holding.ticker && (
                      <span className="text-[10px] font-mono bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded border border-zinc-200">
                        {holding.ticker}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-5">
                  <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-md">
                    {holding.category.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-4 px-5 text-right font-medium tabular-nums text-zinc-900">
                  {formatCurrency(holding.unitsOwned * holding.currentPrice)}
                </td>
                <td className="py-4 px-5 text-right font-medium tabular-nums text-emerald-600">
                  {formatPercent(holding.yieldRate)}
                </td>
                <td className="py-4 px-5 text-right">
                   <button 
                     onClick={() => setDeletingId(holding.id)}
                     className="text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors">
                      Remove
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AllocationChart holdings={holdings} />

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Remove Investment</h3>
            <p className="text-sm text-zinc-500 mb-6">
              Are you sure you want to remove this asset from your portfolio? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
              >
                Yes, remove it
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}