'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Settings } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'
import { Button } from '@/components/ui/button'

const ALLOWANCES = [
  { code: 'ALW-001', name: 'Housing Allowance',          nameLao: 'ເງິນຊ່ວຍຄ່າເຊົ່າ',    type: 'Fixed',   amount: 'LAK 500,000',   taxable: false },
  { code: 'ALW-002', name: 'Transport Allowance',        nameLao: 'ເງິນຊ່ວຍຄ່ານ້ຳມັນ',   type: 'Fixed',   amount: 'LAK 300,000',   taxable: false },
  { code: 'ALW-003', name: 'Medical Allowance',          nameLao: 'ເງິນຊ່ວຍຄ່າປິ່ນປົວ',  type: 'Fixed',   amount: 'LAK 200,000',   taxable: false },
  { code: 'ALW-004', name: 'Position Allowance',         nameLao: 'ເງິນຊ່ວຍຕໍາແໜ່ງ',     type: 'Grade',   amount: '5–20% of base', taxable: true  },
  { code: 'ALW-005', name: 'Night Shift Premium',        nameLao: 'ໂອທີ ກາງຄືນ',          type: 'Per diem', amount: 'LAK 50,000/shift', taxable: true },
  { code: 'ALW-006', name: 'Performance Bonus',          nameLao: 'ໂບນັດປະສິດທິຜົນ',     type: 'Variable', amount: '0–3 months',    taxable: true  },
]

const DEDUCTIONS = [
  { code: 'DED-001', name: 'Social Security (Employee)', nameLao: 'ປະກັນສັງຄົມ (ພະນັກງານ)', rate: '5.5%',   basis: 'Basic Salary' },
  { code: 'DED-002', name: 'Social Security (Employer)', nameLao: 'ປະກັນສັງຄົມ (ນາຍຈ້າງ)', rate: '6.0%',   basis: 'Basic Salary' },
  { code: 'DED-003', name: 'Income Tax (PIT)',           nameLao: 'ອາກອນລາຍໄດ້',           rate: 'Progressive', basis: 'Taxable Income' },
  { code: 'DED-004', name: 'Provident Fund',             nameLao: 'ທຶນສໍາຮອງ',              rate: '3.0%',   basis: 'Basic Salary' },
  { code: 'DED-005', name: 'Loan Repayment',             nameLao: 'ຊໍາລະເງິນກູ້',           rate: 'Variable', basis: 'Fixed Amount' },
]

const TAX_BRACKETS = [
  { bracket: '≤ LAK 1,200,000',                    rate: '0%' },
  { bracket: 'LAK 1,200,001 – 5,000,000',          rate: '5%' },
  { bracket: 'LAK 5,000,001 – 10,000,000',         rate: '10%' },
  { bracket: 'LAK 10,000,001 – 20,000,000',        rate: '15%' },
  { bracket: 'LAK 20,000,001 – 40,000,000',        rate: '20%' },
  { bracket: '> LAK 40,000,000',                   rate: '25%' },
]

export default function PayrollSetupPage() {
  const [tab, setTab] = useState<'allowances' | 'deductions' | 'tax'>('allowances')

  return (
    <AppShell breadcrumbs={[{ label: 'Payroll', href: '/admin/payroll' }, { label: 'Setup' }]}>
      <PageHeader
        title="Payroll Setup"
        titleLao="ການຕັ້ງຄ່າເງິນເດືອນ"
        description="Configure allowances, deductions, and tax brackets · PAY-001"
        primaryAction={{ label: '+ Add Component', icon: <Plus className="w-3.5 h-3.5" /> }}
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-border">
        {(['allowances', 'deductions', 'tax'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-medium capitalize border-b-2 transition-colors ${
              tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'tax' ? 'PIT Tax Brackets' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'allowances' && (
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground">Allowance Components ({ALLOWANCES.length})</p>
            <Settings className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Code','Name','Type','Default Amount','Taxable','Actions'].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALLOWANCES.map(a => (
                <tr key={a.code} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{a.code}</td>
                  <td className="px-3 py-2">
                    <p className="font-medium">{a.name}</p>
                    <p className="text-[10px] text-muted-foreground">{a.nameLao}</p>
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700">{a.type}</span>
                  </td>
                  <td className="px-3 py-2 tabular-nums text-foreground">{a.amount}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] font-medium ${a.taxable ? 'text-red-600' : 'text-emerald-600'}`}>
                      {a.taxable ? 'Taxable' : 'Non-taxable'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary"><Edit className="w-3.5 h-3.5" /></button>
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'deductions' && (
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border">
            <p className="text-xs font-semibold text-foreground">Deduction Components ({DEDUCTIONS.length})</p>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Code','Name','Rate / Amount','Calculation Basis','Actions'].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEDUCTIONS.map(d => (
                <tr key={d.code} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{d.code}</td>
                  <td className="px-3 py-2">
                    <p className="font-medium">{d.name}</p>
                    <p className="text-[10px] text-muted-foreground">{d.nameLao}</p>
                  </td>
                  <td className="px-3 py-2 tabular-nums font-semibold text-primary">{d.rate}</td>
                  <td className="px-3 py-2 text-muted-foreground">{d.basis}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary"><Edit className="w-3.5 h-3.5" /></button>
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'tax' && (
        <div className="max-w-xl">
          <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border">
              <p className="text-xs font-semibold text-foreground">Personal Income Tax Brackets (Lao PDR)</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Effective FY 2026 — Ministry of Finance Regulation</p>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Income Bracket (Monthly)','Tax Rate'].map(h => (
                    <th key={h} className="text-left px-4 py-2 font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TAX_BRACKETS.map((tb, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-4 py-2.5 tabular-nums">{tb.bracket}</td>
                    <td className="px-4 py-2.5">
                      <span className={`font-bold ${tb.rate === '0%' ? 'text-emerald-600' : 'text-primary'}`}>{tb.rate}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 px-1">Source: Ministry of Finance, Lao PDR. Tax computed on monthly taxable income after deductions.</p>
        </div>
      )}
    </AppShell>
  )
}
