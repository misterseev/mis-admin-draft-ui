'use client'

import { useState } from 'react'
import { Plus, Eye, Wrench, Trash2 } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'
import { StatusBadge } from '@/components/mis/StatusBadge'

type EventType = 'Maintenance' | 'Repair' | 'Transfer' | 'Disposal' | 'Inspection' | 'Upgrade'

interface LifecycleEvent {
  ref: string
  assetCode: string
  assetName: string
  eventType: EventType
  date: string
  cost?: string
  performedBy: string
  notes: string
  status: 'Completed' | 'Scheduled' | 'In Progress'
}

const EVENTS: LifecycleEvent[] = [
  { ref: 'LCE-2026-0052', assetCode: 'AST-2023-0352', assetName: 'Autoclave Sterilizer',          eventType: 'Repair',      date: '20/04/2026', cost: 'LAK 3,200,000', performedBy: 'MedEquip Lao',    notes: 'Heating element replacement',        status: 'In Progress' },
  { ref: 'LCE-2026-0051', assetCode: 'AST-2021-0211', assetName: 'Ambulance (Toyota Hiace)',        eventType: 'Maintenance', date: '15/04/2026', cost: 'LAK 850,000',   performedBy: 'Toyota Lao',      notes: '30,000km service & oil change',      status: 'Completed'   },
  { ref: 'LCE-2026-0050', assetCode: 'AST-2024-0441', assetName: 'Ultrasound Machine (Portable)',   eventType: 'Inspection',  date: '10/04/2026', cost: '—',             performedBy: 'GE Healthcare',   notes: 'Annual calibration check',           status: 'Completed'   },
  { ref: 'LCE-2026-0049', assetCode: 'AST-2022-0288', assetName: 'Split AC Unit (2 Ton)',           eventType: 'Maintenance', date: '05/04/2026', cost: 'LAK 400,000',   performedBy: 'CoolTech Lao',    notes: 'Filter clean & gas refill',          status: 'Completed'   },
  { ref: 'LCE-2026-0048', assetCode: 'AST-2024-0512', assetName: 'Desktop Computer (HP Prodesk)',   eventType: 'Transfer',    date: '01/04/2026', cost: '—',             performedBy: 'IT Dept',         notes: 'Moved from HR to Finance Dept',      status: 'Completed'   },
  { ref: 'LCE-2026-0047', assetCode: 'AST-2019-0088', assetName: 'Laboratory Centrifuge',           eventType: 'Disposal',    date: '28/03/2026', cost: '—',             performedBy: 'Asset Committee', notes: 'Beyond economic repair, disposed',   status: 'Completed'   },
  { ref: 'LCE-2026-0046', assetCode: 'AST-2023-0401', assetName: 'Generator (Diesel 50kVA)',        eventType: 'Maintenance', date: '05/05/2026', cost: 'LAK 1,200,000', performedBy: 'Cummins Lao',     notes: 'Scheduled 500hr service',            status: 'Scheduled'   },
  { ref: 'LCE-2026-0045', assetCode: 'AST-2022-0301', assetName: 'Digital X-Ray System',            eventType: 'Upgrade',     date: '10/05/2026', cost: 'LAK 45,000,000',performedBy: 'Philips Lao',     notes: 'Software update + detector upgrade', status: 'Scheduled'   },
]

const EVENT_COLORS: Record<EventType, string> = {
  Maintenance: 'bg-blue-50 text-blue-700',
  Repair:      'bg-red-50 text-red-700',
  Transfer:    'bg-amber-50 text-amber-700',
  Disposal:    'bg-slate-100 text-slate-600',
  Inspection:  'bg-emerald-50 text-emerald-700',
  Upgrade:     'bg-purple-50 text-purple-700',
}

export default function AssetLifecyclePage() {
  const [tab, setTab] = useState<'events' | 'schedule'>('events')

  const upcomingEvents = EVENTS.filter(e => e.status === 'Scheduled')
  const pastEvents = EVENTS.filter(e => e.status !== 'Scheduled')

  return (
    <AppShell breadcrumbs={[{ label: 'Asset', href: '/admin/asset' }, { label: 'Lifecycle' }]}>
      <PageHeader
        title="Asset Lifecycle"
        titleLao="ວົງຈອນຊັບສິນ"
        description="Maintenance, repairs, transfers, upgrades, and disposals · AST-002"
        primaryAction={{ label: '+ Log Event', icon: <Plus className="w-3.5 h-3.5" /> }}
      />

      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Events This Quarter', value: EVENTS.length,                                          color: 'text-foreground' },
          { label: 'Scheduled',           value: EVENTS.filter(e => e.status === 'Scheduled').length,    color: 'text-blue-600'   },
          { label: 'In Progress',         value: EVENTS.filter(e => e.status === 'In Progress').length,  color: 'text-amber-600'  },
          { label: 'Total Maint. Cost',   value: 'LAK 5.65M',                                            color: 'text-primary'    },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming */}
      {upcomingEvents.length > 0 && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 border-b border-blue-200">
            <p className="text-xs font-semibold text-blue-800">Upcoming Scheduled Maintenance</p>
          </div>
          <div className="divide-y divide-blue-200">
            {upcomingEvents.map(e => (
              <div key={e.ref} className="flex items-center gap-4 px-4 py-2.5">
                <Wrench className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-blue-900">{e.assetName}</p>
                  <p className="text-[10px] text-blue-700">{e.notes}</p>
                </div>
                <span className="text-xs text-blue-700 tabular-nums">{e.date}</span>
                {e.cost !== '—' && <span className="text-xs font-medium text-blue-900">{e.cost}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border">
          <p className="text-xs font-semibold text-foreground">Lifecycle Event Log</p>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Reference','Asset','Event Type','Date','Cost','Performed By','Notes','Status',''].map(h => (
                <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EVENTS.map(e => (
              <tr key={e.ref} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{e.ref}</td>
                <td className="px-3 py-2">
                  <p className="font-medium">{e.assetName}</p>
                  <p className="text-[10px] text-muted-foreground">{e.assetCode}</p>
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${EVENT_COLORS[e.eventType]}`}>
                    {e.eventType}
                  </span>
                </td>
                <td className="px-3 py-2 tabular-nums text-muted-foreground">{e.date}</td>
                <td className="px-3 py-2 tabular-nums text-foreground">{e.cost ?? '—'}</td>
                <td className="px-3 py-2 text-muted-foreground">{e.performedBy}</td>
                <td className="px-3 py-2 text-muted-foreground max-w-[160px] truncate">{e.notes}</td>
                <td className="px-3 py-2"><StatusBadge status={e.status} /></td>
                <td className="px-3 py-2">
                  <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary"><Eye className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}
