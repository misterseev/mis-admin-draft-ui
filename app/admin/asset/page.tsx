'use client'

import { useState } from 'react'
import { Plus, Search, X, Eye, Edit, QrCode } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Asset {
  code: string
  name: string
  nameLao: string
  category: string
  brand: string
  serialNo: string
  location: string
  dept: string
  purchaseDate: string
  purchaseCost: string
  bookValue: string
  status: 'Active' | 'Under Maintenance' | 'Disposed' | 'Lost'
}

const ASSETS: Asset[] = [
  { code: 'AST-2024-0441', name: 'Ultrasound Machine (Portable)',  nameLao: 'ເຄື່ອງ Echo',              category: 'Medical Equipment', brand: 'GE Healthcare',   serialNo: 'GE-US-88421', location: 'OPD Room 2',    dept: 'Radiology',    purchaseDate: '12/03/2024', purchaseCost: 'LAK 850,000,000', bookValue: 'LAK 722,500,000', status: 'Active'           },
  { code: 'AST-2023-0388', name: 'Patient Monitor (Bedside)',      nameLao: 'ຈໍຕິດຕາມ',                category: 'Medical Equipment', brand: 'Mindray',         serialNo: 'MR-PM-50219', location: 'ICU Bay 3',      dept: 'Nursing',      purchaseDate: '05/06/2023', purchaseCost: 'LAK 48,000,000',  bookValue: 'LAK 31,200,000',  status: 'Active'           },
  { code: 'AST-2022-0301', name: 'Digital X-Ray System',           nameLao: 'ເຄື່ອງ X-Ray ດິຈີຕອນ',   category: 'Medical Equipment', brand: 'Philips',         serialNo: 'PH-XR-11234', location: 'Radiology Lab',  dept: 'Radiology',    purchaseDate: '20/01/2022', purchaseCost: 'LAK 2,400,000,000',bookValue:'LAK 1,680,000,000',status: 'Active'           },
  { code: 'AST-2024-0512', name: 'Desktop Computer (HP Prodesk)',  nameLao: 'ຄອມຕັ້ງ HP',              category: 'IT Equipment',      brand: 'HP',              serialNo: 'HP-PD-77801', location: 'Finance Dept',   dept: 'Finance',      purchaseDate: '15/09/2024', purchaseCost: 'LAK 8,500,000',   bookValue: 'LAK 7,225,000',   status: 'Active'           },
  { code: 'AST-2021-0211', name: 'Ambulance Vehicle (Toyota Hiace)',nameLao: 'ລົດຂົນສົ່ງ',            category: 'Vehicles',          brand: 'Toyota',          serialNo: 'LPJ-4481',    location: 'Motor Pool',    dept: 'Administration',purchaseDate: '10/03/2021', purchaseCost: 'LAK 190,000,000', bookValue: 'LAK 95,000,000',  status: 'Active'           },
  { code: 'AST-2023-0352', name: 'Autoclave Sterilizer',           nameLao: 'ເຄື່ອງໄອນ້ຳ',             category: 'Medical Equipment', brand: 'Tuttnauer',       serialNo: 'TT-AV-30210', location: 'Sterilization', dept: 'Nursing',      purchaseDate: '22/08/2023', purchaseCost: 'LAK 55,000,000',  bookValue: 'LAK 38,500,000',  status: 'Under Maintenance'},
  { code: 'AST-2022-0288', name: 'Split AC Unit (2 Ton)',          nameLao: 'ອ່ອ ຕ່ວ 2 ໂຕນ',          category: 'Facility',          brand: 'Daikin',          serialNo: 'DK-AC-28801', location: 'Admin Block',   dept: 'Administration',purchaseDate: '14/05/2022', purchaseCost: 'LAK 14,500,000',  bookValue: 'LAK 7,250,000',   status: 'Active'           },
  { code: 'AST-2019-0088', name: 'Laboratory Centrifuge',          nameLao: 'ເຄື່ອງ Centrifuge',       category: 'Medical Equipment', brand: 'Eppendorf',       serialNo: 'EP-CF-19033', location: 'Lab Room A',    dept: 'Lab',          purchaseDate: '01/02/2019', purchaseCost: 'LAK 28,000,000',  bookValue: 'LAK 0',           status: 'Disposed'         },
  { code: 'AST-2024-0488', name: 'LaserJet Printer (HP)',          nameLao: 'ປຣິ້ນເຕີ HP',             category: 'IT Equipment',      brand: 'HP',              serialNo: 'HP-LJ-55922', location: 'HR Dept',       dept: 'HR',           purchaseDate: '03/11/2024', purchaseCost: 'LAK 5,200,000',   bookValue: 'LAK 4,680,000',   status: 'Active'           },
  { code: 'AST-2023-0401', name: 'Generator (Diesel 50kVA)',       nameLao: 'ເຄື່ອງໄຟ 50kVA',          category: 'Facility',          brand: 'Cummins',         serialNo: 'CU-GN-80142', location: 'Power Room',    dept: 'Maintenance',  purchaseDate: '18/07/2023', purchaseCost: 'LAK 280,000,000', bookValue: 'LAK 210,000,000', status: 'Active'           },
]

