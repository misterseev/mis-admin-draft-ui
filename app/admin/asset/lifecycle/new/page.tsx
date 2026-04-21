'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/mis/AppShell'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAssetStore } from '@/lib/stores/assetStore'

const EVENT_TYPES = ['Maintenance', 'Repair', 'Transfer', 'Disposal', 'Inspection', 'Upgrade'] as const
const DEPARTMENTS = ['Radiology', 'Nursing', 'Lab', 'Finance', 'HR', 'Administration', 'Maintenance', 'Pharmacy', 'OPD']

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] uppercase font-medium text-muted-foreground block mb-1">{label}</label>
      {children}
    </div>
  )
}

export default function NewLifecycleEventPage() {
  const router = useRouter()
  const { assets, addEvent } = useAssetStore()

  const [form, setForm] = useState({
    assetCode: '', eventType: '', date: '', cost: '', performedBy: '', notes: '',
    fromDept: '', toDept: '', status: 'Scheduled',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const selectedAsset = assets.find(a => a.code === form.assetCode)

  function handleSave() {
    const rand = String(Math.floor(Math.random() * 900) + 100)
    const ref = `LCE-2026-0${rand}`
    addEvent({
      ref,
      assetCode: form.assetCode,
      assetName: selectedAsset?.name ?? form.assetCode,
      eventType: form.eventType as any,
      date: form.date,
      cost: form.cost ? parseInt(form.cost.replace(/[^0-9]/g, '')) : undefined,
      performedBy: form.performedBy,
      notes: form.notes,
      status: form.status as any,
      fromDept: form.fromDept || undefined,
      toDept: form.toDept || undefined,
    })
    router.push('/admin/asset/lifecycle')
  }

  const isTransfer = form.eventType === 'Transfer'
  const canSave = form.assetCode && form.eventType && form.date && form.performedBy

  return (
    <AppShell breadcrumbs={[
      { label: 'Asset', href: '/admin/asset' },
      { label: 'Lifecycle', href: '/admin/asset/lifecycle' },
      { label: 'Log Event' },
    ]}>

      <div className="space-y-4 max-w-3xl">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 border-b border-border">Event Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Asset *">
              <Select value={form.assetCode} onValueChange={v => set('assetCode', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select asset" /></SelectTrigger>
                <SelectContent>
                  {assets.map(a => (
                    <SelectItem key={a.code} value={a.code} className="text-xs">{a.name} <span className="text-muted-foreground">({a.code})</span></SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Event Type *">
              <Select value={form.eventType} onValueChange={v => set('eventType', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>{EVENT_TYPES.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Date *">
              <Input className="h-8 text-xs" placeholder="DD/MM/YYYY" value={form.date} onChange={e => set('date', e.target.value)} />
            </Field>
            <Field label="Status">
              <Select value={form.status} onValueChange={v => set('status', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Scheduled', 'In Progress', 'Completed'].map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Cost (LAK)">
              <Input className="h-8 text-xs" type="number" placeholder="Leave blank if none" value={form.cost} onChange={e => set('cost', e.target.value)} />
            </Field>
            <Field label="Performed By *">
              <Input className="h-8 text-xs" placeholder="e.g. Toyota Lao" value={form.performedBy} onChange={e => set('performedBy', e.target.value)} />
            </Field>
          </div>
        </div>

        {isTransfer && (
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 border-b border-border">Transfer Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="From Department">
                <Select value={form.fromDept} onValueChange={v => set('fromDept', v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select dept" /></SelectTrigger>
                  <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="To Department">
                <Select value={form.toDept} onValueChange={v => set('toDept', v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select dept" /></SelectTrigger>
                  <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 border-b border-border">Notes</h3>
          <textarea
            className="w-full h-20 text-xs border border-input rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            placeholder="Describe the work performed, findings, or reason for event..."
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pb-4">
          <Link href="/admin/asset/lifecycle" className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted">Cancel</Link>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-3.5 h-3.5" />Log Event
          </button>
        </div>
      </div>
    </AppShell>
  )
}
