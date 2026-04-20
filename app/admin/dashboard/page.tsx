'use client'

import { Users, Wallet, Target, Bell, Package, Building2, RefreshCw, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { StatCard } from '@/components/mis/StatCard'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'

const budgetData = [
  { dept: 'HR',       budget: 5200, actual: 3800 },
  { dept: 'Finance',  budget: 1400, actual: 900  },
  { dept: 'Ops',      budget: 2100, actual: 1750 },
  { dept: 'Med Sup',  budget: 3800, actual: 2900 },
  { dept: 'IT',       budget: 800,  actual: 540  },
  { dept: 'Facility', budget: 1200, actual: 810  },
]

const expenseData = [
  { name: 'Payroll',   value: 45 },
  { name: 'Supplies',  value: 20 },
  { name: 'Assets',    value: 15 },
  { name: 'Utilities', value: 10 },
  { name: 'Other',     value: 10 },
]
const EXPENSE_COLORS = ['#0F766E', '#F59E0B', '#3B82F6', '#8B5CF6', '#94A3B8']

const pendingApprovals = [
  { type: 'Purchase', ref: 'PO-2026-0142', requester: 'Noy K.', amount: 'LAK 8,500,000',   date: '18/04/2026' },
  { type: 'Budget',   ref: 'BGT-2026-041', requester: 'Vilay S.', amount: 'LAK 45,000,000', date: '17/04/2026' },
  { type: 'Leave',    ref: 'LV-2026-0088', requester: 'Khamla B.', amount: '—',              date: '17/04/2026' },
  { type: 'Journal',  ref: 'JE-2026-0458', requester: 'Somsak P.', amount: 'LAK 3,500,000', date: '16/04/2026' },
  { type: 'Purchase', ref: 'PO-2026-0139', requester: 'Phonsa L.', amount: 'LAK 12,200,000',date: '15/04/2026' },
]

const activities = [
  { icon: CheckCircle2, color: 'text-emerald-600', text: 'Purchase Order PO-2026-0142 approved by Mr. Somsak', time: '10 min ago' },
  { icon: Clock,        color: 'text-blue-600',    text: 'Payroll Run Feb 2026 posted to General Ledger',      time: '2 hrs ago'  },
  { icon: Users,        color: 'text-primary',     text: 'New employee Ms. Noy Silavong registered (EMP-2026-0338)', time: '3 hrs ago' },
  { icon: AlertTriangle, color:'text-amber-600',   text: 'Budget BGT-MED-042 reached 88% utilization',        time: 'Yesterday'  },
  { icon: Package,      color: 'text-purple-600',  text: 'Stock received: 500 Surgical Gloves (Box) — INV-2026-0071', time: 'Yesterday' },
]

const typeColors: Record<string, string> = {
  Purchase: 'bg-blue-50 text-blue-700',
  Budget:   'bg-purple-50 text-purple-700',
  Leave:    'bg-amber-50 text-amber-700',
  Journal:  'bg-slate-100 text-slate-700',
}

export default function DashboardPage() {
  return (
    <AppShell breadcrumbs={[{ label: 'Dashboard' }]}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-foreground">
            Operational Dashboard
            <span className="ml-2 text-sm font-normal text-muted-foreground">ພາບລວມການດຳເນີນງານ</span>
          </h1>
          <p className="text-xs text-muted-foreground">Real-time hospital administrative performance overview · SYS-007</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="2026">
            <SelectTrigger className="h-8 text-xs w-24"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2026" className="text-xs">FY 2026</SelectItem>
              <SelectItem value="2025" className="text-xs">FY 2025</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="month">
            <SelectTrigger className="h-8 text-xs w-28"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="month" className="text-xs">This Month</SelectItem>
              <SelectItem value="q1" className="text-xs">Q1 2026</SelectItem>
              <SelectItem value="ytd" className="text-xs">YTD</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <RefreshCw className="w-3 h-3" />
            Refresh
            <span className="text-muted-foreground hidden sm:inline">· 2 min ago</span>
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">
        <StatCard label="Total Employees" labelLao="ພະນັກງານທັງໝົດ" value="342" icon={Users} delta="+5 this month" deltaType="up" />
        <StatCard label="Monthly Payroll" labelLao="ເງິນເດືອນ" value="LAK 1,245.6M" icon={Wallet} delta="+2.3%" deltaType="up" />
        <StatCard label="Budget Utilization" labelLao="ການໃຊ້ງົບ" value="68%" icon={Target}>
          <Progress value={68} className="h-1.5" />
        </StatCard>
        <StatCard label="Pending Approvals" labelLao="ລໍຖ້າ" value="14" icon={Bell} delta="High" deltaType="down" alert />
        <StatCard label="Inventory Value" labelLao="ມູນຄ່າ" value="LAK 890.5M" icon={Package} delta="Stable" deltaType="neutral" />
        <StatCard label="Active Assets" labelLao="ຊັບສິນ" value="1,247" icon={Building2} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-4">
        {/* Bar chart */}
        <div className="lg:col-span-3 bg-card border border-border rounded-lg p-4 shadow-sm">
          <p className="text-xs font-semibold text-foreground mb-1">Budget vs Actual — FY 2026</p>
          <p className="text-[10px] text-muted-foreground mb-3">By department (LAK millions)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={budgetData} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="dept" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `LAK ${Number(v).toLocaleString()}M`} contentStyle={{ fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="budget" name="Planned" fill="#0F766E" opacity={0.4} radius={[2,2,0,0]} />
              <Bar dataKey="actual"  name="Actual"  fill="#0F766E" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Donut */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4 shadow-sm">
          <p className="text-xs font-semibold text-foreground mb-1">Expense Distribution</p>
          <p className="text-[10px] text-muted-foreground mb-1">Current fiscal year</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={expenseData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={2} dataKey="value">
                {expenseData.map((_, i) => <Cell key={i} fill={EXPENSE_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-1">
            {expenseData.map((e, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: EXPENSE_COLORS[i] }} />
                {e.name} {e.value}%
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        {/* Pending Approvals */}
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground">Pending Approvals <span className="text-muted-foreground">ລໍຖ້າການອະນຸມັດ</span></p>
            <span className="text-[10px] text-muted-foreground">14 total</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-3 py-1.5 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-3 py-1.5 font-medium text-muted-foreground">Reference</th>
                <th className="text-left px-3 py-1.5 font-medium text-muted-foreground hidden md:table-cell">Requester</th>
                <th className="text-right px-3 py-1.5 font-medium text-muted-foreground">Amount</th>
                <th className="px-3 py-1.5"></th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-1.5">
                    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${typeColors[row.type]}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 font-mono text-[10px] text-muted-foreground">{row.ref}</td>
                  <td className="px-3 py-1.5 hidden md:table-cell">{row.requester}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{row.amount}</td>
                  <td className="px-3 py-1.5">
                    <button className="text-primary hover:underline text-[10px]">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Activities */}
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border">
            <p className="text-xs font-semibold text-foreground">Recent Activities <span className="text-muted-foreground">ກິດຈະກຳລ່າສຸດ</span></p>
          </div>
          <div className="divide-y divide-border/50">
            {activities.map((a, i) => {
              const Icon = a.icon
              return (
                <div key={i} className="flex items-start gap-3 px-4 py-2.5">
                  <div className={`mt-0.5 flex-shrink-0 ${a.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-snug">{a.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Alert strip */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <p className="text-xs text-amber-800 flex-1">
          <span className="font-semibold">3 assets</span> require maintenance this week.{' '}
          <span className="font-semibold">5 budget items</span> approaching 90% utilization.
        </p>
        <button className="text-xs text-amber-700 font-semibold hover:underline whitespace-nowrap">
          View Details
        </button>
      </div>
    </AppShell>
  )
}
