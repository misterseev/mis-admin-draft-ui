'use client'

import { Wallet, Users, TrendingDown, Plus, Eye, FileText, BarChart2, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { StatCard } from '@/components/mis/StatCard'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'

const trendData = [
  { month: 'May',  gross: 1180, net: 1002 },
  { month: 'Jun',  gross: 1195, net: 1015 },
  { month: 'Jul',  gross: 1201, net: 1020 },
  { month: 'Aug',  gross: 1188, net: 1010 },
  { month: 'Sep',  gross: 1210, net: 1030 },
  { month: 'Oct',  gross: 1225, net: 1040 },
  { month: 'Nov',  gross: 1230, net: 1045 },
  { month: 'Dec',  gross: 1258, net: 1068 },
  { month: 'Jan',  gross: 1232, net: 1048 },
  { month: 'Feb',  gross: 1246, net: 1059 },
  { month: 'Mar',  gross: 1239, net: 1052 },
  { month: 'Apr',  gross: 1245, net: 1058 },
]

const deductData = [
  { name: 'Income Tax',       value: 48 },
  { name: 'Social Security',  value: 34 },
  { name: 'Loans',            value: 11 },
  { name: 'Advance',          value: 5  },
  { name: 'Other',            value: 2  },
]
const COLORS = ['#0F766E','#F59E0B','#3B82F6','#8B5CF6','#94A3B8']

const RUNS = [
  { period: '2026-04', type: 'Monthly',  employees: '—',  gross: '—',                net: '—',                status: 'Draft',       approvedBy: '—',            },
  { period: '2026-03', type: 'Monthly',  employees: 340,  gross: 'LAK 1,239,600,000', net: 'LAK 1,052,400,000', status: 'Paid',        approvedBy: 'Dir. Khamthavy' },
  { period: '2026-02', type: 'Monthly',  employees: 338,  gross: 'LAK 1,245,600,000', net: 'LAK 1,058,760,000', status: 'Paid',        approvedBy: 'Dir. Khamthavy' },
  { period: '2026-01', type: 'Monthly',  employees: 338,  gross: 'LAK 1,232,800,000', net: 'LAK 1,047,800,000', status: 'Paid',        approvedBy: 'Dir. Khamthavy' },
  { period: '2025-12', type: 'Year-End', employees: 335,  gross: 'LAK 2,490,000,000', net: 'LAK 2,116,500,000', status: 'Paid',        approvedBy: 'Dir. Khamthavy' },
  { period: '2025-11', type: 'Monthly',  employees: 334,  gross: 'LAK 1,220,000,000', net: 'LAK 1,037,000,000', status: 'Paid',        approvedBy: 'Dir. Khamthavy' },
]

export default function PayrollDashboardPage() {
  return (
    <AppShell breadcrumbs={[{ label: 'Payroll', href: '/admin/payroll' }, { label: 'Dashboard' }]}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-foreground">
            Payroll Dashboard
            <span className="ml-2 text-sm font-normal text-muted-foreground">ພາບລວມເງິນເດືອນ</span>
          </h1>
          <p className="text-xs text-muted-foreground">Payroll management overview and monthly runs · PAY-001</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="2026"><SelectTrigger className="h-8 text-xs w-24"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="2026" className="text-xs">FY 2026</SelectItem></SelectContent>
          </Select>
          <Select defaultValue="04"><SelectTrigger className="h-8 text-xs w-24"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['01','02','03','04','05','06','07','08','09','10','11','12'].map(m => (
                <SelectItem key={m} value={m} className="text-xs">Month {m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" className="h-8 text-xs gap-1">
            <Plus className="w-3.5 h-3.5" />New Payroll Run
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard label="Current Month Gross" labelLao="ເງິນເດືອນລວມ" value="LAK 1,245.6M" icon={Wallet} />
        <StatCard label="Current Month Net" labelLao="ເງິນເດືອນສຸດທິ" value="LAK 1,058.8M" icon={TrendingDown} delta="+0.7%" deltaType="up" />
        <StatCard label="Total Deductions" labelLao="ການຫັກ" value="LAK 186.8M" icon={TrendingDown} deltaLabel="Tax · SS · Loan" />
        <StatCard label="Employees Paid" labelLao="ພະນັກງານທີ່ຈ່າຍ" value="338 / 342" icon={Users} delta="4 pending" deltaType="down" alert />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-4">
        <div className="lg:col-span-3 bg-card border border-border rounded-lg p-4 shadow-sm">
          <p className="text-xs font-semibold mb-3">Monthly Payroll Trend / ທ່າອ່ຽງເງິນເດືອນ</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `LAK ${Number(v)}M`} contentStyle={{ fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="gross" name="Gross" stroke="#0F766E" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="net"   name="Net"   stroke="#F59E0B" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4 shadow-sm">
          <p className="text-xs font-semibold mb-1">Deduction Breakdown</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={deductData} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={2} dataKey="value">
                {deductData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-0.5">
            {deductData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                {d.name} {d.value}%
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Runs table */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden mb-4">
        <div className="px-4 py-2.5 border-b border-border">
          <p className="text-xs font-semibold">Recent Payroll Runs / ການດໍາເນີນເງິນເດືອນ</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Period','Type','Employees','Total Gross','Total Net','Status','Approved By','Actions'].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RUNS.map((r, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-3 py-2 font-mono">{r.period}</td>
                  <td className="px-3 py-2"><StatusBadge status={r.type as 'Monthly' | 'Year-End'} /></td>
                  <td className="px-3 py-2 tabular-nums">{r.employees}</td>
                  <td className="px-3 py-2 tabular-nums">{r.gross}</td>
                  <td className="px-3 py-2 tabular-nums">{r.net}</td>
                  <td className="px-3 py-2"><StatusBadge status={r.status as 'Draft' | 'Paid'} /></td>
                  <td className="px-3 py-2 text-muted-foreground">{r.approvedBy}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      {r.status === 'Draft' ? (
                        <Button size="sm" className="h-6 text-[10px] px-2">Continue</Button>
                      ) : (
                        <>
                          <button className="p-1 hover:bg-muted rounded text-muted-foreground" title="View"><Eye className="w-3 h-3" /></button>
                          <button className="p-1 hover:bg-muted rounded text-muted-foreground" title="Payslip"><FileText className="w-3 h-3" /></button>
                          <button className="p-1 hover:bg-muted rounded text-muted-foreground" title="Report"><BarChart2 className="w-3 h-3" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <p className="text-xs font-semibold mb-3">Upcoming Actions / ການດໍາເນີນການທີ່ຈະມາເຖິງ</p>
          <div className="space-y-2">
            {[
              { icon: AlertCircle, color: 'text-destructive', text: 'Run Apr 2026 payroll (due 25th)' },
              { icon: Clock,       color: 'text-amber-600',  text: 'Year-end settlement preparation (Dec)' },
              { icon: CheckCircle2,color: 'text-emerald-600',text: 'Submit social security report — Q1 2026' },
            ].map((a, i) => {
              const Icon = a.icon
              return (
                <div key={i} className="flex items-center gap-2.5 text-xs">
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${a.color}`} />
                  <span>{a.text}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <p className="text-xs font-semibold mb-3">Quick Links / ທາງລັດ</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              'New Payroll Run', 'Bonus Processing',
              'Year-end Settlement', 'Print Payslips', 'Payroll Statistics',
            ].map(l => (
              <button key={l} className="text-xs text-left px-3 py-2 bg-muted/40 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors border border-border/50 font-medium">
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
