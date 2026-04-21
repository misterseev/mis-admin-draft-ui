'use client'

import Link from 'next/link'
import { Package, AlertTriangle, ShoppingCart, TruckIcon, Plus, Eye } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { StatCard } from '@/components/mis/StatCard'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const stockMovement = Array.from({ length: 14 }, (_, i) => ({
  day: `Apr ${i + 7}`, 'In': Math.floor(Math.random() * 60 + 20), 'Out': Math.floor(Math.random() * 50 + 15),
}))

const lowStock = [
  { item: 'Surgical Gloves (Box)', curr: 12, reorder: 50, days: 4 },
  { item: 'Syringe 5ml (Box)',     curr: 8,  reorder: 30, days: 3 },
  { item: 'IV Tubing Set',         curr: 5,  reorder: 20, days: 2 },
  { item: 'Face Mask N95',         curr: 22, reorder: 100,days: 7 },
  { item: 'Alcohol 70% (L)',       curr: 15, reorder: 50, days: 5 },
]

const INVENTORY = [
  { code:'ITM-MS-0042', nameEn:'Surgical Gloves (Medium)',   nameLao:'ຖົງມື',               cat:'Medical', unit:'Box',  stock:12,  reorder:50,  price:45_000,   status:'Low'      },
  { code:'ITM-MS-0015', nameEn:'Syringe 5ml',                nameLao:'ເຂັມສີດ',             cat:'Medical', unit:'Box',  stock:8,   reorder:30,  price:35_000,   status:'Low'      },
  { code:'ITM-MS-0091', nameEn:'Face Mask N95',              nameLao:'ໜ້າກາກ N95',          cat:'Medical', unit:'Box',  stock:22,  reorder:100, price:120_000,  status:'Low'      },
  { code:'ITM-OF-0008', nameEn:'A4 Paper 80gsm',             nameLao:'ເຈ້ຍ A4',             cat:'Office',  unit:'Pack', stock:145, reorder:50,  price:28_000,   status:'In Stock' },
  { code:'ITM-OF-0021', nameEn:'Printer Toner (HP)',         nameLao:'ຫມຶກ HP',             cat:'Office',  unit:'Piece',stock:6,   reorder:5,   price:450_000,  status:'In Stock' },
  { code:'ITM-MS-0033', nameEn:'Bed Sheet (White)',          nameLao:'ຜ້າປູທີ່ນອນ',        cat:'Medical', unit:'Piece',stock:88,  reorder:30,  price:85_000,   status:'In Stock' },
  { code:'ITM-MS-0055', nameEn:'IV Tubing Set',              nameLao:'ທໍ່ IV',               cat:'Medical', unit:'Piece',stock:5,   reorder:20,  price:12_000,   status:'Low'      },
  { code:'ITM-MS-0077', nameEn:'Alcohol 70% 1L',             nameLao:'ເຫລົ້ານ້ຳ 70%',      cat:'Medical', unit:'Bottle',stock:15, reorder:50,  price:18_000,   status:'Low'      },
  { code:'ITM-MS-0102', nameEn:'Paracetamol 500mg Tab',      nameLao:'ຢາພາລາ 500mg',       cat:'Medical', unit:'Box',  stock:230, reorder:100, price:32_000,   status:'In Stock' },
  { code:'ITM-EQ-0004', nameEn:'Blood Pressure Monitor',     nameLao:'ເຄື່ອງວັດຄວາມດັນ',  cat:'Equipment',unit:'Piece',stock:4,  reorder:2,   price:2_500_000,status:'In Stock' },
  { code:'ITM-MS-0118', nameEn:'Sterile Gauze 10x10cm',      nameLao:'ຜ້າກອດ',             cat:'Medical', unit:'Pack', stock:0,   reorder:30,  price:8_500,    status:'Out'      },
  { code:'ITM-MS-0063', nameEn:'Amoxicillin 500mg Cap',      nameLao:'ຢາ Amoxicillin',     cat:'Medical', unit:'Box',  stock:45,  reorder:30,  price:55_000,   status:'In Stock' },
  { code:'ITM-OF-0034', nameEn:'Pen Ballpoint (Blue)',        nameLao:'ປາກກາ',              cat:'Office',  unit:'Box',  stock:12,  reorder:5,   price:5_000,    status:'In Stock' },
  { code:'ITM-MS-0085', nameEn:'Urine Test Strip',            nameLao:'ສາຍທົດສອບ',         cat:'Medical', unit:'Box',  stock:8,   reorder:10,  price:145_000,  status:'Expiring' },
  { code:'ITM-EQ-0019', nameEn:'Thermometer Digital',         nameLao:'ທ່ອງທາດ',            cat:'Equipment',unit:'Piece',stock:22, reorder:5,   price:180_000,  status:'In Stock' },
]

