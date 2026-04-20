'use client'

import { AppShell } from '@/components/mis/AppShell'
import { Progress } from '@/components/ui/progress'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts'

const monthlyPurchase = [
  { month: 'Jan', value: 88.5 }, { month: 'Feb', value: 72.1 },
  { month: 'Mar', value: 95.4 }, { month: 'Apr', value: 101.9 },
]

const categoryStock = [
  { category: 'Medicine',  value: 18.2 },
  { category: 'Surgical',  value: 12.4 },
  { category: 'Lab',       value: 9.6  },
  { category: 'Office',    value: 4.3  },
  { category: 'Cleaning',  value: 3.7  },
]
const CAT_COLORS = ['#0F766E','#F59E0B','#3B82F6','#94A3B8','#8B5CF6']

const topItems = [
  { name: 'Paracetamol 500mg',        turnover: 94 },
  { name: 'Surgical Gloves (M)',       turnover: 87 },
  { name: 'IV Set Infusion',           turnover: 81 },
  { name: 'ORS Sachets',               turnover: 76 },
  { name: 'Amoxicillin 250mg',         turnover: 71 },
]

export default function InventoryStatisticsPage() {
  return (
    <AppShell breadcrumbs={[{ label: 'Inventory', href: '/admin/inventory' }, { label: 'Statistics' }]}>
      <div className="mb-4">
        <h1 className="text-lg font-bold text-foreground">
          Inventory Statistics
          <span className="ml-2 text-sm font-normal text-muted-foreground">ສະຖິຕິສາງ</span>
        </h1>
        <p className="text-xs text-muted-foreground">Procurement spend, stock analysis, and consumption trends · INV-006</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'YTD Procurement Spend', value: 'LAK 357.9M', sub: 'Jan – Apr 2026'    },
          { label: 'Active Suppliers',       value: '14',          sub: '3 preferred vendors' },
          { label: 'Stock Turnover Rate',    value: '82%',         sub: 'FY 2026 target 80%'  },
          { label: 'Expiry Write-offs',      value: 'LAK 2.1M',   sub: 'YTD losses'           },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            <p className="text-[10px] text-muted-foreground/60">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-semibold mb-3">Monthly Procurement Spend — FY 2026 (LAK Millions)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyPurchase} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v}M`} />
              <Tooltip formatter={(v: number) => `LAK ${v}M`} contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="value" name="Spend" fill="#0F766E" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-semibold mb-2">Stock Value by Category (LAK M)</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={categoryStock} cx="50%" cy="50%" outerRadius={64} dataKey="value" paddingAngle={2}>
                {categoryStock.map((_, i) => <Cell key={i} fill={CAT_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `LAK ${v}M`} contentStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-1">
            {categoryStock.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: CAT_COLORS[i] }} />
                  {c.category}
                </div>
                <span className="font-semibold text-foreground">LAK {c.value}M</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <p className="text-xs font-semibold mb-3">Top 5 Items by Stock Turnover Rate</p>
        <div className="space-y-3">
          {topItems.map(({ name, turnover }) => (
            <div key={name} className="flex items-center gap-3">
              <span className="text-xs text-foreground w-48 truncate">{name}</span>
              <Progress value={turnover} className="h-2 flex-1" />
              <span className="text-xs tabular-nums font-semibold text-foreground w-8 text-right">{turnover}%</span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
