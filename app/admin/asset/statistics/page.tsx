'use client'

import { AppShell } from '@/components/mis/AppShell'
import { Progress } from '@/components/ui/progress'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const byCategory = [
  { category: 'Medical Equip.',  count: 42, value: 2420 },
  { category: 'IT Equipment',    count: 88, value: 158  },
  { category: 'Vehicles',        count: 12, value: 620  },
  { category: 'Facility',        count: 85, value: 340  },
  { category: 'Furniture',       count: 120, value: 88  },
]

const depreciationData = [
  { year: '2022', depn: 185 },
  { year: '2023', depn: 210 },
  { year: '2024', depn: 242 },
  { year: '2025', depn: 268 },
  { year: '2026', depn: 145 },
]

const statusPie = [
  { name: 'Active',            value: 1188 },
  { name: 'Under Maintenance', value: 38   },
  { name: 'Disposed',          value: 21   },
]
const PIE_COLORS = ['#0F766E','#F59E0B','#94A3B8']

export default function AssetStatisticsPage() {
  return (
    <AppShell breadcrumbs={[{ label: 'Asset', href: '/admin/asset' }, { label: 'Statistics' }]}>
      <div className="mb-4">
        <h1 className="text-lg font-bold text-foreground">
          Asset Statistics
          <span className="ml-2 text-sm font-normal text-muted-foreground">ສະຖິຕິຊັບສິນ</span>
        </h1>
        <p className="text-xs text-muted-foreground">Asset portfolio analysis and depreciation reporting · AST-004</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Total Assets',         value: '1,247', sub: 'All categories'       },
          { label: 'Gross Asset Value',     value: 'LAK 3,626M', sub: 'At cost'        },
          { label: 'Net Book Value',        value: 'LAK 2,796M', sub: '77% of cost'   },
          { label: 'YTD Depreciation',      value: 'LAK 145M', sub: '6 months FY 2026' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-[10px] text-muted-foreground/60">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-semibold mb-3">Annual Depreciation Charge (LAK Millions)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={depreciationData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v}M`} />
              <Tooltip formatter={(v: number) => `LAK ${v}M`} contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="depn" name="Depreciation" fill="#0F766E" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-semibold mb-2">Asset Status Distribution</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={statusPie} cx="50%" cy="50%" innerRadius={40} outerRadius={64} paddingAngle={3} dataKey="value">
                {statusPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {statusPie.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  {s.name}
                </div>
                <span className="font-semibold text-foreground">{s.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <p className="text-xs font-semibold mb-3">Asset Value by Category (LAK Millions)</p>
        <div className="space-y-3">
          {byCategory.map(({ category, count, value }) => (
            <div key={category} className="flex items-center gap-3">
              <span className="text-xs text-foreground w-32">{category}</span>
              <span className="text-[10px] text-muted-foreground w-12 text-right tabular-nums">{count} pcs</span>
              <Progress value={(value / 2420) * 100} className="h-2 flex-1" />
              <span className="text-xs tabular-nums font-semibold text-foreground w-16 text-right">LAK {value}M</span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