const CAT_COLORS: Record<string, string> = {
  'Medical Equipment': 'bg-blue-50 text-blue-700',
  'IT Equipment':      'bg-indigo-50 text-indigo-700',
  'Vehicles':          'bg-amber-50 text-amber-700',
  'Facility':          'bg-emerald-50 text-emerald-700',
}

export default function AssetMasterPage() {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = ASSETS.filter(a => {
    const q = search.toLowerCase()
    if (q && !a.name.toLowerCase().includes(q) && !a.code.toLowerCase().includes(q)) return false
    if (catFilter !== 'all' && a.category !== catFilter) return false
    if (statusFilter !== 'all' && a.status !== statusFilter) return false
    return true
  })

  return (
    <AppShell breadcrumbs={[{ label: 'Asset', href: '/admin/asset' }, { label: 'Asset Register' }]}>
      <PageHeader
        title="Asset Register"
        titleLao="ທະບຽນຊັບສິນ"
        description="Register and track all hospital assets with depreciation · AST-001"
        primaryAction={{ label: '+ Register Asset', icon: <Plus className="w-3.5 h-3.5" /> }}
      />

      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Total Assets',        value: ASSETS.length,                                             color: 'text-foreground' },
          { label: 'Active',              value: ASSETS.filter(a => a.status === 'Active').length,          color: 'text-emerald-600' },
          { label: 'Under Maintenance',   value: ASSETS.filter(a => a.status === 'Under Maintenance').length, color: 'text-amber-600' },
          { label: 'Total Book Value',    value: 'LAK 2,796.4M',                                            color: 'text-primary'   },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input className="pl-8 h-8 text-xs w-64" placeholder="Search asset name or code..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="h-8 text-xs w-44"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Categories</SelectItem>
            {['Medical Equipment','IT Equipment','Vehicles','Facility'].map(c => (
              <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 text-xs w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Status</SelectItem>
            {['Active','Under Maintenance','Disposed','Lost'].map(s => (
              <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || catFilter !== 'all' || statusFilter !== 'all') && (
          <button className="text-xs text-primary hover:underline flex items-center gap-1" onClick={() => { setSearch(''); setCatFilter('all'); setStatusFilter('all') }}>
            <X className="w-3 h-3" />Clear
          </button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} assets</span>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Asset Code','Name','Category','Brand','Serial No.','Department','Location','Purchase Date','Purchase Cost','Book Value','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.code} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-2 font-mono text-[10px] text-primary">{a.code}</td>
                  <td className="px-3 py-2">
                    <p className="font-medium">{a.name}</p>
                    <p className="text-[10px] text-muted-foreground">{a.nameLao}</p>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${CAT_COLORS[a.category] ?? 'bg-slate-100'}`}>
                      {a.category}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{a.brand}</td>
                  <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{a.serialNo}</td>
                  <td className="px-3 py-2 text-muted-foreground">{a.dept}</td>
                  <td className="px-3 py-2 text-muted-foreground">{a.location}</td>
                  <td className="px-3 py-2 tabular-nums text-muted-foreground">{a.purchaseDate}</td>
                  <td className="px-3 py-2 tabular-nums text-foreground">{a.purchaseCost}</td>
                  <td className="px-3 py-2 tabular-nums font-semibold text-foreground">{a.bookValue}</td>
                  <td className="px-3 py-2"><StatusBadge status={a.status} /></td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit className="w-3.5 h-3.5" /></button>
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><QrCode className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  )
}
