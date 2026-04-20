'use client'

import { AppShell } from '@/components/mis/AppShell'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from 'recharts'

const monthlyPayroll = [
  { month: 'Jan', gross: 1265.7, deductions: 183.3, net: 1082.4 },
  { month: 'Feb', gross: 1271.9, deductions: 184.2, net: 1087.7 },
  { month: 'Mar', gross: 1289.1, deductions: 186.6, net: 1102.5 },
  { month: 'Apr', gross: 1302.5, deductions: 189.6, net: 1112.9 },
]

const deptCost = [
  { dept: 'Nursing',  cost: 480 },
  { dept: 'Admin',    cost: 220 },
  { dept: 'Finance',  cost: 145 },
  { dept: 'Pharmacy', cost: 118 },
  { dept: 'Lab',      cost: 102 },
  { dept: 'HR',       cost:  78 },
  { dept: 'IT',       cost:  64 },
  { dept: 'Other',    cost:  96 },
]

const deductionBreakdown = [
  { name: 'PIT Tax',       value: 42 },
  { name: 'Social Sec.',   value: 35 },
  { name: 'Provident Fund',value: 18 },
  { name: 'Loan Repay',    value:  5 },
]
const PIE_COLORS = ['#0F766E','#F59E0B','#3B82F6','#94A3B8']

const fmt = (v: number) => `${v.toFixed(1)}M`

export default function PayrollStatisticsPage() {
  return (
    <AppShell breadcrumbs={[{ label: 'Payroll', href: '/admin/payroll' }, { label: 'Statistics' }]}>
      <div className="mb-4">
        <h1 className="text-lg font-bold text-foreground">
          Payroll Statistics
          <span className="ml-2 text-sm font-normal text-muted-foreground">ສະຖິຕິເງິນເດືອນ</span>
        </h1>
        <p className="text-xs text-muted-foreground">Cost analytics and payroll trend reporting · PAY-005</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'YTD Gross Payroll',    value: 'LAK 5,129.2M', sub: 'Jan – Apr 2026' },
          { label: 'YTD Net Payroll',       value: 'LAK 4,385.5M', sub: 'After all deductions' },
          { label: 'Avg. Gross per Person', value: 'LAK 3.81M',    sub: 'Monthly average' },
          { label: 'Payroll/Revenue Ratio', value: '34.2%',         sub: 'FY 2026 target: 35%' },
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
          <p className="text-xs font-semibold mb-3">Monthly Payroll Trend — FY 2026 (LAK Millions)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyPayroll}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={fmt} />
              <Tooltip formatter={(v: number) => `LAK ${v.toFixed(1)}M`} contentStyle={{ fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="gross"      name="Gross"      stroke="#64748B" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="net"        name="Net"        stroke="#0F766E" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="deductions" name="Deductions" stroke="#EF4444" strokeWidth={2} strokeDasharray="4 2" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-semibold mb-2">Deduction Breakdown</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={deductionBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={64} paddingAngle={3} dataKey="value">
                {deductionBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {deductionBreakdown.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  {d.name}
                </div>
                <span className="font-semibold text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <p className="text-xs font-semibold mb-3">Payroll Cost by Department — April 2026 (LAK Millions)</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={deptCost} layout="vertical" barSize={10}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `${v}M`} />
            <YAxis dataKey="dept" type="category" tick={{ fontSize: 10 }} width={72} />
            <Tooltip formatter={(v: number) => `LAK ${v}M`} contentStyle={{ fontSize: 11 }} />
            <Bar dataKey="cost" name="Payroll Cost" fill="#0F766E" radius={[0,2,2,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AppShell>
  )
}
