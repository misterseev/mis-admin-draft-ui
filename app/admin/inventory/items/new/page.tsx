'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Save, X } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

export default function NewItemPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      router.push('/admin/inventory')
    }, 600)
  }

  return (
    <AppShell
      breadcrumbs={[
        { label: 'Inventory', href: '/admin/inventory' },
        { label: 'New Item' },
      ]}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/inventory"
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold">
              New Inventory Item
              <span className="ml-2 text-sm font-normal text-muted-foreground">ເພີ່ມລາຍການໃໝ່</span>
            </h1>
            <p className="text-xs text-muted-foreground">Create a master record for an inventory item</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 border-b border-border">
              Basic Information / ຂໍ້ມູນພື້ນຖານ
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs mb-1 block">
                  Item Code <span className="text-destructive">*</span>
                </Label>
                <Input className="h-8 text-xs font-mono" placeholder="ITM-XX-0000" required />
              </div>
              <div>
                <Label className="text-xs mb-1 block">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select defaultValue="Medical">
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Medical', 'Surgical', 'Lab', 'Office', 'Cleaning', 'Equipment'].map(c => (
                      <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label className="text-xs mb-1 block">
                  Name (English) <span className="text-destructive">*</span>
                </Label>
                <Input className="h-8 text-xs" placeholder="e.g. Surgical Gloves (Medium)" required />
              </div>
              <div className="col-span-2">
                <Label className="text-xs mb-1 block">Name (Lao) / ຊື່ພາສາລາວ</Label>
                <Input className="h-8 text-xs" placeholder="ຕົວຢ່າງ: ຖົງມືຜ່າຕັດ" />
              </div>
              <div className="col-span-2">
                <Label className="text-xs mb-1 block">Description</Label>
                <Textarea className="text-xs h-16 resize-none" placeholder="Brief description, specifications, brand..." />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 border-b border-border">
              Stock Parameters / ພາລາມິເຕີສາງ
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs mb-1 block">
                  Unit of Measure <span className="text-destructive">*</span>
                </Label>
                <Select defaultValue="Box">
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Box', 'Piece', 'Pack', 'Bottle', 'Kit', 'Ream'].map(u => (
                      <SelectItem key={u} value={u} className="text-xs">{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1 block">
                  Unit Price (LAK) <span className="text-destructive">*</span>
                </Label>
                <Input type="number" className="h-8 text-xs tabular-nums" placeholder="0" required />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Location / ສະຖານທີ່</Label>
                <Input className="h-8 text-xs" placeholder="e.g. Pharm-A1" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">
                  Reorder Level <span className="text-destructive">*</span>
                </Label>
                <Input type="number" className="h-8 text-xs tabular-nums" placeholder="0" required />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Max Stock</Label>
                <Input type="number" className="h-8 text-xs tabular-nums" placeholder="0" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Opening Stock</Label>
                <Input type="number" className="h-8 text-xs tabular-nums" placeholder="0" />
              </div>
            </div>
          </div>
        </div>

        {/* Side */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 border-b border-border">
              Supplier / ຜູ້ສະໜອງ
            </h3>
            <div className="space-y-3">
              <div>
                <Label className="text-xs mb-1 block">Preferred Supplier</Label>
                <Select>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent>
                    {['Lao Medical Supplies Co.', 'BPKP Stationery Ltd.', 'DiagnoTech Asia', 'IT World Lao'].map(s => (
                      <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Lead Time (days)</Label>
                <Input type="number" className="h-8 text-xs tabular-nums" placeholder="7" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 border-b border-border">
              Lifecycle / ຊີວິດ
            </h3>
            <div className="space-y-3">
              <div>
                <Label className="text-xs mb-1 block">Shelf Life (months)</Label>
                <Input type="number" className="h-8 text-xs tabular-nums" placeholder="24" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Storage Requirements</Label>
                <Textarea className="text-xs h-14 resize-none" placeholder="e.g. 2-8°C refrigerated, protect from light" />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky bar */}
        <div className="lg:col-span-3 flex items-center justify-end gap-2 border-t border-border pt-3">
          <Link href="/admin/inventory">
            <Button type="button" variant="ghost" size="sm" className="text-xs h-8 gap-1">
              <X className="w-3.5 h-3.5" />Cancel
            </Button>
          </Link>
          <Button type="button" variant="outline" size="sm" className="text-xs h-8">Save Draft</Button>
          <Button type="submit" size="sm" className="text-xs h-8 gap-1" disabled={saving}>
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving…' : 'Save Item'}
          </Button>
        </div>
      </form>
    </AppShell>
  )
}
