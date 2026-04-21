'use client'

import Link from 'next/link'
import { ArrowLeft, Edit, Wrench, QrCode, TrendingDown } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { useAssetStore, fmtLak } from '@/lib/stores/assetStore'

const CAT_COLORS: Record<string, string> = {
  'Medical Equipment': 'bg-blue-50 text-blue-700',
  'IT Equipment':      'bg-indigo-50 text-indigo-700',
  'Vehicles':          'bg-amber-50 text-amber-700',
  'Facility':          'bg-emerald-50 text-emerald-700',
}

const EVENT_COLORS: Record<string, string> = {
  Maintenance: 'bg-blue-50 text-blue-700',
  Repair:      'bg-red-50 text-red-700',
  Transfer:    'bg-amber-50 text-amber-700',
  Disposal:    'bg-slate-100 text-slate-600',
  Inspection:  'bg-emerald-50 text-emerald-700',
  Upgrade:     'bg-purple-50 text-purple-700',
}

function buildDepreciationSchedule(asset: { purchaseDate: string; purchaseCost: number; usefulLife: number; residualValue: number }) {
  const [dd, mm, yyyy] = asset.purchaseDate.split('/')
  const startYear = parseInt(yyyy)
  const depreciable = asset.purchaseCost - asset.residualValue
  const annualDep = depreciable / asset.usefulLife
  const rows = []
  let bookValue = asset.purchaseCost
  for (let i = 1; i <= asset.usefulLife; i++) {
    const dep = i < asset.usefulLife ? annualDep : bookValue - asset.residualValue
    bookValue = Math.max(bookValue - annualDep, asset.residualValue)
    rows.push({ year: startYear + i - 1, depreciation: Math.round(annualDep), accumulated: Math.round(annualDep * i), bookValue: Math.round(Math.max(bookValue, asset.residualValue)) })
  }
  return rows
}

