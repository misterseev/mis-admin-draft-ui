'use client'

import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts'

const headcountByDept = [
  { dept: 'Nursing',        count: 98 },
  { dept: 'Admin',          count: 45 },
  { dept: 'Finance',        count: 28 },
  { dept: 'Pharmacy',       count: 22 },
  { dept: 'Lab',            count: 20 },
  { dept: 'HR',             count: 15 },
  { dept: 'IT',             count: 12 },
  { dept: 'Maintenance',    count: 18 },
  { dept: 'Other',          count: 84 },
]

const genderData = [
  { name: 'Female', value: 198 },
  { name: 'Male',   value: 144 },
]
const GENDER_COLORS = ['#0F766E', '#F59E0B']

const gradeData = [
  { grade: 'P2', count: 62 },
  { grade: 'P3', count: 85 },
  { grade: 'P4', count: 71 },
  { grade: 'P5', count: 52 },
  { grade: 'P6', count: 28 },
  { grade: 'P7', count: 18 },
  { grade: 'S1-S3', count: 26 },
]

const turnoverTrend = [
  { month: 'Jan', hired: 4, resigned: 1 },
  { month: 'Feb', hired: 2, resigned: 2 },
  { month: 'Mar', hired: 6, resigned: 0 },
  { month: 'Apr', hired: 3, resigned: 1 },
  { month: 'May', hired: 1, resigned: 3 },
  { month: 'Jun', hired: 5, resigned: 1 },
  { month: 'Jul', hired: 3, resigned: 2 },
  { month: 'Aug', hired: 4, resigned: 0 },
  { month: 'Sep', hired: 2, resigned: 1 },
  { month: 'Oct', hired: 7, resigned: 0 },
  { month: 'Nov', hired: 3, resigned: 2 },
  { month: 'Dec', hired: 4, resigned: 1 },
]

export default function HRStatisticsPage() {
  return (
    <AppShell breadcrumbs={[{ label: 'Human Resources', href: '/admin/hr/employees' }, { label: 'Statistics' }]}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-foreground">
            HR Statistics
            <span className="ml-2 text-sm font-normal text-muted-foreground">ສະຖິຕິ HR</span>
          </h1>
          <p className="text-xs text-muted-foreground">Workforce analytics and reporting · HRM-005</p>
        </div>
        <Select defaultValue="2026">
          <SelectTrigger className="h-8 text-xs w-24"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2026" className="text-xs">FY 2026</SelectItem>
            <SelectItem value="2025" className="text-xs">FY 2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Total Headcount',  value: '342',  sub: '+5 this month'  },
          { label: 'Avg. Tenure (yr)', value: '4.8',  sub: 'Median 3.2 yrs' },
          { label: 'Turnover Rate',    value: '3.2%', sub: 'YTD FY 2026'    },
          { label: 'On Leave',         value: '6',    sub: '1.8% of staff'  },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        {/* Headcount by dept */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-semibold mb-3">Headcount by Department</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={headcountByDept} layout="vertical" barSize={10}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="dept" type="category" tick={{ fontSize: 10 }} width={72} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="count" name="Headcount" fill="#0F766E" radius={[0,2,2,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender split */}
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-semibold mb-2">Gender Distribution</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={genderData} cx="50%" cy="50%" innerRadius={40} outerRadius={64} paddingAngle={3} dataKey="value">
                {genderData.map((_, i) => <Cell key={i} fill={GENDER_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {genderData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: GENDER_COLORS[i] }} />
                {d.name}: <span className="font-semibold text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Turnover trend */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-semibold mb-3">Hiring vs. Resignations — FY 2026</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={turnoverTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="hired"    name="Hired"     stroke="#0F766E" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="resigned" name="Resigned"  stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grade distribution */}
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-semibold mb-3">Staff by Grade Level</p>
          <div className="space-y-2">
            {gradeData.map(({ grade, count }) => (
              <div key={grade} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-10">{grade}</span>
                <Progress value={(count / 342) * 100} className="h-2 flex-1" />
                <span className="text-xs tabular-nums text-foreground w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
