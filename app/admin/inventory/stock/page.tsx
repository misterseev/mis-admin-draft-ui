'use client'

import { useState } from 'react'
import { Search, X, AlertTriangle, Package, Plus } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

interface StockItem {
  code: string
  name: string
  nameLao: string
  category: string
  unit: string
  inStock: number
  reorderLevel: number
  maxStock: number
  unitCost: string
  location: string
  expiryDate?: string
}

const STOCK: StockItem[] = [
  { code: 'MED-001', name: 'Paracetamol 500mg Tab',       nameLao: 'ຢາຜ່ານຊ້ານ 500mg',        category: 'Medicine',     unit: 'Box',   inStock: 450,  reorderLevel: 100, maxStock: 600,  unitCost: 'LAK 12,000',  location: 'Pharm-A1', expiryDate: '03/2028' },
  { code: 'MED-002', name: 'Amoxicillin 250mg Cap',       nameLao: 'ອາໂມຊີຊີລີ 250mg',        category: 'Medicine',     unit: 'Box',   inStock:  88,  reorderLevel: 100, maxStock: 400,  unitCost: 'LAK 28,000',  location: 'Pharm-A2', expiryDate: '11/2027' },
  { code: 'MED-003', name: 'Metronidazole 200mg Tab',     nameLao: 'ເມໂທຣີນີດາໂຊ 200mg',      category: 'Medicine',     unit: 'Box',   inStock: 210,  reorderLevel: 80,  maxStock: 300,  unitCost: 'LAK 18,500',  location: 'Pharm-A3', expiryDate: '06/2027' },
  { code: 'MED-004', name: 'ORS Sachets',                  nameLao: 'ເກືອ ORS',                 category: 'Medicine',     unit: 'Box',   inStock: 320,  reorderLevel: 150, maxStock: 500,  unitCost: 'LAK 5,000',   location: 'Pharm-B1', expiryDate: '12/2027' },
  { code: 'SUP-001', name: 'Surgical Gloves (M)',          nameLao: 'ຖົງມືຜ່າຕັດ (M)',           category: 'Surgical',     unit: 'Box',   inStock: 180,  reorderLevel: 100, maxStock: 400,  unitCost: 'LAK 45,000',  location: 'Store-B2'  },
  { code: 'SUP-002', name: 'Disposable Syringes 5ml',      nameLao: 'ກະຕ່ຳດຸດ 5ml',             category: 'Surgical',     unit: 'Box',   inStock:  42,  reorderLevel: 100, maxStock: 300,  unitCost: 'LAK 22,000',  location: 'Store-B3'  },
  { code: 'SUP-003', name: 'IV Set Infusion',              nameLao: 'ສາຍ IV',                    category: 'Surgical',     unit: 'Pcs',   inStock: 850,  reorderLevel: 300, maxStock: 1200, unitCost: 'LAK 8,500',   location: 'Store-C1'  },
  { code: 'LAB-001', name: 'Blood Collection Tubes (EDTA)',nameLao: 'ຫຼອດຈັດເລືອດ',             category: 'Lab',          unit: 'Box',   inStock: 120,  reorderLevel: 80,  maxStock: 250,  unitCost: 'LAK 95,000',  location: 'Lab-D1',   expiryDate: '08/2026' },
  { code: 'LAB-002', name: 'Rapid Test Kit — Malaria',    nameLao: 'ຊຸດທົດສອບໄຂ້ຍຸງ',          category: 'Lab',          unit: 'Kit',   inStock:  55,  reorderLevel: 60,  maxStock: 150,  unitCost: 'LAK 180,000', location: 'Lab-D2',   expiryDate: '02/2027' },
  { code: 'OFF-001', name: 'A4 Copy Paper',                nameLao: 'ເຈ້ຍ A4',                  category: 'Office',       unit: 'Ream',  inStock: 240,  reorderLevel: 50,  maxStock: 400,  unitCost: 'LAK 18,000',  location: 'Stor-E1'   },
  { code: 'CLN-001', name: 'Disinfectant Solution 5L',     nameLao: 'ນ້ຳຍາຂ້າເຊື້ອ 5L',         category: 'Cleaning',     unit: 'Bottle',inStock: 38,   reorderLevel: 40,  maxStock: 120,  unitCost: 'LAK 65,000',  location: 'Store-F1', expiryDate: '10/2027' },
]

