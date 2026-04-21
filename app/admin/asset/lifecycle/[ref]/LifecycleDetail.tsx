'use client'

import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { useAssetStore, fmtLak } from '@/lib/stores/assetStore'

const EVENT_COLORS: Record<string, string> = {
  Maintenance: 'bg-blue-50 text-blue-700 border-blue-200',
  Repair:      'bg-red-50 text-red-700 border-red-200',
  Transfer:    'bg-amber-50 text-amber-700 border-amber-200',
  Disposal:    'bg-slate-100 text-slate-600 border-slate-200',
  Inspection:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  Upgrade:     'bg-purple-50 text-purple-700 border-purple-200',
}

export default function LifecycleDetail({ eventRef }: { eventRef: string }) {
  const { events, assets, updateEvent } = useAssetStore()
  const event = events.find(e => e.ref === decodeURIComponent(eventRef))
  const asset = event ? assets.find(a => a.code === event.assetCode) : undefined

  if (!event) {
    return (
      <AppShell breadcrumbs={[{ label: 'Asset', href: '/admin/asset' }, { label: 'Lifecycle', href: '/admin/asset/lifecycle' }, { label: eventRef }]}>
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p className="text-sm font-medium">Event not found</p>
          <Link href="/admin/asset/lifecycle" className="text-xs text-primary hover:underline mt-2">← Back</Link>
        </div>
      </AppShell>
    )
  }

  const colorClass = EVENT_COLORS[event.eventType] ?? 'bg-slate-100 text-slate-600 border-slate-200'

  function markComplete() {
    updateEvent(event!.ref, { status: 'Completed' })
  }

  return (
    <AppShell breadcrumbs={[
      { label: 'Asset', href: '/admin/asset' },
      { label: 'Lifecycle', href: '/admin/asset/lifecycle' },
      { label: event.ref },
    ]}>
      {/* Header */}
      {/* <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/asset/lifecycle" className="p-1.5 rounded-md hover:bg-muted text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold">Lifecycle Event</h1>
              <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">{event.ref}</span>
              <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${colorClass}`}>{event.eventType}</span>
              <StatusBadge status={event.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Asset: <span className="font-medium">{event.assetName}</span> ·
              <span className="font-mono ml-1">{event.assetCode}</span> ·
              Date: <span className="font-medium">{event.date}</span>
            </p>
          </div>
        </div>
        {event.status !== 'Completed' && (
          <button
            onClick={markComplete}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />Mark Complete
          </button>
        )}
      </div> */}

      <div className="flex gap-4">
        <div className="flex-1 min-w-0 space-y-4">
          {/* Event Details */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 border-b border-border">Event Details</h3>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {[
                ['Reference',    event.ref],
                ['Event Type',   event.eventType],
                ['Date',         event.date],
                ['Performed By', event.performedBy],
                ['Cost',         event.cost ? fmtLak(event.cost) : '—'],
                ['Status',       event.status],
                ...(event.fromDept ? [['From Department', event.fromDept]] : []),
                ...(event.toDept   ? [['To Department',   event.toDept]]   : []),
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-[10px] text-muted-foreground uppercase">{l}</p>
                  <p className="font-medium">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {event.notes && (
            <div className="bg-muted/40 border border-border rounded-lg px-4 py-2.5">
              <p className="text-[10px] text-muted-foreground uppercase font-medium mb-0.5">Notes</p>
              <p className="text-xs">{event.notes}</p>
            </div>
          )}

          {/* Asset Info */}
          {asset && (
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3 pb-1 border-b border-border">
                <h3 className="text-xs font-semibold uppercase tracking-wide">Related Asset</h3>
                <Link href={`/admin/asset/${encodeURIComponent(asset.code)}`} className="text-[10px] text-primary hover:underline">View Asset →</Link>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                {[
                  ['Asset Code',  asset.code],
                  ['Name',        asset.name],
                  ['Category',    asset.category],
                  ['Brand',       asset.brand],
                  ['Serial No.',  asset.serialNo],
                  ['Department',  asset.dept],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-[10px] text-muted-foreground uppercase">{l}</p>
                    <p className="font-medium">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-52 shrink-0">
          <div className="bg-card border border-border rounded-lg p-3 space-y-2 text-xs">
            <p className="font-semibold uppercase text-[10px] tracking-wide text-muted-foreground">Summary</p>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${colorClass}`}>{event.eventType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <StatusBadge status={event.status} />
            </div>
            {event.cost && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cost</span>
                <span className="font-medium">{fmtLak(event.cost)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{event.date}</span>
            </div>
            <div className="pt-1 border-t border-border flex justify-between">
              <span className="text-muted-foreground">Vendor</span>
              <span className="font-medium text-right max-w-[110px] truncate">{event.performedBy}</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
