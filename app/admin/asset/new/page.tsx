'use client'

import { useState } from 'react'
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

export default function NewAssetPage() {
  const router = useRouter()
  const { addAsset } = useAssetStore()

  const [form, setForm] = useState({
    name: '', nameLao: '', category: '', brand: '', model: '', serialNo: '',
    dept: '', location: '', purchaseDate: '', purchaseCost: '',
    usefulLife: '', residualValue: '', status: 'Active' as const, notes: '',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  function handleSave() {
    const year = form.purchaseDate.split('/')[2] ?? '2026'
    const rand = String(Math.floor(Math.random() * 900) + 100)
    const code = `AST-${year}-0${rand}`
    const cost = parseInt(form.purchaseCost.replace(/[^0-9]/g, '')) || 0
    const life = parseInt(form.usefulLife) || 5
    const residual = parseInt(form.residualValue.replace(/[^0-9]/g, '')) || Math.round(cost * 0.1)
    addAsset({
      code, name: form.name, nameLao: form.nameLao, category: form.category,
      brand: form.brand, model: form.model, serialNo: form.serialNo,
      dept: form.dept, location: form.location, purchaseDate: form.purchaseDate,
      purchaseCost: cost, usefulLife: life, residualValue: residual,
      bookValue: cost, status: form.status as any, notes: form.notes,
    })
    router.push('/admin/asset')
  }

  return (
    <AppShell breadcrumbs={[
      { label: 'Asset', href: '/admin/asset' },
      { label: 'Asset Register', href: '/admin/asset' },
      { label: 'Register New Asset' },
    ]}>
      {/* <div className="flex items-center gap-3 mb-4">
        <Link href="/admin/asset" className="p-1.5 rounded-md hover:bg-muted text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold">Register New Asset</h1>
          <p className="text-xs text-muted-foreground">Add a new asset to the hospital register</p>
        </div>
      </div> */}

      <div className="space-y-4 w-full">
        {/* Basic Info */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1">Basic Information</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Asset Name (English) *">
              <Input className="h-8 text-xs" placeholder="e.g. Patient Monitor (Bedside)" value={form.name} onChange={e => set('name', e.target.value)} />
            </Field>
            <Field label="Asset Name (Lao)">
              <Input className="h-8 text-xs" placeholder="ຊື່ເປັນພາສາລາວ" value={form.nameLao} onChange={e => set('nameLao', e.target.value)} />
            </Field>
            <Field label="Category *">
              <Select value={form.category} onValueChange={v => set('category', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Status *">
              <Select value={form.status} onValueChange={v => set('status', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Brand *">
              <Input className="h-8 text-xs" placeholder="e.g. Mindray" value={form.brand} onChange={e => set('brand', e.target.value)} />
            </Field>
            <Field label="Model">
              <Input className="h-8 text-xs" placeholder="e.g. BeneVision N12" value={form.model} onChange={e => set('model', e.target.value)} />
            </Field>
            <Field label="Serial Number *">
              <Input className="h-8 text-xs font-mono" placeholder="e.g. MR-PM-50219" value={form.serialNo} onChange={e => set('serialNo', e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Location */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1">Location & Department</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Department *">
              <Select value={form.dept} onValueChange={v => set('dept', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Location / Room">
              <Input className="h-8 text-xs" placeholder="e.g. ICU Bay 3" value={form.location} onChange={e => set('location', e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Financial */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1">Financial & Depreciation</h3>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Purchase Date *">
              <Input className="h-8 text-xs" placeholder="DD/MM/YYYY" value={form.purchaseDate} onChange={e => set('purchaseDate', e.target.value)} />
            </Field>
            <Field label="Purchase Cost (LAK) *">
              <Input className="h-8 text-xs" type="number" placeholder="0" value={form.purchaseCost} onChange={e => set('purchaseCost', e.target.value)} />
            </Field>
            <Field label="Useful Life (Years)">
              <Input className="h-8 text-xs" type="number" placeholder="5" value={form.usefulLife} onChange={e => set('usefulLife', e.target.value)} />
            </Field>
            <Field label="Residual Value (LAK)">
              <Input className="h-8 text-xs" type="number" placeholder="Leave blank for 10%" value={form.residualValue} onChange={e => set('residualValue', e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1">Notes</h3>
          <textarea
            className="w-full h-20 text-xs border border-input rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            placeholder="Additional notes or remarks..."
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pb-4">
          <Link href="/admin/asset" className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted">Cancel</Link>
          <button
            onClick={handleSave}
            disabled={!form.name || !form.category || !form.serialNo || !form.purchaseDate || !form.purchaseCost}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-3.5 h-3.5" />Register Asset
          </button>
        </div>
      </div>
    </AppShell>
  )
}
