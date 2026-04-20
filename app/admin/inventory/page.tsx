'use client'

import { useState } from 'react'
import { Package, AlertTriangle, ShoppingCart, TruckIcon, Plus, Eye } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { StatCard } from '@/components/mis/StatCard'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { WorkflowStepper, type Step } from '@/components/mis/WorkflowStepper'
import { ApprovalPanel } from '@/components/mis/ApprovalPanel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

const REQ_STEPS: Step[] = [
  { label: 'Draft',         status: 'current'  },
  { label: 'Authorization', status: 'upcoming' },
  { label: 'Order',         status: 'upcoming' },
  { label: 'Inspection',    status: 'upcoming' },
  { label: 'Goods Receipt', status: 'upcoming' },
]

const REQ_ITEMS = [
  { num:1, code:'ITM-MS-0042', name:'Surgical Gloves (Medium)', unit:'Box',  price:45_000,  qty:100, note:'Urgent — critically low' },
  { num:2, code:'ITM-MS-0015', name:'Syringe 5ml',              unit:'Box',  price:35_000,  qty:50,  note:'' },
  { num:3, code:'ITM-MS-0055', name:'IV Tubing Set',             unit:'Piece',price:12_000, qty:200, note:'For surgical ward' },
]

export default function InventoryPage() {
  const [tab, setTab] = useState('dashboard')

  return (
    <AppShell breadcrumbs={[{ label: 'Inventory & Purchasing' }]}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold">
            Inventory &amp; Purchasing
            <span className="ml-2 text-sm font-normal text-muted-foreground">ສິນຄ້າຄົງຄັງ ແລະ ການຈັດຊື້</span>
          </h1>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1">
          <Plus className="w-3.5 h-3.5" />New Requisition
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-8 mb-4">
          <TabsTrigger value="dashboard" className="text-xs h-7">Inventory Dashboard (INV-001)</TabsTrigger>
          <TabsTrigger value="requisition" className="text-xs h-7">Purchase Requisition (INV-006)</TabsTrigger>
        </TabsList>

        {/* Dashboard tab */}
        <TabsContent value="dashboard" className="space-y-4">
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
                        <button className="text-[10px] text-primary hover:underline whitespace-nowrap">Create PO</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inventory table */}
          <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border">
              <p className="text-xs font-semibold">Inventory Status / ສະຖານະສາງ</p>
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
        </TabsContent>

        {/* Requisition tab */}
        <TabsContent value="requisition">
          {/* Stepper */}
          <div className="bg-card border border-border rounded-lg p-4 mb-4">
            <WorkflowStepper steps={REQ_STEPS} />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 min-w-0 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-sm font-semibold">New Purchase Requisition / ສ້າງຄຳຮ້ອງຊື້ໃໝ່</h2>
                <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">REQ-2026-0087</span>
                <StatusBadge status="Draft" />
              </div>

              {/* Requisition Info */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 border-b border-border">Requisition Info / ຂໍ້ມູນຄຳຮ້ອງ</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Requisition Date', '20/04/2026'],
                    ['Required By Date', '30/04/2026'],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <Label className="text-xs mb-1 block">{l} <span className="text-destructive">*</span></Label>
                      <Input className="h-8 text-xs" defaultValue={v} />
                    </div>
                  ))}
                  <div>
                    <Label className="text-xs mb-1 block">Requesting Department <span className="text-destructive">*</span></Label>
                    <Select defaultValue="Nursing">
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['Nursing','Finance','HR','Pharmacy','Lab'].map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Requester</Label>
                    <Input className="h-8 text-xs" defaultValue="Khamla Boupha" readOnly />
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Priority <span className="text-destructive">*</span></Label>
                    <Select defaultValue="Urgent">
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['Normal','Urgent','Critical'].map(p => <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs mb-1 block">Purpose / Justification</Label>
                    <Textarea className="text-xs h-16 resize-none" defaultValue="Critical low stock in surgical ward. Required for scheduled procedures next week." />
                  </div>
                </div>
              </div>

              {/* Items table */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide">Items / ລາຍການ</p>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {['#','Item Code','Item Name','Unit','Unit Price (LAK)','Qty','Total (LAK)','Notes',''].map(h => (
                        <th key={h} className="text-left px-2 py-2 font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {REQ_ITEMS.map(r => (
                      <tr key={r.num} className="border-b border-border/50">
                        <td className="px-2 py-1.5 text-muted-foreground">{r.num}</td>
                        <td className="px-2 py-1.5 font-mono text-[10px]">{r.code}</td>
                        <td className="px-2 py-1.5">{r.name}</td>
                        <td className="px-2 py-1.5 text-muted-foreground">{r.unit}</td>
                        <td className="px-2 py-1.5 tabular-nums text-right">{r.price.toLocaleString()}</td>
                        <td className="px-2 py-1.5"><Input className="h-7 text-xs w-16 tabular-nums" defaultValue={r.qty} /></td>
                        <td className="px-2 py-1.5 tabular-nums text-right font-medium">{(r.price * r.qty).toLocaleString()}</td>
                        <td className="px-2 py-1.5 text-muted-foreground text-[10px]">{r.note}</td>
                        <td className="px-2 py-1.5"><button className="text-destructive text-[10px] hover:underline">Remove</button></td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-border bg-muted/20">
                      <td colSpan={6} className="px-3 py-2 text-xs font-semibold text-right">Subtotal</td>
                      <td className="px-2 py-2 tabular-nums font-semibold text-right text-xs">
                        {REQ_ITEMS.reduce((a, r) => a + r.price * r.qty, 0).toLocaleString()}
                      </td>
                      <td colSpan={2} />
                    </tr>
                  </tfoot>
                </table>
                <div className="px-4 py-2 border-t border-border">
                  <button className="text-xs text-primary hover:underline font-medium">+ Add Item</button>
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="w-56 flex-shrink-0">
              <ApprovalPanel
                entries={[
                  { actor: 'Khamla Boupha', role: 'Dept Head — Nursing', action: 'pending', comment: 'Approver for items < LAK 5M' },
                  { actor: 'Phonsa L.', role: 'Purchasing Manager', action: 'pending' },
                  { actor: 'Noy S.', role: 'Finance Manager', action: 'pending' },
                ]}
              />
            </div>
          </div>

          {/* Sticky bar */}
          <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-3">
            <Button variant="ghost" size="sm" className="text-xs h-8">Cancel</Button>
            <Button variant="outline" size="sm" className="text-xs h-8">Save Draft</Button>
            <Button size="sm" className="text-xs h-8">Submit for Authorization</Button>
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  )
}
