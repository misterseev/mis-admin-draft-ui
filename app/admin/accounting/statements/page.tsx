'use client'

import { useState } from 'react'
import { AppShell } from '@/components/mis/AppShell'
import { ACCOUNTS, getBalance } from '@/lib/stores/accountingStore'

type Tab = 'pl' | 'bs' | 'cf'

const fmt = (v: number, showSign = false) => {
  const abs = `LAK ${Math.abs(v).toLocaleString()}M`
  if (showSign && v < 0) return `(${abs})`
  return abs
}

function SectionHeader({ title, className }: { title: string; className?: string }) {
  return (
    <tr>
      <td colSpan={2} className={`pt-4 pb-1 text-[10px] uppercase font-bold tracking-widest ${className ?? 'text-foreground'}`}>
        {title}
      </td>
    </tr>
  )
}

function LineItem({ label, value, indent = 0, bold = false, topBorder = false, doubleLine = false, negative = false }:
  { label: string; value: number; indent?: number; bold?: boolean; topBorder?: boolean; doubleLine?: boolean; negative?: boolean }) {
  const display = value === 0 ? '—' : fmt(negative ? -value : value)
  return (
    <tr className={`group ${topBorder ? 'border-t border-foreground/20' : ''}`}>
      <td className={`py-0.5 text-xs ${bold ? 'font-bold' : 'font-normal'}`} style={{ paddingLeft: `${indent * 16 + 4}px` }}>
        {label}
      </td>
      <td className={`py-0.5 text-xs tabular-nums text-right ${bold ? 'font-bold' : 'text-muted-foreground'} ${doubleLine ? 'border-t-2 border-b-4 border-double border-foreground' : ''}`}>
        {display}
      </td>
    </tr>
  )
}

function Spacer() { return <tr><td colSpan={2} className="py-1" /></tr> }

