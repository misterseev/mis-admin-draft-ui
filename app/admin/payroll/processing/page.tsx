'use client'

import { ArrowLeft, AlertTriangle, AlertCircle, CheckCircle2, Eye, Edit, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/mis/AppShell'
import { WorkflowStepper, type Step } from '@/components/mis/WorkflowStepper'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { ApprovalPanel } from '@/components/mis/ApprovalPanel'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/mis/StatCard'
import { Calendar, Users, Wallet, TrendingDown } from 'lucide-react'

const STEPS: Step[] = [
  { label: 'Setup',     status: 'completed' },
  { label: 'Calculate', status: 'current'   },
  { label: 'Review',    status: 'upcoming'  },
  { label: 'Approve',   status: 'upcoming'  },
  { label: 'Pay',       status: 'upcoming'  },
  { label: 'Posted',    status: 'upcoming'  },
]

const ROWS = [
  { code:'EMP-2024-0142', nameEn:'Somsak Phommachanh',  nameLao:'ທ້າວ ສົມສັກ',   dept:'Finance', basic:8_500_000,  allow:2_100_000, deduct:1_060_000, net:9_540_000,  warn:null },
  { code:'EMP-2023-0098', nameEn:'Noy Silavong',         nameLao:'ນາງ ນ້ອຍ',        dept:'HR',      basic:6_800_000,  allow:1_650_000, deduct:850_000,  net:7_600_000,  warn:null },
  { code:'EMP-2022-0055', nameEn:'Khamla Boupha',        nameLao:'ນາງ ຄຳລາ',        dept:'Nursing', basic:9_200_000,  allow:2_300_000, deduct:1_150_000, net:10_350_000, warn:null },
  { code:'EMP-2021-0033', nameEn:'Vilay Sengdara',       nameLao:'ທ້າວ ວິໄລ',       dept:'Admin',   basic:5_500_000,  allow:1_200_000, deduct:680_000,  net:6_020_000,  warn:null },
  { code:'EMP-2020-0019', nameEn:'Phonsa Luangrath',     nameLao:'ນາງ ຜອນສາ',       dept:'Pharmacy',basic:7_800_000,  allow:1_900_000, deduct:970_000,  net:8_730_000,  warn:null },
  { code:'EMP-2019-0012', nameEn:'Bounmy Keovixay',      nameLao:'ທ້າວ ບຸນມີ',      dept:'Lab',     basic:6_200_000,  allow:1_550_000, deduct:780_000,  net:6_970_000,  warn:null },
  { code:'EMP-2018-0008', nameEn:'Dalavanh Phommavong',  nameLao:'ນາງ ດາລາວັນ',    dept:'Finance', basic:6_200_000,  allow:1_550_000, deduct:8_100_000, net:-350_000, warn:'error'  },
  { code:'EMP-2024-0201', nameEn:'Sombath Inthavong',    nameLao:'ທ້າວ ສົມບັດ',     dept:'IT',      basic:4_800_000,  allow:1_100_000, deduct:600_000,  net:5_300_000,  warn:'nobank' },
  { code:'EMP-2017-0005', nameEn:'Khamthavy Vongsavan',  nameLao:'ນາງ ຄຳທາວີ',      dept:'Admin',   basic:15_000_000, allow:3_750_000, deduct:1_875_000, net:16_875_000, warn:null },
  { code:'EMP-2016-0003', nameEn:'Souliya Phetsomphou',  nameLao:'ທ້າວ ສູລິຍາ',     dept:'Nursing', basic:6_500_000,  allow:1_625_000, deduct:812_500,  net:7_312_500,  warn:null },
  { code:'EMP-2023-0115', nameEn:'Bouavanh Douangchanh', nameLao:'ນາງ ບົວວັນ',      dept:'Finance', basic:6_000_000,  allow:1_500_000, deduct:750_000,  net:6_750_000,  warn:'nobank' },
  { code:'EMP-2019-0025', nameEn:'Ketsana Phommasack',   nameLao:'ທ້າວ ເກດສະໜາ',  dept:'IT',      basic:7_500_000,  allow:1_875_000, deduct:937_500,  net:8_437_500,  warn:null },
  { code:'EMP-2024-0188', nameEn:'Naphaphone Oudomvilay',nameLao:'ນາງ ນ້ຳຜ້ອນ',    dept:'HR',      basic:4_500_000,  allow:1_100_000, deduct:560_000,  net:5_040_000,  warn:null },
  { code:'EMP-2022-0077', nameEn:'Thongkham Phommasith', nameLao:'ທ້າວ ທອງຄຳ',    dept:'Admin',   basic:3_800_000,  allow:950_000,  deduct:475_000,  net:4_275_000,  warn:null },
  { code:'EMP-2020-0044', nameEn:'Sengphet Southida',    nameLao:'ນາງ ແສງເພັດ',    dept:'Nursing', basic:7_200_000,  allow:1_800_000, deduct:900_000,  net:8_100_000,  warn:null },
]

function fmt(n: number) {
  if (n < 0) return <span className="text-destructive tabular-nums">({Math.abs(n).toLocaleString()})</span>
  return <span className="tabular-nums">{n.toLocaleString()}</span>
}

export default function PayrollProcessingPage() {
  const totals = ROWS.reduce(
    (acc, r) => ({ basic: acc.basic + r.basic, allow: acc.allow + r.allow, deduct: acc.deduct + r.deduct, net: acc.net + r.net }),
    { basic: 0, allow: 0, deduct: 0, net: 0 }
  )

  return (
    <AppShell breadcrumbs={[
      { label: 'Payroll', href: '/admin/payroll' },
      { label: 'Processing', href: '/admin/payroll/processing' },
      { label: 'PR-2026-02-001' },
    ]}>
      {/* Back + header */}
      <div className="flex items-center gap-3 mb-3">
        <Link href="/admin/payroll">
          <Button variant="outline" size="sm" className="h-8 px-2"><ArrowLeft className="w-3.5 h-3.5" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base font-bold">Monthly Payroll — February 2026</h1>
            <span className="text-xs text-muted-foreground">ເງິນເດືອນປະຈຳເດືອນ</span>
            <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">PR-2026-02-001</span>
            <StatusBadge status="Calculating" />
          </div>
          <p className="text-[10px] text-muted-foreground">PAY-004</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-card border border-border rounded-lg p-4 mb-4">
        <WorkflowStepper steps={STEPS} />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard label="Period" value="Feb 2026" icon={Calendar} deltaLabel="01/02 – 28/02" />
        <StatCard label="Employees Included" value="338 / 342" icon={Users} delta="4 excluded" deltaType="neutral" />
        <StatCard label="Total Gross" value="LAK 1,245.6M" icon={Wallet} />
        <StatCard label="Total Net" value="LAK 1,058.8M" icon={TrendingDown} />
      </div>

      {/* Main split */}
      <div className="flex gap-4 min-h-0">
        {/* Left table */}
        <div className="flex-1 min-w-0">
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {['Code','Name / ຊື່','Dept','Basic Salary','Allowances','Deductions','Net Salary','','Actions'].map(h => (
                      <th key={h} className="text-left px-2 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map(r => (
                    <tr key={r.code} className={`border-b border-border/50 hover:bg-muted/20 ${r.warn === 'error' ? 'bg-red-50/30' : r.warn === 'nobank' ? 'bg-amber-50/30' : ''}`}>
                      <td className="px-2 py-1.5 font-mono text-[10px] text-muted-foreground">{r.code}</td>
                      <td className="px-2 py-1.5">
                        <p className="font-medium">{r.nameEn}</p>
                        <p className="text-[10px] text-muted-foreground">{r.nameLao}</p>
                      </td>
                      <td className="px-2 py-1.5 text-muted-foreground">{r.dept}</td>
                      <td className="px-2 py-1.5 tabular-nums text-right">{r.basic.toLocaleString()}</td>
                      <td className="px-2 py-1.5 tabular-nums text-right">{r.allow.toLocaleString()}</td>
                      <td className="px-2 py-1.5 tabular-nums text-right">{r.deduct.toLocaleString()}</td>
                      <td className="px-2 py-1.5 text-right">{fmt(r.net)}</td>
                      <td className="px-2 py-1.5">
                        {r.warn === 'error'  && <AlertCircle className="w-3.5 h-3.5 text-destructive" title="Negative net salary" />}
                        {r.warn === 'nobank' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" title="Missing bank account" />}
                      </td>
                      <td className="px-2 py-1.5">
                        <div className="flex items-center gap-0.5">
                          <button className="p-1 hover:bg-muted rounded text-muted-foreground" title="View Payslip"><Eye className="w-3 h-3" /></button>
                          <button className="p-1 hover:bg-muted rounded text-muted-foreground" title="Edit"><Edit className="w-3 h-3" /></button>
                          <button className="p-1 hover:bg-muted rounded text-muted-foreground" title="Recalculate"><RotateCcw className="w-3 h-3" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/40 font-semibold border-t-2 border-border">
                    <td className="px-2 py-2 text-xs" colSpan={3}>Totals (LAK)</td>
                    <td className="px-2 py-2 tabular-nums text-right text-xs">{totals.basic.toLocaleString()}</td>
                    <td className="px-2 py-2 tabular-nums text-right text-xs">{totals.allow.toLocaleString()}</td>
                    <td className="px-2 py-2 tabular-nums text-right text-xs">{totals.deduct.toLocaleString()}</td>
                    <td className="px-2 py-2 tabular-nums text-right text-xs text-primary">{totals.net.toLocaleString()}</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-64 flex-shrink-0 space-y-3">
          {/* Settings */}
          <div className="bg-card border border-border rounded-lg p-3 text-xs">
            <p className="font-semibold text-foreground mb-2 uppercase tracking-wide text-[10px]">Calculation Settings</p>
            <div className="space-y-1.5">
              {[
                ['Include Overtime', 'Yes'],
                ['Tax Method', 'Progressive (LAO 2024)'],
                ['SS Rate Employee', '5.5%'],
                ['SS Rate Employer', '6.0%'],
                ['Pay Date', '25/02/2026'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3 h-7 text-xs">
              <RotateCcw className="w-3 h-3" />Recalculate All
            </Button>
          </div>

          {/* Allowances */}
          <div className="bg-card border border-border rounded-lg p-3 text-xs">
            <p className="font-semibold mb-2 uppercase tracking-wide text-[10px]">Allowances &amp; Deductions</p>
            <p className="text-muted-foreground mb-1">Allowance codes (4): Position, Transport, Meal, Hardship</p>
            <p className="text-muted-foreground">Deduction codes (3): Income Tax, Social Security, Staff Loan</p>
            <button className="text-primary hover:underline text-[10px] mt-1">Manage Codes →</button>
          </div>

          {/* Warnings */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
            <p className="font-semibold text-amber-800 mb-2 uppercase tracking-wide text-[10px]">Warnings (4)</p>
            <div className="space-y-1.5 text-amber-700">
              <div className="flex gap-1.5"><AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" /><span>2 employees missing bank accounts (Sombath I., Bouavanh D.)</span></div>
              <div className="flex gap-1.5"><AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5 text-destructive" /><span className="text-destructive">1 employee negative net salary (Dalavanh P.)</span></div>
              <div className="flex gap-1.5"><AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" /><span>1 employee not yet on payroll system</span></div>
            </div>
            <button className="text-amber-700 hover:underline text-[10px] mt-2 font-medium">Review All →</button>
          </div>

          {/* Approval */}
          <ApprovalPanel
            entries={[
              { actor: 'Noy Silavong', role: 'Payroll Officer', action: 'submitted', date: '18/04/2026 09:14' },
              { actor: 'Khamla Boupha', role: 'Finance Manager', action: 'pending' },
              { actor: 'Dir. Khamthavy', role: 'Hospital Director', action: 'pending' },
            ]}
          />
        </div>
      </div>

      {/* Sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-2 flex items-center justify-end gap-2 z-20">
        <Button variant="ghost" size="sm" className="text-xs h-8">Cancel</Button>
        <Button variant="outline" size="sm" className="text-xs h-8">Save Draft</Button>
        <Button variant="outline" size="sm" className="text-xs h-8 gap-1">
          <RotateCcw className="w-3 h-3" />Recalculate
        </Button>
        <Button size="sm" className="text-xs h-8">Submit for Approval</Button>
      </div>
      <div className="h-12" />
    </AppShell>
  )
}
