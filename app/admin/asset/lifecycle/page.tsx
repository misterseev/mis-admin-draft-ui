'use client'

import { Plus, Eye, Wrench } from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { useAssetStore, fmtLak } from '@/lib/stores/assetStore'

const EVENT_COLORS: Record<string, string> = {
  Maintenance: 'bg-blue-50 text-blue-700',
  Repair:      'bg-red-50 text-red-700',
  Transfer:    'bg-amber-50 text-amber-700',
  Disposal:    'bg-slate-100 text-slate-600',
  Inspection:  'bg-emerald-50 text-emerald-700',
  Upgrade:     'bg-purple-50 text-purple-700',
}

export default function AssetLifecyclePage() {
  const { events } = useAssetStore()

  const upcomingEvents = events.filter(e => e.status === 'Scheduled')
  const totalCost = events.reduce((s, e) => s + (e.cost ?? 0), 0)

  return (
    <AppShell breadcrumbs={[{ label: 'Asset', href: '/admin/asset' }, { label: 'Lifecycle' }]}>
      <PageHeader
        title="Asset Lifecycle"
        titleLao="ວົງຈອນຊັບສິນ"
        description="Maintenance, repairs, transfers, upgrades, and disposals · AST-002"
        primaryAction={{ label: 'Log Event', icon: <Plus className="w-3.5 h-3.5" />, href: '/admin/asset/lifecycle/new' }}
      />

      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Events This Quarter', value: events.length,                                           color: 'text-foreground' },
          { label: 'Scheduled',           value: events.filter(e => e.status === 'Scheduled').length,     color: 'text-blue-600'   },
          { label: 'In Progress',         value: events.filter(e => e.status === 'In Progress').length,   color: 'text-amber-600'  },
          { label: 'Total Maint. Cost',   value: fmtLak(totalCost),                                       color: 'text-primary'    },
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
                <Wrench className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-blue-900">{e.assetName}</p>
                  <p className="text-[10px] text-blue-700">{e.notes}</p>
                </div>
                <span className="text-xs text-blue-700 tabular-nums">{e.date}</span>
                {e.cost && <span className="text-xs font-medium text-blue-900">{fmtLak(e.cost)}</span>}
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
            {events.map(e => (
              <tr key={e.ref} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{e.ref}</td>
                <td className="px-3 py-2">
                  <p className="font-medium">{e.assetName}</p>
                  <p className="text-[10px] text-muted-foreground">{e.assetCode}</p>
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${EVENT_COLORS[e.eventType] ?? ''}`}>
                    {e.eventType}
                  </span>
                </td>
                <td className="px-3 py-2 tabular-nums text-muted-foreground">{e.date}</td>
                <td className="px-3 py-2 tabular-nums text-foreground">{e.cost ? fmtLak(e.cost) : '—'}</td>
                <td className="px-3 py-2 text-muted-foreground">{e.performedBy}</td>
                <td className="px-3 py-2 text-muted-foreground max-w-40 truncate">{e.notes}</td>
                <td className="px-3 py-2"><StatusBadge status={e.status} /></td>
                <td className="px-3 py-2">
                  <Link href={`/admin/asset/lifecycle/${encodeURIComponent(e.ref)}`} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary inline-flex">
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}
