'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, Save, X } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

const STOCK_ITEMS = [
  { code: 'MED-001', name: 'Paracetamol 500mg Tab',     unit: 'Box', current: 450 },
  { code: 'MED-002', name: 'Amoxicillin 250mg Cap',      unit: 'Box', current: 88 },
  { code: 'SUP-001', name: 'Surgical Gloves (M)',         unit: 'Box', current: 180 },
  { code: 'SUP-002', name: 'Disposable Syringes 5ml',     unit: 'Box', current: 42 },
  { code: 'LAB-001', name: 'Blood Collection Tubes (EDTA)', unit: 'Box', current: 120 },
]

type AdjustType = 'Increase' | 'Decrease' | 'Stock Count'

const REASONS: Record<AdjustType, string[]> = {
  Increase: ['Found in stock', 'Return from department', 'Correction — data entry'],
  Decrease: ['Damage / Breakage', 'Expired', 'Loss / Theft', 'Correction — data entry'],
  'Stock Count': ['Physical count variance'],
}

export default function StockAdjustPage() {
  const router = useRouter()
  const [itemCode, setItemCode] = useState(STOCK_ITEMS[0].code)
  const [adjustType, setAdjustType] = useState<AdjustType>('Decrease')
  const [reason, setReason] = useState(REASONS['Decrease'][0])
  const [qty, setQty] = useState<number>(1)
  const [newCount, setNewCount] = useState<number>(STOCK_ITEMS[0].current)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const item = STOCK_ITEMS.find(i => i.code === itemCode)!

  const resultingStock = useMemo(() => {
    if (adjustType === 'Stock Count') return Math.max(0, newCount)
    if (adjustType === 'Increase')    return item.current + Math.max(0, qty)
    return Math.max(0, item.current - Math.max(0, qty))
  }, [adjustType, item.current, qty, newCount])

  const delta = resultingStock - item.current

  const handleTypeChange = (t: AdjustType) => {
    setAdjustType(t)
    setReason(REASONS[t][0])
    if (t === 'Stock Count') setNewCount(item.current)
    else setQty(1)
  }

  const handleItemChange = (code: string) => {
    setItemCode(code)
    const next = STOCK_ITEMS.find(i => i.code === code)!
    if (adjustType === 'Stock Count') setNewCount(next.current)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setDone(true)
      setTimeout(() => router.push('/admin/inventory/stock'), 900)
    }, 500)
  }

  if (done) {
    return (
      <AppShell breadcrumbs={[{ label: 'Inventory', href: '/admin/inventory' }, { label: 'Stock', href: '/admin/inventory/stock' }, { label: 'Adjust' }]}>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold">Stock Adjusted</h2>
          <p className="text-xs text-muted-foreground mt-1">Redirecting…</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      breadcrumbs={[
        { label: 'Inventory', href: '/admin/inventory' },
        { label: 'Stock', href: '/admin/inventory/stock' },
        { label: 'Adjust' },
      ]}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/inventory/stock" className="p-1.5 rounded-md hover:bg-muted text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold">
              Stock Adjustment
              <span className="ml-2 text-sm font-normal text-muted-foreground">ປັບປ່ຽນສາງ</span>
            </h1>
            <p className="text-xs text-muted-foreground">Manually correct stock levels with a documented reason</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-1 pb-1 border-b border-border">
            Adjustment Details / ລາຍລະອຽດ
          </h3>

          <div>
            <Label className="text-xs mb-1 block">
              Item <span className="text-destructive">*</span>
            </Label>
            <Select value={itemCode} onValueChange={handleItemChange}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STOCK_ITEMS.map(i => (
                  <SelectItem key={i.code} value={i.code} className="text-xs">
                    <span className="font-mono text-[10px] mr-2">{i.code}</span>{i.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs mb-1 block">
                Adjustment Type <span className="text-destructive">*</span>
              </Label>
              <Select value={adjustType} onValueChange={v => handleTypeChange(v as AdjustType)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(['Increase', 'Decrease', 'Stock Count'] as AdjustType[]).map(t => (
                    <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-1 block">
                Reason <span className="text-destructive">*</span>
              </Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REASONS[adjustType].map(r => (
                    <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {adjustType === 'Stock Count' ? (
              <div>
                <Label className="text-xs mb-1 block">
                  Physical Count <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  min={0}
                  className="h-8 text-xs tabular-nums"
                  value={newCount}
                  onChange={e => setNewCount(Math.max(0, Number(e.target.value) || 0))}
                  required
                />
              </div>
            ) : (
              <div>
                <Label className="text-xs mb-1 block">
                  Quantity <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  min={1}
                  className="h-8 text-xs tabular-nums"
                  value={qty}
                  onChange={e => setQty(Math.max(0, Number(e.target.value) || 0))}
                  required
                />
              </div>
            )}
          </div>

          <div>
            <Label className="text-xs mb-1 block">Notes</Label>
            <Textarea className="text-xs h-20 resize-none" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Supporting detail, reference document, or approval note…" />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-card border border-border rounded-lg p-4 h-fit">
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 border-b border-border">Summary</h3>
          <div className="space-y-2 text-xs">
            <Row label="Item" value={`${item.code} — ${item.name}`} />
            <Row label="Current Stock" value={`${item.current} ${item.unit}`} />
            <Row label="Adjustment" value={
              adjustType === 'Stock Count'
                ? `Set to ${newCount} ${item.unit}`
                : `${adjustType === 'Increase' ? '+' : '−'} ${qty} ${item.unit}`
            } />
            <div className="border-t border-border pt-2 mt-2 flex items-center justify-between">
              <span className="text-muted-foreground">Resulting Stock</span>
              <span className="font-bold tabular-nums text-base">
                {resultingStock}
                <span
                  className={`ml-2 text-[10px] font-medium ${delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-destructive' : 'text-muted-foreground'}`}
                >
                  ({delta > 0 ? '+' : ''}{delta})
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex items-center justify-end gap-2 border-t border-border pt-3">
          <Link href="/admin/inventory/stock">
            <Button type="button" variant="ghost" size="sm" className="text-xs h-8 gap-1">
              <X className="w-3.5 h-3.5" />Cancel
            </Button>
          </Link>
          <Button type="submit" size="sm" className="text-xs h-8 gap-1" disabled={saving}>
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving…' : 'Post Adjustment'}
          </Button>
        </div>
      </form>
    </AppShell>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right max-w-[60%] truncate">{value}</span>
    </div>
  )
}