export default function StatementsPage() {
  const [tab, setTab] = useState<Tab>('pl')
  const [period, setPeriod] = useState('Q1 FY 2026')

  // Computed values
  const patientRev  = ACCOUNTS.find(a => a.code === '4000')?.balance ?? 0
  const govSubsidy  = ACCOUNTS.find(a => a.code === '4100')?.balance ?? 0
  const otherRev    = ACCOUNTS.find(a => a.code === '4200')?.balance ?? 0
  const totalRev    = patientRev + govSubsidy + otherRev

  const personnel   = ACCOUNTS.find(a => a.code === '5000')?.balance ?? 0
  const medSupply   = ACCOUNTS.find(a => a.code === '5100')?.balance ?? 0
  const utilities   = ACCOUNTS.find(a => a.code === '5200')?.balance ?? 0
  const deprec      = ACCOUNTS.find(a => a.code === '5300')?.balance ?? 0
  const admin       = ACCOUNTS.find(a => a.code === '5400')?.balance ?? 0
  const otherExp    = ACCOUNTS.find(a => a.code === '5500')?.balance ?? 0
  const totalExp    = personnel + medSupply + utilities + deprec + admin + otherExp
  const netIncome   = totalRev - totalExp
  const grossSurplus = patientRev - medSupply - deprec

  const cash        = ACCOUNTS.find(a => a.code === '1000')?.balance ?? 0
  const ar          = ACCOUNTS.find(a => a.code === '1100')?.balance ?? 0
  const inventory   = ACCOUNTS.find(a => a.code === '1200')?.balance ?? 0
  const prepaid     = ACCOUNTS.find(a => a.code === '1300')?.balance ?? 0
  const ppe         = ACCOUNTS.find(a => a.code === '1500')?.balance ?? 0
  const accDep      = ACCOUNTS.find(a => a.code === '1510')?.balance ?? 0
  const totalCurrentAssets = cash + ar + inventory + prepaid
  const totalNonCurrent = ppe + accDep
  const totalAssets = totalCurrentAssets + totalNonCurrent

  const ap          = ACCOUNTS.find(a => a.code === '2000')?.balance ?? 0
  const accrued     = ACCOUNTS.find(a => a.code === '2100')?.balance ?? 0
  const deferred    = ACCOUNTS.find(a => a.code === '2200')?.balance ?? 0
  const ltLoan      = ACCOUNTS.find(a => a.code === '2500')?.balance ?? 0
  const totalCurrentLiab = ap + accrued + deferred
  const totalLiab   = totalCurrentLiab + ltLoan

  const govCap      = ACCOUNTS.find(a => a.code === '3000')?.balance ?? 0
  const retained    = ACCOUNTS.find(a => a.code === '3100')?.balance ?? 0
  const totalEquity = govCap + retained + netIncome
  const totalLE     = totalLiab + totalEquity

  return (
    <AppShell breadcrumbs={[{ label: 'Accounting', href: '/admin/accounting' }, { label: 'Financial Statements' }]}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold">Financial Statements</h1>
          <p className="text-xs text-muted-foreground">Vientiane Provincial Hospital · ACC-004</p>
        </div>
        <div className="flex items-center gap-2">
          {(['Q1 FY 2026','Q2 FY 2026','Q3 FY 2026','FY 2025'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${period === p ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Statement tabs */}
      <div className="flex gap-0 mb-5 border-b border-border">
        {([['pl','Statement of Income'], ['bs','Balance Sheet'], ['cf','Cash Flow']] as [Tab,string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-xs font-semibold border-b-2 transition-colors ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Statement body — columnar financial report format */}
      <div className="max-w-2xl">
        {tab === 'pl' && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Report header */}
            <div className="text-center border-b border-border px-8 py-5 bg-muted/20">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Vientiane Provincial Hospital</p>
              <p className="text-base font-bold mt-1">Statement of Income</p>
              <p className="text-xs text-muted-foreground">For the Period Ended {period}</p>
            </div>
            <div className="px-8 py-4">
              <table className="w-full">
                <tbody>
                  <SectionHeader title="Revenue" className="text-emerald-700" />
                  <LineItem label="Patient Service Revenue" value={patientRev} indent={1} />
                  <LineItem label="Government Subsidy" value={govSubsidy} indent={1} />
                  <LineItem label="Other Income" value={otherRev} indent={1} />
                  <LineItem label="Total Revenue" value={totalRev} bold topBorder />
                  <Spacer />
                  <SectionHeader title="Operating Expenses" className="text-red-700" />
                  <LineItem label="Personnel Costs" value={personnel} indent={1} />
                  <LineItem label="Medical Supplies" value={medSupply} indent={1} />
                  <LineItem label="Utilities" value={utilities} indent={1} />
                  <LineItem label="Depreciation" value={deprec} indent={1} />
                  <LineItem label="Administrative" value={admin} indent={1} />
                  <LineItem label="Other Expenses" value={otherExp} indent={1} />
                  <LineItem label="Total Expenses" value={totalExp} bold topBorder />
                  <Spacer />
                  <LineItem label={netIncome >= 0 ? "Net Surplus" : "Net Deficit"} value={netIncome} bold topBorder doubleLine />
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'bs' && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="text-center border-b border-border px-8 py-5 bg-muted/20">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Vientiane Provincial Hospital</p>
              <p className="text-base font-bold mt-1">Balance Sheet</p>
              <p className="text-xs text-muted-foreground">As at End of {period}</p>
            </div>
            <div className="px-8 py-4">
              <table className="w-full">
                <tbody>
                  <SectionHeader title="Assets" className="text-blue-700" />
                  <LineItem label="Current Assets" value={0} indent={0} bold />
                  <LineItem label="Cash & Cash Equivalents" value={cash} indent={2} />
                  <LineItem label="Accounts Receivable" value={ar} indent={2} />
                  <LineItem label="Inventory" value={inventory} indent={2} />
                  <LineItem label="Prepaid Expenses" value={prepaid} indent={2} />
                  <LineItem label="Total Current Assets" value={totalCurrentAssets} indent={1} bold topBorder />
                  <Spacer />
                  <LineItem label="Non-Current Assets" value={0} indent={0} bold />
                  <LineItem label="Property & Equipment" value={ppe} indent={2} />
                  <LineItem label="Less: Accumulated Depreciation" value={accDep} indent={2} negative />
                  <LineItem label="Net Fixed Assets" value={totalNonCurrent} indent={1} bold topBorder />
                  <Spacer />
                  <LineItem label="Total Assets" value={totalAssets} bold topBorder doubleLine />
                  <Spacer /><Spacer />
                  <SectionHeader title="Liabilities" className="text-red-700" />
                  <LineItem label="Current Liabilities" value={0} indent={0} bold />
                  <LineItem label="Accounts Payable" value={ap} indent={2} />
                  <LineItem label="Accrued Salaries" value={accrued} indent={2} />
                  <LineItem label="Deferred Revenue" value={deferred} indent={2} />
                  <LineItem label="Total Current Liabilities" value={totalCurrentLiab} indent={1} bold topBorder />
                  <Spacer />
                  <LineItem label="Long-term Loans" value={ltLoan} indent={2} />
                  <LineItem label="Total Liabilities" value={totalLiab} bold topBorder />
                  <Spacer />
                  <SectionHeader title="Equity" className="text-purple-700" />
                  <LineItem label="Government Capital" value={govCap} indent={2} />
                  <LineItem label="Retained Earnings" value={retained} indent={2} />
                  <LineItem label="Net Income (Current Year)" value={netIncome} indent={2} />
                  <LineItem label="Total Equity" value={totalEquity} bold topBorder />
                  <Spacer />
                  <LineItem label="Total Liabilities & Equity" value={totalLE} bold topBorder doubleLine />
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'cf' && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="text-center border-b border-border px-8 py-5 bg-muted/20">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Vientiane Provincial Hospital</p>
              <p className="text-base font-bold mt-1">Statement of Cash Flows</p>
              <p className="text-xs text-muted-foreground">For the Period Ended {period} (Indirect Method)</p>
            </div>
            <div className="px-8 py-4">
              <table className="w-full">
                <tbody>
                  <SectionHeader title="Operating Activities" className="text-blue-700" />
                  <LineItem label="Net Surplus / (Deficit)" value={netIncome} indent={1} bold />
                  <LineItem label="Adjustments:" value={0} indent={1} />
                  <LineItem label="Add: Depreciation" value={deprec} indent={2} />
                  <LineItem label="(Increase) in Accounts Receivable" value={-240} indent={2} />
                  <LineItem label="(Increase) in Inventory" value={-84} indent={2} />
                  <LineItem label="Increase in Accounts Payable" value={180} indent={2} />
                  <LineItem label="Net Cash from Operating" value={netIncome + deprec - 240 - 84 + 180} bold topBorder />
                  <Spacer />
                  <SectionHeader title="Investing Activities" className="text-amber-700" />
                  <LineItem label="Purchase of Equipment" value={-850} indent={1} />
                  <LineItem label="Net Cash used in Investing" value={-850} bold topBorder />
                  <Spacer />
                  <SectionHeader title="Financing Activities" className="text-purple-700" />
                  <LineItem label="Government Capital Transfer" value={5200} indent={1} />
                  <LineItem label="Loan Repayment" value={-200} indent={1} />
                  <LineItem label="Net Cash from Financing" value={5000} bold topBorder />
                  <Spacer />
                  <LineItem label="Net Increase in Cash" value={netIncome + deprec - 240 - 84 + 180 - 850 + 5000} bold topBorder />
                  <LineItem label="Opening Cash Balance" value={cash - (netIncome + deprec - 240 - 84 + 180 - 850 + 5000)} indent={1} />
                  <LineItem label="Closing Cash Balance" value={cash} bold topBorder doubleLine />
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