export default function AssetDetail({ assetCode }: { assetCode: string }) {
  const { assets, events } = useAssetStore()
  const asset = assets.find(a => a.code === decodeURIComponent(assetCode))
  const assetEvents = events.filter(e => e.assetCode === assetCode).sort((a, b) => b.ref.localeCompare(a.ref))

  if (!asset) {
    return (
      <AppShell breadcrumbs={[{ label: 'Asset', href: '/admin/asset' }, { label: assetCode }]}>
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p className="text-sm font-medium">Asset not found</p>
          <Link href="/admin/asset" className="text-xs text-primary hover:underline mt-2">← Back to register</Link>
        </div>
      </AppShell>
    )
  }

  const depreciation = buildDepreciationSchedule(asset)
  const depPercent = Math.round(((asset.purchaseCost - asset.bookValue) / asset.purchaseCost) * 100)
  const totalCost = assetEvents.reduce((s, e) => s + (e.cost ?? 0), 0)

  return (
    <AppShell breadcrumbs={[
      { label: 'Asset', href: '/admin/asset' },
      { label: 'Asset Register', href: '/admin/asset' },
      { label: asset.code },
    ]}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/asset" className="p-1.5 rounded-md hover:bg-muted text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold">{asset.name}</h1>
              <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${CAT_COLORS[asset.category] ?? 'bg-slate-100'}`}>{asset.category}</span>
              <StatusBadge status={asset.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              <span className="font-mono">{asset.code}</span> · {asset.brand} {asset.model} · S/N: <span className="font-mono">{asset.serialNo}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/asset/${encodeURIComponent(asset.code)}/edit`} className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted">
            <Edit className="w-3.5 h-3.5" />Edit
          </Link>
          <Link href="/admin/asset/lifecycle/new" className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            <Wrench className="w-3.5 h-3.5" />Log Event
          </Link>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Main */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Details */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 border-b border-border">Asset Details</h3>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {[
                ['Asset Code',     asset.code],
                ['Category',       asset.category],
                ['Brand',          asset.brand],
                ['Model',          asset.model],
                ['Serial Number',  asset.serialNo],
                ['Department',     asset.dept],
                ['Location',       asset.location],
                ['Purchase Date',  asset.purchaseDate],
                ['Useful Life',    `${asset.usefulLife} years`],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-[10px] text-muted-foreground uppercase">{l}</p>
                  <p className="font-medium">{v}</p>
                </div>
              ))}
            </div>
            {asset.notes && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-[10px] text-muted-foreground uppercase mb-0.5">Notes</p>
                <p className="text-xs">{asset.notes}</p>
              </div>
            )}
          </div>

          {/* Depreciation Schedule */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs font-semibold uppercase tracking-wide">Straight-Line Depreciation Schedule</p>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Year', 'Annual Depreciation', 'Accumulated', 'Book Value'].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {depreciation.map((row, i) => (
                  <tr key={row.year} className={`border-b border-border/50 ${row.bookValue === asset.residualValue && i > 0 ? 'text-muted-foreground' : ''} hover:bg-muted/20`}>
                    <td className="px-3 py-1.5 tabular-nums font-medium">{row.year}</td>
                    <td className="px-3 py-1.5 tabular-nums text-red-600">({fmtLak(row.depreciation)})</td>
                    <td className="px-3 py-1.5 tabular-nums text-muted-foreground">{fmtLak(row.accumulated)}</td>
                    <td className="px-3 py-1.5 tabular-nums font-semibold">{fmtLak(row.bookValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lifecycle History */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide">Lifecycle History</p>
              <Link href="/admin/asset/lifecycle/new" className="text-[10px] text-primary hover:underline">+ Log Event</Link>
            </div>
            {assetEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">No lifecycle events recorded</p>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {['Ref', 'Type', 'Date', 'Cost', 'Performed By', 'Notes', 'Status'].map(h => (
                      <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assetEvents.map(e => (
                    <tr key={e.ref} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="px-3 py-1.5 font-mono text-[10px] text-muted-foreground">{e.ref}</td>
                      <td className="px-3 py-1.5">
                        <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${EVENT_COLORS[e.eventType] ?? ''}`}>{e.eventType}</span>
                      </td>
                      <td className="px-3 py-1.5 tabular-nums text-muted-foreground">{e.date}</td>
                      <td className="px-3 py-1.5 tabular-nums">{e.cost ? fmtLak(e.cost) : '—'}</td>
                      <td className="px-3 py-1.5 text-muted-foreground">{e.performedBy}</td>
                      <td className="px-3 py-1.5 text-muted-foreground max-w-[160px] truncate">{e.notes}</td>
                      <td className="px-3 py-1.5"><StatusBadge status={e.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-52 shrink-0 space-y-3">
          <div className="bg-card border border-border rounded-lg p-3 space-y-2 text-xs">
            <p className="font-semibold uppercase text-[10px] tracking-wide text-muted-foreground">Financial Summary</p>
            {[
              ['Purchase Cost', fmtLak(asset.purchaseCost)],
              ['Book Value', fmtLak(asset.bookValue)],
              ['Residual Value', fmtLak(asset.residualValue)],
              ['Total Maint. Cost', totalCost ? fmtLak(totalCost) : '—'],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between">
                <span className="text-muted-foreground">{l}</span>
                <span className="font-medium text-right">{v}</span>
              </div>
            ))}
            <div className="pt-1 border-t border-border">
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Depreciated</span>
                <span className="font-medium text-red-600">{depPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full" style={{ width: `${depPercent}%` }} />
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-xs">
            <p className="font-semibold uppercase text-[10px] tracking-wide text-muted-foreground mb-2">Status</p>
            <StatusBadge status={asset.status} />
            <p className="mt-2 text-muted-foreground">Dept: <span className="text-foreground font-medium">{asset.dept}</span></p>
            <p className="mt-1 text-muted-foreground">Location: <span className="text-foreground font-medium">{asset.location}</span></p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
