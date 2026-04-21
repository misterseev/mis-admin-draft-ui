'use client'

import { useState } from 'react'
import { ChevronRight, Plus, Search } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { ACCOUNTS, Account, AccountClass, getBalance } from '@/lib/stores/accountingStore'
import { Input } from '@/components/ui/input'

const CLASS_ORDER: AccountClass[] = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense']
const CLASS_META: Record<AccountClass, { color: string; bg: string; prefix: string; nature: string }> = {
  Asset:     { color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',    prefix: '1xxx', nature: 'Debit normal'  },
  Liability: { color: 'text-red-700',     bg: 'bg-red-50 border-red-200',      prefix: '2xxx', nature: 'Credit normal' },
  Equity:    { color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-200',prefix: '3xxx', nature: 'Credit normal' },
  Revenue:   { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200',prefix:'4xxx',nature: 'Credit normal' },
  Expense:   { color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',  prefix: '5xxx', nature: 'Debit normal'  },
}

function fmt(v: number) { return `LAK ${Math.abs(v).toLocaleString()}M` }

export default function AccountingMasterPage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['Asset']))
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')

  const toggle = (cls: string) => setExpanded(s => {
    const n = new Set(s); n.has(cls) ? n.delete(cls) : n.add(cls); return n
  })
  const toggleGroup = (g: string) => setExpandedGroups(s => {
    const n = new Set(s); n.has(g) ? n.delete(g) : n.add(g); return n
  })

  const totalAssets = getBalance(ACCOUNTS, 'Asset')
  const totalLiab   = getBalance(ACCOUNTS, 'Liability')
  const totalEquity = getBalance(ACCOUNTS, 'Equity')
  const totalRev    = getBalance(ACCOUNTS, 'Revenue')
  const totalExp    = getBalance(ACCOUNTS, 'Expense')
  const netIncome   = totalRev - totalExp

  const filtered = (cls: AccountClass, group: string) =>
    ACCOUNTS.filter(a => a.class === cls && a.group === group && (
      !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.code.includes(search)
    ))

  return (
    <AppShell breadcrumbs={[{ label: 'Accounting', href: '/admin/accounting' }, { label: 'Chart of Accounts' }]}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold">Chart of Accounts</h1>
          <p className="text-xs text-muted-foreground">Double-entry ledger · FY 2026 · {ACCOUNTS.length} accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input className="pl-8 h-8 text-xs w-52" placeholder="Search account..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            <Plus className="w-3.5 h-3.5" />Add Account
          </button>
        </div>
      </div>

      {/* Accounting equation ribbon */}
      <div className="grid grid-cols-5 gap-0 mb-5 bg-card border border-border rounded-xl overflow-hidden text-xs">
        {[
          { label: 'Total Assets',    value: fmt(totalAssets),  note: 'Debit balance',  cls: 'border-l-4 border-l-blue-500'    },
          { label: 'Total Liabilities',value: fmt(totalLiab),  note: 'Credit balance', cls: 'border-l border-border border-l-4 border-l-red-400'    },
          { label: 'Total Equity',    value: fmt(totalEquity),  note: 'Credit balance', cls: 'border-l border-border border-l-4 border-l-purple-400'  },
          { label: 'Net Income (YTD)',  value: fmt(netIncome),  note: `Rev ${fmt(totalRev)} − Exp ${fmt(totalExp)}`, cls: `border-l border-border border-l-4 ${netIncome >= 0 ? 'border-l-emerald-500' : 'border-l-red-500'}` },
          { label: 'A = L + E + NI', value: totalAssets === totalLiab + totalEquity + netIncome ? '✓ Balanced' : '✗ Error', note: 'Accounting equation', cls: 'border-l border-border' },
        ].map(({ label, value, note, cls }) => (
          <div key={label} className={`px-4 py-3.5 ${cls}`}>
            <p className="font-bold text-sm">{value}</p>
            <p className="text-[10px] font-medium text-foreground/70 mt-0.5">{label}</p>
            <p className="text-[9px] text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>

      {/* Account tree */}
      <div className="space-y-2">
        {CLASS_ORDER.map(cls => {
          const meta = CLASS_META[cls]
          const clsAccounts = ACCOUNTS.filter(a => a.class === cls)
          const clsBalance = clsAccounts.reduce((s, a) => s + a.balance, 0)
          const groups = [...new Set(clsAccounts.map(a => a.group))]
          const isOpen = expanded.has(cls)

          return (
            <div key={cls} className={`border rounded-xl overflow-hidden ${isOpen ? 'border-border' : 'border-border/60'}`}>
              {/* Class header */}
              <button
                onClick={() => toggle(cls)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${meta.bg} hover:brightness-95`}
              >
                <div className="flex items-center gap-3">
                  <ChevronRight className={`w-4 h-4 ${meta.color} transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  <div>
                    <span className={`text-sm font-bold ${meta.color}`}>{cls} Accounts</span>
                    <span className={`ml-2 text-[10px] font-mono ${meta.color} opacity-60`}>{meta.prefix}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full bg-white/50 ${meta.color} font-medium`}>
                    {clsAccounts.length} accounts · {meta.nature}
                  </span>
                </div>
                <span className={`text-sm font-black tabular-nums ${meta.color}`}>{fmt(clsBalance)}</span>
              </button>

              {/* Groups + accounts */}
              {isOpen && (
                <div className="bg-card divide-y divide-border/40">
                  {groups.map(group => {
                    const groupAccounts = filtered(cls, group)
                    const groupTotal = ACCOUNTS.filter(a => a.class === cls && a.group === group).reduce((s, a) => s + a.balance, 0)
                    const gKey = `${cls}-${group}`
                    const gOpen = expandedGroups.has(gKey)

                    return (
                      <div key={group}>
                        {/* Group row */}
                        <button
                          onClick={() => toggleGroup(gKey)}
                          className="w-full flex items-center justify-between px-6 py-2 hover:bg-muted/30 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <ChevronRight className={`w-3 h-3 text-muted-foreground transition-transform ${gOpen ? 'rotate-90' : ''}`} />
                            <span className="text-xs font-semibold">{group}</span>
                            <span className="text-[9px] text-muted-foreground">{ACCOUNTS.filter(a => a.class === cls && a.group === group).length} accounts</span>
                          </div>
                          <span className="text-xs font-bold tabular-nums">{fmt(groupTotal)}</span>
                        </button>

                        {/* Account rows */}
                        {gOpen && (
                          <div className="bg-muted/10">
                            {/* Table header */}
                            <div className="grid grid-cols-[80px_1fr_1fr_100px_80px_80px] gap-0 px-8 py-1 border-t border-border/30 text-[9px] font-semibold uppercase text-muted-foreground tracking-wide">
                              <span>Code</span><span>Account Name</span><span>Lao Name</span><span>Nature</span><span className="text-right">Balance</span><span className="text-right">Actions</span>
                            </div>
                            {groupAccounts.length === 0 ? (
                              <p className="px-8 py-2 text-xs text-muted-foreground italic">No accounts match search</p>
                            ) : groupAccounts.map(acc => (
                              <div
                                key={acc.code}
                                className="grid grid-cols-[80px_1fr_1fr_100px_80px_80px] gap-0 px-8 py-2 items-center hover:bg-muted/20 border-t border-border/20 text-xs"
                              >
                                <span className="font-mono text-[10px] text-muted-foreground">{acc.code}</span>
                                <span className="font-medium">{acc.name}</span>
                                <span className="text-muted-foreground text-[10px]">{acc.nameLao}</span>
                                <span className={`text-[10px] ${acc.nature === 'Debit' ? 'text-blue-600' : 'text-red-600'}`}>{acc.nature}</span>
                                <span className={`text-right font-bold tabular-nums text-[11px] ${acc.balance < 0 ? 'text-red-600' : ''}`}>{fmt(acc.balance)}</span>
                                <div className="flex justify-end gap-1">
                                  <button className="text-[10px] text-primary hover:underline px-1">Edit</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}