const CAT_COLORS: Record<string, string> = {
  Medicine: 'bg-blue-50 text-blue-700',
  Surgical: 'bg-emerald-50 text-emerald-700',
  Lab:      'bg-orange-50 text-orange-700',
  Office:   'bg-slate-100 text-slate-700',
  Cleaning: 'bg-purple-50 text-purple-700',
}

export default function StockPage() {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [showLow, setShowLow] = useState(false)

  const filtered = STOCK.filter(s => {
    const q = search.toLowerCase()
    if (q && !s.name.toLowerCase().includes(q) && !s.code.toLowerCase().includes(q)) return false
    if (catFilter !== 'all' && s.category !== catFilter) return false
    if (showLow && s.inStock > s.reorderLevel) return false
    return true
  })

  return (
    <AppShell breadcrumbs={[{ label: 'Inventory', href: '/admin/inventory' }, { label: 'Stock' }]}>
      <PageHeader
        title="Stock Management"
        titleLao="ການຈັດການສາງ"
        description="Real-time inventory levels, reorder alerts, and stock adjustments · INV-004"
        primaryAction={{ label: 'Adjust Stock', icon: <Plus className="w-3.5 h-3.5" />, href: '/admin/inventory/stock/adjust' }}
      />

      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Total SKUs',       value: STOCK.length,                                              color: 'text-foreground' },
          { label: 'Below Reorder',    value: STOCK.filter(s => s.inStock <= s.reorderLevel).length,    color: 'text-red-600'    },
          { label: 'Near Expiry',      value: STOCK.filter(s => s.expiryDate?.includes('2026')).length, color: 'text-amber-600'  },
          { label: 'Total Stock Value',value: 'LAK 48.2M',                                              color: 'text-primary'    },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Alert banner */}
      {STOCK.filter(s => s.inStock <= s.reorderLevel).length > 0 && (
        <div className="flex items-center gap-3 mb-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-xs text-red-800">
            <span className="font-semibold">{STOCK.filter(s => s.inStock <= s.reorderLevel).length} items</span> are at or below reorder level and require procurement action.
          </p>
          <button className="ml-auto text-xs font-semibold text-red-700 hover:underline" onClick={() => setShowLow(v => !v)}>
            {showLow ? 'Show All' : 'Show Low Stock Only'}
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input className="pl-8 h-8 text-xs w-60" placeholder="Search item name or code..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="h-8 text-xs w-36"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Categories</SelectItem>
            {['Medicine','Surgical','Lab','Office','Cleaning'].map(c => (
              <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || catFilter !== 'all') && (
          <button className="text-xs text-primary hover:underline flex items-center gap-1" onClick={() => { setSearch(''); setCatFilter('all') }}>
            <X className="w-3 h-3" />Clear
          </button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} items</span>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Code','Item Name','Category','Unit','Stock Level','Reorder / Max','Unit Cost','Location','Expiry',''].map(h => (
                <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const pct = Math.min((item.inStock / item.maxStock) * 100, 100)
              const isLow = item.inStock <= item.reorderLevel
              return (
                <tr key={item.code} className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${isLow ? 'bg-red-50/30' : ''}`}>
                  <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{item.code}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      {isLow && <AlertTriangle className="w-3 h-3 text-red-500 flex-shrink-0" />}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">{item.nameLao}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${CAT_COLORS[item.category] ?? 'bg-slate-100'}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{item.unit}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Progress value={pct} className={`h-1.5 w-16 ${isLow ? '[&>div]:bg-red-500' : ''}`} />
                      <span className={`tabular-nums font-semibold ${isLow ? 'text-red-600' : 'text-foreground'}`}>{item.inStock}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 tabular-nums text-muted-foreground">{item.reorderLevel} / {item.maxStock}</td>
                  <td className="px-3 py-2 tabular-nums text-muted-foreground">{item.unitCost}</td>
                  <td className="px-3 py-2 text-muted-foreground">{item.location}</td>
                  <td className="px-3 py-2 tabular-nums text-muted-foreground">{item.expiryDate ?? '—'}</td>
                  <td className="px-3 py-2">
                    <button className="text-[10px] text-primary hover:underline">Adjust</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}
