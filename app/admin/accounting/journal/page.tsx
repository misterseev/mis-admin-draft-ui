'use client'

import { useState } from 'react'
import { Plus, Trash2, CheckCircle2, AlertCircle, Send } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { useAccountingStore, ACCOUNTS, fmtLak, JournalLine } from '@/lib/stores/accountingStore'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

const TYPE_COLORS: Record<string, string> = {
  Manual: 'bg-slate-100 text-slate-700', Payroll: 'bg-blue-50 text-blue-700',
  Purchase: 'bg-amber-50 text-amber-700', Depreciation: 'bg-purple-50 text-purple-700',
  Closing: 'bg-red-50 text-red-700',
}

const EMPTY_LINE = (): JournalLine => ({ accountCode: '', accountName: '', debit: 0, credit: 0, memo: '' })

export default function JournalEntryPage() {
  const { journals, addJournal, postJournal } = useAccountingStore()

  const [date, setDate] = useState('21/04/2026')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('Manual')
  const [lines, setLines] = useState<JournalLine[]>([EMPTY_LINE(), EMPTY_LINE()])

  const totalDebit  = lines.reduce((s, l) => s + (l.debit  || 0), 0)
  const totalCredit = lines.reduce((s, l) => s + (l.credit || 0), 0)
  const balanced = totalDebit === totalCredit && totalDebit > 0

  function setLine(i: number, patch: Partial<JournalLine>) {
    setLines(ls => ls.map((l, idx) => idx === i ? { ...l, ...patch } : l))
  }
  function setAccount(i: number, code: string) {
    const acc = ACCOUNTS.find(a => a.code === code)
    setLine(i, { accountCode: code, accountName: acc?.name ?? '' })
  }
  function addLine() { setLines(ls => [...ls, EMPTY_LINE()]) }
  function removeLine(i: number) { if (lines.length > 2) setLines(ls => ls.filter((_, idx) => idx !== i)) }

  function handlePost() {
    if (!balanced || !description) return
    const rand = String(Math.floor(Math.random() * 900) + 100)
    addJournal({
      ref: `JV-2026-0${rand}`, date, description,
      type: type as any, lines: lines.filter(l => l.accountCode),
      posted: false,
    })
    setLines([EMPTY_LINE(), EMPTY_LINE()])
    setDescription('')
  }

  return (
    <AppShell breadcrumbs={[{ label: 'Accounting', href: '/admin/accounting' }, { label: 'Journal Entry' }]}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold">Journal Entry</h1>
          <p className="text-xs text-muted-foreground">Double-entry bookkeeping · BGT-002</p>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Entry form */}
        <div className="flex-1 min-w-0">
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            {/* Entry header */}
            <div className="px-5 py-4 border-b border-border bg-muted/20">
              <div className="flex items-center gap-3 flex-wrap">
                <div>
                  <label className="text-[10px] uppercase font-medium text-muted-foreground block mb-1">Date</label>
                  <Input className="h-8 text-xs w-32" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="flex-1 min-w-48">
                  <label className="text-[10px] uppercase font-medium text-muted-foreground block mb-1">Description *</label>
                  <Input className="h-8 text-xs" placeholder="Journal description..." value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-medium text-muted-foreground block mb-1">Entry Type</label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="h-8 text-xs w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Manual','Payroll','Purchase','Depreciation','Closing'].map(t => (
                        <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* DR/CR grid */}
            <div className="px-5 pt-4 pb-2">
              {/* Column headers */}
              <div className="grid grid-cols-[180px_1fr_100px_100px_1fr_32px] gap-2 mb-1 text-[10px] font-semibold uppercase text-muted-foreground tracking-wide px-1">
                <span>Account Code</span><span>Account Name</span>
                <span className="text-right text-blue-600">Debit</span>
                <span className="text-right text-red-600">Credit</span>
                <span>Memo</span><span />
              </div>

              {/* Lines */}
              {lines.map((line, i) => (
                <div key={i} className="grid grid-cols-[180px_1fr_100px_100px_1fr_32px] gap-2 mb-1.5 items-center group">
                  <Select value={line.accountCode} onValueChange={v => setAccount(i, v)}>
                    <SelectTrigger className="h-8 text-xs font-mono"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {ACCOUNTS.map(a => (
                        <SelectItem key={a.code} value={a.code} className="text-xs font-mono">
                          {a.code} — {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-muted-foreground truncate px-1">{line.accountName || '—'}</span>
                  <Input
                    className="h-8 text-xs text-right border-blue-200 focus:ring-blue-300"
                    type="number" min={0} placeholder="0"
                    value={line.debit || ''}
                    onChange={e => setLine(i, { debit: parseFloat(e.target.value) || 0, credit: 0 })}
                  />
                  <Input
                    className="h-8 text-xs text-right border-red-200 focus:ring-red-300"
                    type="number" min={0} placeholder="0"
                    value={line.credit || ''}
                    onChange={e => setLine(i, { credit: parseFloat(e.target.value) || 0, debit: 0 })}
                  />
                  <Input
                    className="h-8 text-xs"
                    placeholder="Memo..."
                    value={line.memo}
                    onChange={e => setLine(i, { memo: e.target.value })}
                  />
                  <button
                    onClick={() => removeLine(i)}
                    className="p-1 rounded text-muted-foreground/30 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <button onClick={addLine} className="flex items-center gap-1 text-xs text-primary hover:underline mt-2 px-1">
                <Plus className="w-3 h-3" />Add line
              </button>
            </div>

            {/* Totals + post */}
            <div className="px-5 py-3 border-t border-border flex items-center gap-4 bg-muted/10">
              <div className="flex items-center gap-2">
                {balanced ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-xs font-medium ${balanced ? 'text-emerald-600' : 'text-red-600'}`}>
                  {balanced ? 'Balanced' : 'Not balanced'}
                </span>
              </div>
              <div className="flex items-center gap-6 ml-4">
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">Total Debit</p>
                  <p className="text-sm font-bold tabular-nums text-blue-600">{fmtLak(totalDebit)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">Total Credit</p>
                  <p className="text-sm font-bold tabular-nums text-red-600">{fmtLak(totalCredit)}</p>
                </div>
                {!balanced && totalDebit !== totalCredit && totalDebit + totalCredit > 0 && (
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">Difference</p>
                    <p className="text-sm font-bold tabular-nums text-red-600">{fmtLak(Math.abs(totalDebit - totalCredit))}</p>
                  </div>
                )}
              </div>
              <button
                onClick={handlePost}
                disabled={!balanced || !description}
                className="ml-auto flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />Save Draft
              </button>
            </div>
          </div>
        </div>

        {/* Recent journals sidebar */}
        <div className="w-72 shrink-0">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border">
              <p className="text-xs font-semibold">Recent Journal Entries</p>
            </div>
            <div className="divide-y divide-border/60">
              {journals.slice(0, 8).map(j => (
                <div key={j.ref} className="px-4 py-3 hover:bg-muted/20">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${TYPE_COLORS[j.type]}`}>{j.type}</span>
                      {j.posted && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                    </div>
                    <span className="text-[10px] tabular-nums text-muted-foreground shrink-0">{j.date}</span>
                  </div>
                  <p className="text-xs font-medium leading-snug">{j.description}</p>
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{j.ref}</p>
                  <div className="flex justify-between mt-1 text-[10px]">
                    <span className="text-blue-600 tabular-nums">DR {fmtLak(j.lines.reduce((s,l)=>s+l.debit,0))}</span>
                    <span className="text-red-600 tabular-nums">CR {fmtLak(j.lines.reduce((s,l)=>s+l.credit,0))}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
