'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import {
  ArrowLeft, ArrowRight, CheckCircle2, Plus, Save, Trash2, X,
} from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { WorkflowStepper } from '@/components/mis/WorkflowStepper'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { usePRStore, type PRItem, type PRApprover, type PurchaseRequisition } from '@/lib/stores/prStore'

type Priority = 'Normal' | 'Urgent' | 'Critical'

const ITEM_CATALOG = [
  { code: 'ITM-MS-0042', name: 'Surgical Gloves (Medium)', unit: 'Box',    price: 45_000  },
  { code: 'ITM-MS-0015', name: 'Syringe 5ml',              unit: 'Box',    price: 35_000  },
  { code: 'ITM-MS-0055', name: 'IV Tubing Set',             unit: 'Piece',  price: 12_000  },
  { code: 'ITM-MS-0077', name: 'Alcohol 70% 1L',            unit: 'Bottle', price: 18_000  },
  { code: 'ITM-MS-0091', name: 'Face Mask N95',             unit: 'Box',    price: 120_000 },
]

const APPROVERS_POOL: PRApprover[] = [
  { actor: 'Khamla Boupha', role: 'Dept Head — Nursing',  action: 'pending' },
  { actor: 'Phonsa L.',     role: 'Purchasing Manager',   action: 'pending' },
  { actor: 'Noy S.',        role: 'Finance Manager',      action: 'pending' },
  { actor: 'Dr. Somchay',   role: 'Medical Director',     action: 'pending' },
]

const STEPS = ['Requisition Info', 'Items', 'Approvers', 'Review & Submit']

const uid = () => Math.random().toString(36).slice(2, 9)

const nextRef = () => {
  const num = String(Math.floor(Math.random() * 900) + 100)
  return `PR-2026-0${num}`
}