export default function InventoryPage() {
  return (
    <AppShell breadcrumbs={[{ label: 'Inventory & Purchasing' }]}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold">
            Inventory &amp; Purchasing
            <span className="ml-2 text-sm font-normal text-muted-foreground">ສິນຄ້າຄົງຄັງ ແລະ ການຈັດຊື້</span>
          </h1>
          <p className="text-xs text-muted-foreground">Dashboard overview — INV-001</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/inventory/items/new">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <Plus className="w-3.5 h-3.5" />New Item
            </Button>
          </Link>
          <Link href="/admin/inventory/purchasing/new">
            <Button size="sm" className="h-8 text-xs gap-1">
              <Plus className="w-3.5 h-3.5" />New Requisition
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <StatCard label="Total Items"          value="1,847"        icon={Package} />
          <StatCard label="Stock Value"          value="LAK 890.5M"   icon={Package} />
          <StatCard label="Low Stock Alerts"     value="23"           icon={AlertTriangle} alert />
          <StatCard label="Pending POs"          value="8"            icon={ShoppingCart} />
          <StatCard label="Received This Month"  value="142 items"    icon={TruckIcon} delta="+12%" deltaType="up" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-3 bg-card border border-border rounded-lg p-4 shadow-sm">
            <p className="text-xs font-semibold mb-3">Stock Movement — Last 14 Days</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stockMovement} barSize={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 9 }} interval={1} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Bar dataKey="In"  fill="#0F766E" radius={[2,2,0,0]} />
                <Bar dataKey="Out" fill="#F59E0B" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="lg:col-span-2 bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="px-3 py-2 border-b border-border flex items-center justify-between">
              <p className="text-xs font-semibold">Top 5 Low Stock Items</p>
              <Link href="/admin/inventory/stock" className="text-[10px] text-primary hover:underline">View all</Link>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-3 py-1.5 font-medium text-muted-foreground">Item</th>
                  <th className="text-right px-2 py-1.5 font-medium text-muted-foreground">Qty</th>
                  <th className="text-right px-2 py-1.5 font-medium text-muted-foreground">Days</th>
                  <th className="px-2 py-1.5"></th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((r, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-3 py-1.5 text-[11px]">{r.item}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums text-destructive font-medium">{r.curr}/{r.reorder}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{r.days}d</td>
                    <td className="px-2 py-1.5">
                      <Link href="/admin/inventory/purchasing/new" className="text-[10px] text-primary hover:underline whitespace-nowrap">
                        Create PR
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory table */}
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <p className="text-xs font-semibold">Inventory Status / ສະຖານະສາງ</p>
            <Link href="/admin/inventory/stock" className="text-[11px] text-primary hover:underline">Open stock view →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Item Code','Item Name','Category','Unit','Stock','Reorder Lvl','Unit Price (LAK)','Total Value (LAK)','Status',''].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INVENTORY.map(r => (
                  <tr key={r.code} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-3 py-1.5 font-mono text-[10px] text-muted-foreground">{r.code}</td>
                    <td className="px-3 py-1.5">
                      <p className="font-medium">{r.nameEn}</p>
                      <p className="text-[10px] text-muted-foreground">{r.nameLao}</p>
                    </td>
                    <td className="px-3 py-1.5 text-muted-foreground">{r.cat}</td>
                    <td className="px-3 py-1.5 text-muted-foreground">{r.unit}</td>
                    <td className={`px-3 py-1.5 tabular-nums font-medium ${r.stock === 0 ? 'text-destructive' : r.stock < r.reorder ? 'text-amber-600' : ''}`}>{r.stock}</td>
                    <td className="px-3 py-1.5 tabular-nums text-muted-foreground">{r.reorder}</td>
                    <td className="px-3 py-1.5 tabular-nums text-right">{r.price.toLocaleString()}</td>
                    <td className="px-3 py-1.5 tabular-nums text-right">{(r.price * r.stock).toLocaleString()}</td>
                    <td className="px-3 py-1.5"><StatusBadge status={r.status as 'In Stock' | 'Low' | 'Out' | 'Expiring'} /></td>
                    <td className="px-3 py-1.5">
                      <button className="p-1 hover:bg-muted rounded text-muted-foreground"><Eye className="w-3 h-3" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
