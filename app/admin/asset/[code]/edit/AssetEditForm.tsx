'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/mis/AppShell'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAssetStore } from '@/lib/stores/assetStore'

const CATEGORIES = ['Medical Equipment', 'IT Equipment', 'Vehicles', 'Facility']
const DEPARTMENTS = ['Radiology', 'Nursing', 'Lab', 'Finance', 'HR', 'Administration', 'Maintenance', 'Pharmacy', 'OPD']
const STATUSES = ['Active', 'Under Maintenance', 'Disposed', 'Lost'] as const

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] uppercase font-medium text-muted-foreground block mb-1">{label}</label>
      {children}
    </div>
  )
}

export default function AssetEditForm({ assetCode }: { assetCode: string }) {
  const router = useRouter()
  const { assets, updateAsset } = useAssetStore()
  const asset = assets.find(a => a.code === decodeURIComponent(assetCode))

  const [form, setForm] = useState({
    name: '', nameLao: '', category: '', brand: '', model: '', serialNo: '',
    dept: '', location: '', purchaseDate: '', purchaseCost: '',
    usefulLife: '', residualValue: '', bookValue: '', status: 'Active', notes: '',
  })

  useEffect(() => {
    if (asset) {
      setForm({
        name: asset.name, nameLao: asset.nameLao, category: asset.category,
        brand: asset.brand, model: asset.model, serialNo: asset.serialNo,
        dept: asset.dept, location: asset.location, purchaseDate: asset.purchaseDate,
        purchaseCost: String(asset.purchaseCost), usefulLife: String(asset.usefulLife),
        residualValue: String(asset.residualValue), bookValue: String(asset.bookValue),
        status: asset.status, notes: asset.notes ?? '',
      })
    }
  }, [assets])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  function handleSave() {
    if (!asset) return
    updateAsset(asset.code, {
      name: form.name, nameLao: form.nameLao, category: form.category,
      brand: form.brand, model: form.model, serialNo: form.serialNo,
      dept: form.dept, location: form.location, purchaseDate: form.purchaseDate,
      purchaseCost: parseInt(form.purchaseCost) || asset.purchaseCost,
      usefulLife: parseInt(form.usefulLife) || asset.usefulLife,
      residualValue: parseInt(form.residualValue) || asset.residualValue,
      bookValue: parseInt(form.bookValue) || asset.bookValue,
      status: form.status as any, notes: form.notes,
    })
    router.push(`/admin/asset/${encodeURIComponent(asset.code)}`)
  }

  if (!asset) {
    return (
      <AppShell breadcrumbs={[{ label: 'Asset', href: '/admin/asset' }, { label: assetCode }, { label: 'Edit' }]}>
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p className="text-sm font-medium">Asset not found</p>
          <Link href="/admin/asset" className="text-xs text-primary hover:underline mt-2">← Back</Link>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell breadcrumbs={[
      { label: 'Asset', href: '/admin/asset' },
      { label: asset.code, href: `/admin/asset/${encodeURIComponent(asset.code)}` },
      { label: 'Edit' },
    ]}>

      <div className="space-y-4 w-full">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1">Basic Information</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Asset Name (English) *">
              <Input className="h-8 text-xs" value={form.name} onChange={e => set('name', e.target.value)} />
            </Field>
            <Field label="Asset Name (Lao)">
              <Input className="h-8 text-xs" value={form.nameLao} onChange={e => set('nameLao', e.target.value)} />
            </Field>
            <Field label="Category *">
              <Select value={form.category} onValueChange={v => set('category', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Status *">
              <Select value={form.status} onValueChange={v => set('status', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Brand">
              <Input className="h-8 text-xs" value={form.brand} onChange={e => set('brand', e.target.value)} />
            </Field>
            <Field label="Model">
              <Input className="h-8 text-xs" value={form.model} onChange={e => set('model', e.target.value)} />
            </Field>
            <Field label="Serial Number">
              <Input className="h-8 text-xs font-mono" value={form.serialNo} onChange={e => set('serialNo', e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1">Location & Department</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Department">
              <Select value={form.dept} onValueChange={v => set('dept', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Location / Room">
              <Input className="h-8 text-xs" value={form.location} onChange={e => set('location', e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1">Financial & Depreciation</h3>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Purchase Date">
              <Input className="h-8 text-xs" placeholder="DD/MM/YYYY" value={form.purchaseDate} onChange={e => set('purchaseDate', e.target.value)} />
            </Field>
            <Field label="Purchase Cost (LAK)">
              <Input className="h-8 text-xs" type="number" value={form.purchaseCost} onChange={e => set('purchaseCost', e.target.value)} />
            </Field>
            <Field label="Book Value (LAK)">
              <Input className="h-8 text-xs" type="number" value={form.bookValue} onChange={e => set('bookValue', e.target.value)} />
            </Field>
            <Field label="Useful Life (Years)">
              <Input className="h-8 text-xs" type="number" value={form.usefulLife} onChange={e => set('usefulLife', e.target.value)} />
            </Field>
            <Field label="Residual Value (LAK)">
              <Input className="h-8 text-xs" type="number" value={form.residualValue} onChange={e => set('residualValue', e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1">Notes</h3>
          <textarea
            className="w-full h-20 text-xs border border-input rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pb-4">
          <Link href={`/admin/asset/${encodeURIComponent(asset.code)}`} className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted">Cancel</Link>
          <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            <Save className="w-3.5 h-3.5" />Save Changes
          </button>
        </div>
      </div>
    </AppShell>
  )
}