export default function NewRequisitionPage() {
  const router  = useRouter()
  const { addPR } = usePRStore()

  const [step, setStep]           = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [draftRef]                = useState(nextRef)

  // Step 1
  const [reqDate, setReqDate]     = useState(new Date().toISOString().split('T')[0])
  const [requiredBy, setRequiredBy] = useState('')
  const [department, setDepartment] = useState('Nursing')
  const [requester]               = useState('Khamla Boupha')
  const [priority, setPriority]   = useState<Priority>('Urgent')
  const [purpose, setPurpose]     = useState('')

  // Step 2
  const [items, setItems] = useState<PRItem[]>([
    { id: uid(), code: ITEM_CATALOG[0].code, name: ITEM_CATALOG[0].name, unit: ITEM_CATALOG[0].unit, price: ITEM_CATALOG[0].price, qty: 1, note: '' },
  ])

  // Step 3
  const [approvers, setApprovers] = useState<PRApprover[]>([
    { actor: 'Khamla Boupha', role: 'Dept Head — Nursing',  action: 'pending' },
    { actor: 'Phonsa L.',     role: 'Purchasing Manager',   action: 'pending' },
    { actor: 'Noy S.',        role: 'Finance Manager',      action: 'pending' },
  ])

  const validation = useMemo(() => ({
    0: Boolean(reqDate && requiredBy && department && priority && purpose.trim()),
    1: items.length > 0 && items.every(i => i.qty > 0),
    2: approvers.length > 0,
    3: true,
  }), [reqDate, requiredBy, department, priority, purpose, items, approvers])

  const subtotal = items.reduce((a, r) => a + r.price * r.qty, 0)

  const canNavigate = (target: number) => {
    if (target <= step) return true
    for (let i = 0; i < target; i++) {
      if (!validation[i as 0 | 1 | 2 | 3]) return false
    }
    return true
  }

  const goNext = () => { if (validation[step as 0 | 1 | 2 | 3]) setStep(s => Math.min(STEPS.length - 1, s + 1)) }
  const goBack = () => setStep(s => Math.max(0, s - 1))

  const handleSubmit = () => {
    const newPR: PurchaseRequisition = {
      ref: draftRef,
      title: `${department} Requisition — ${new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`,
      dept: department,
      requestedBy: requester,
      priority,
      purpose,
      items,
      approvers: approvers.map((a, i) =>
        i === 0 ? { ...a, action: 'submitted', date: new Date().toLocaleDateString('en-GB') } : a
      ),
      dateRaised: reqDate,
      requiredBy,
      status: 'Pending',
      workflowStep: 1,
    }
    addPR(newPR)
    setSubmitted(true)
    setTimeout(() => router.push('/admin/inventory/purchasing'), 1200)
  }

  const addItem = () => {
    const c = ITEM_CATALOG[0]
    setItems(list => [...list, { id: uid(), code: c.code, name: c.name, unit: c.unit, price: c.price, qty: 1, note: '' }])
  }
  const removeItem = (id: string) => setItems(list => list.filter(i => i.id !== id))
  const updateItem = (id: string, patch: Partial<PRItem>) =>
    setItems(list => list.map(i => (i.id === id ? { ...i, ...patch } : i)))
  const setItemFromCatalog = (id: string, code: string) => {
    const c = ITEM_CATALOG.find(x => x.code === code)
    if (c) updateItem(id, { code: c.code, name: c.name, unit: c.unit, price: c.price })
  }

  const addApprover = () => {
    const used = new Set(approvers.map(a => a.actor))
    const next = APPROVERS_POOL.find(a => !used.has(a.actor))
    if (next) setApprovers(list => [...list, { ...next }])
  }
  const removeApprover = (idx: number) => setApprovers(list => list.filter((_, i) => i !== idx))

  if (submitted) {
    return (
      <AppShell breadcrumbs={[{ label: 'Inventory', href: '/admin/inventory' }, { label: 'Purchasing', href: '/admin/inventory/purchasing' }, { label: 'New Requisition' }]}>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-2">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold">Requisition Submitted</h2>
          <p className="text-xs text-muted-foreground font-mono">{draftRef}</p>
          <p className="text-xs text-muted-foreground">Redirecting to the requisition list…</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      breadcrumbs={[
        { label: 'Inventory', href: '/admin/inventory' },
        { label: 'Purchasing', href: '/admin/inventory/purchasing' },
        { label: 'New Requisition' },
      ]}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/inventory/purchasing" className="p-1.5 rounded-md hover:bg-muted text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">
                New Purchase Requisition
                <span className="ml-2 text-sm font-normal text-muted-foreground">ສ້າງຄຳຮ້ອງຊື້ໃໝ່</span>
              </h1>
              <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">{draftRef}</span>
              <StatusBadge status="Draft" />
            </div>
            <p className="text-xs text-muted-foreground">Complete each step to raise a requisition for approval</p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-card border border-border rounded-lg p-4 mb-4">
        <WorkflowStepper
          steps={STEPS}
          currentStep={step}
          onStepClick={setStep}
          canNavigate={canNavigate}
        />
      </div>

      <div className="bg-card border border-border rounded-lg p-4 min-h-85">
        {step === 0 && (
          <StepInfo
            reqDate={reqDate}    setReqDate={setReqDate}
            requiredBy={requiredBy} setRequiredBy={setRequiredBy}
            department={department} setDepartment={setDepartment}
            requester={requester}
            priority={priority}  setPriority={setPriority}
            purpose={purpose}    setPurpose={setPurpose}
          />
        )}
        {step === 1 && (
          <StepItems
            items={items}
            addItem={addItem}
            removeItem={removeItem}
            updateItem={updateItem}
            setItemFromCatalog={setItemFromCatalog}
            subtotal={subtotal}
          />
        )}
        {step === 2 && (
          <StepApprovers approvers={approvers} addApprover={addApprover} removeApprover={removeApprover} />
        )}
        {step === 3 && (
          <StepReview
            reqDate={reqDate} requiredBy={requiredBy}
            department={department} requester={requester}
            priority={priority} purpose={purpose}
            items={items} approvers={approvers} subtotal={subtotal}
          />
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <p className="text-xs text-muted-foreground">
          Step <span className="font-semibold text-foreground">{step + 1}</span> of {STEPS.length} — {STEPS[step]}
        </p>
        <div className="flex items-center gap-2">
          <Link href="/admin/inventory/purchasing">
            <Button type="button" variant="ghost" size="sm" className="text-xs h-8 gap-1">
              <X className="w-3.5 h-3.5" />Cancel
            </Button>
          </Link>
          <Button type="button" variant="outline" size="sm" className="text-xs h-8 gap-1">
            <Save className="w-3.5 h-3.5" />Save Draft
          </Button>
          {step > 0 && (
            <Button type="button" variant="outline" size="sm" className="text-xs h-8 gap-1" onClick={goBack}>
              <ArrowLeft className="w-3.5 h-3.5" />Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button type="button" size="sm" className="text-xs h-8 gap-1" onClick={goNext} disabled={!validation[step as 0 | 1 | 2 | 3]}>
              Next<ArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button type="button" size="sm" className="text-xs h-8 gap-1" onClick={handleSubmit}>
              Submit for Authorization<CheckCircle2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  )
}

// ── Step components ──────────────────────────────────────────────────────────

function StepInfo(p: {
  reqDate: string; setReqDate(v: string): void
  requiredBy: string; setRequiredBy(v: string): void
  department: string; setDepartment(v: string): void
  requester: string
  priority: Priority; setPriority(v: Priority): void
  purpose: string; setPurpose(v: string): void
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 border-b border-border">
        Requisition Info / ຂໍ້ມູນຄຳຮ້ອງ
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs mb-1 block">Requisition Date <span className="text-destructive">*</span></Label>
          <Input type="date" className="h-8 text-xs" value={p.reqDate} onChange={e => p.setReqDate(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Required By <span className="text-destructive">*</span></Label>
          <Input type="date" className="h-8 text-xs" value={p.requiredBy} onChange={e => p.setRequiredBy(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Requesting Department <span className="text-destructive">*</span></Label>
          <Select value={p.department} onValueChange={p.setDepartment}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['Nursing', 'Finance', 'HR', 'Pharmacy', 'Lab', 'IT', 'Administration'].map(d => (
                <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs mb-1 block">Requester</Label>
          <Input className="h-8 text-xs" value={p.requester} readOnly />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Priority <span className="text-destructive">*</span></Label>
          <Select value={p.priority} onValueChange={v => p.setPriority(v as Priority)}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(['Normal', 'Urgent', 'Critical'] as Priority[]).map(x => (
                <SelectItem key={x} value={x} className="text-xs">{x}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div />
        <div className="col-span-2">
          <Label className="text-xs mb-1 block">Purpose / Justification <span className="text-destructive">*</span></Label>
          <Textarea className="text-xs h-20 resize-none" value={p.purpose} onChange={e => p.setPurpose(e.target.value)} placeholder="Explain why these items are needed…" />
        </div>
      </div>
    </div>
  )
}

function StepItems(p: {
  items: PRItem[]
  addItem(): void
  removeItem(id: string): void
  updateItem(id: string, patch: Partial<PRItem>): void
  setItemFromCatalog(id: string, code: string): void
  subtotal: number
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3 pb-1 border-b border-border">
        <h3 className="text-xs font-semibold uppercase tracking-wide">Items / ລາຍການ</h3>
        <button type="button" onClick={p.addItem} className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
          <Plus className="w-3 h-3" />Add Item
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['#', 'Item', 'Unit', 'Unit Price (LAK)', 'Qty', 'Total (LAK)', 'Note', ''].map(h => (
                <th key={h} className="text-left px-2 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {p.items.map((r, idx) => (
              <tr key={r.id} className="border-b border-border/50">
                <td className="px-2 py-1.5 text-muted-foreground">{idx + 1}</td>
                <td className="px-2 py-1.5 min-w-[220px]">
                  <Select value={r.code} onValueChange={v => p.setItemFromCatalog(r.id, v)}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ITEM_CATALOG.map(c => (
                        <SelectItem key={c.code} value={c.code} className="text-xs">
                          <span className="font-mono text-[10px] mr-2">{c.code}</span>{c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-2 py-1.5 text-muted-foreground">{r.unit}</td>
                <td className="px-2 py-1.5 tabular-nums text-right">{r.price.toLocaleString()}</td>
                <td className="px-2 py-1.5">
                  <Input type="number" min={1} className="h-7 text-xs w-20 tabular-nums" value={r.qty}
                    onChange={e => p.updateItem(r.id, { qty: Math.max(0, Number(e.target.value) || 0) })} />
                </td>
                <td className="px-2 py-1.5 tabular-nums text-right font-medium">{(r.price * r.qty).toLocaleString()}</td>
                <td className="px-2 py-1.5">
                  <Input className="h-7 text-xs" placeholder="Optional" value={r.note}
                    onChange={e => p.updateItem(r.id, { note: e.target.value })} />
                </td>
                <td className="px-2 py-1.5">
                  <button type="button" onClick={() => p.removeItem(r.id)} className="p-1 rounded hover:bg-muted text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {p.items.length === 0 && (
              <tr><td colSpan={8} className="px-2 py-6 text-center text-xs text-muted-foreground">No items — click "Add Item" to begin.</td></tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-muted/20">
              <td colSpan={5} className="px-3 py-2 text-xs font-semibold text-right">Subtotal</td>
              <td className="px-2 py-2 tabular-nums font-bold text-right text-xs">LAK {p.subtotal.toLocaleString()}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

function StepApprovers(p: { approvers: PRApprover[]; addApprover(): void; removeApprover(idx: number): void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3 pb-1 border-b border-border">
        <h3 className="text-xs font-semibold uppercase tracking-wide">Approval Chain / ລຳດັບການອະນຸມັດ</h3>
        <button type="button" onClick={p.addApprover} className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
          <Plus className="w-3 h-3" />Add Approver
        </button>
      </div>
      <div className="space-y-2">
        {p.approvers.map((a, i) => (
          <div key={i} className="flex items-center gap-3 bg-muted/20 border border-border/60 rounded-md px-3 py-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">{i + 1}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{a.actor}</p>
              <p className="text-[10px] text-muted-foreground">{a.role}</p>
            </div>
            <button type="button" onClick={() => p.removeApprover(i)} className="p-1 rounded hover:bg-muted text-destructive">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {p.approvers.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-6">No approvers — add at least one to proceed.</p>
        )}
      </div>
    </div>
  )
}

function StepReview(p: {
  reqDate: string; requiredBy: string; department: string; requester: string
  priority: Priority; purpose: string; items: PRItem[]; approvers: PRApprover[]; subtotal: number
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 border-b border-border">Review / ກວດຄືນ</h3>
        <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
          {[
            ['Requisition Date', p.reqDate],
            ['Required By',      p.requiredBy],
            ['Department',       p.department],
            ['Requester',        p.requester],
            ['Priority',         p.priority],
          ].map(([l, v]) => (
            <div key={l}>
              <p className="text-[10px] text-muted-foreground uppercase">{l}</p>
              <p className="font-medium">{v}</p>
            </div>
          ))}
          <div className="col-span-3">
            <p className="text-[10px] text-muted-foreground uppercase">Purpose</p>
            <p className="text-xs">{p.purpose}</p>
          </div>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold mb-2">Items ({p.items.length})</p>
        <div className="border border-border rounded-md overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Code', 'Item', 'Qty', 'Unit', 'Unit Price', 'Total'].map(h => (
                  <th key={h} className="text-left px-3 py-1.5 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p.items.map(r => (
                <tr key={r.id} className="border-b border-border/50">
                  <td className="px-3 py-1.5 font-mono text-[10px]">{r.code}</td>
                  <td className="px-3 py-1.5">{r.name}</td>
                  <td className="px-3 py-1.5 tabular-nums">{r.qty}</td>
                  <td className="px-3 py-1.5 text-muted-foreground">{r.unit}</td>
                  <td className="px-3 py-1.5 tabular-nums text-right">{r.price.toLocaleString()}</td>
                  <td className="px-3 py-1.5 tabular-nums text-right font-medium">{(r.price * r.qty).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/20">
                <td colSpan={5} className="px-3 py-2 text-xs font-semibold text-right">Subtotal</td>
                <td className="px-3 py-2 text-xs font-bold tabular-nums text-right">LAK {p.subtotal.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold mb-2">Approval Chain</p>
        <div className="flex flex-wrap gap-2">
          {p.approvers.map((a, i) => (
            <div key={i} className="flex items-center gap-2 bg-muted/30 border border-border/60 rounded-md px-2.5 py-1.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">{i + 1}</span>
              <div>
                <p className="text-[11px] font-medium leading-tight">{a.actor}</p>
                <p className="text-[9px] text-muted-foreground">{a.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
