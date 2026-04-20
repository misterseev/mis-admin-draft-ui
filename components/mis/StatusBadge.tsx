import { cn } from '@/lib/utils'

type Status =
  | 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Active' | 'Closed'
  | 'Posted' | 'Paid' | 'Submitted' | 'Completed' | 'Disposed' | 'Under Repair'
  | 'Calculating' | 'On Leave' | 'Retired' | 'Terminated' | 'Low' | 'Out'
  | 'Expiring' | 'In Stock' | 'Locked' | 'Disabled' | 'Warning' | 'Over Budget'
  | string

const statusConfig: Record<string, { label: string; className: string }> = {
  Draft:         { label: 'Draft',         className: 'bg-slate-100 text-slate-600 border-slate-200' },
  Pending:       { label: 'Pending',       className: 'bg-amber-50  text-amber-700  border-amber-200' },
  Approved:      { label: 'Approved',      className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Rejected:      { label: 'Rejected',      className: 'bg-red-50    text-red-700    border-red-200' },
  Active:        { label: 'Active',        className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Closed:        { label: 'Closed',        className: 'bg-slate-100 text-slate-600 border-slate-200' },
  Posted:        { label: 'Posted',        className: 'bg-blue-50   text-blue-700   border-blue-200' },
  Paid:          { label: 'Paid',          className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Submitted:     { label: 'Submitted',     className: 'bg-blue-50   text-blue-700   border-blue-200' },
  Completed:     { label: 'Completed',     className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Disposed:      { label: 'Disposed',      className: 'bg-slate-100 text-slate-500 border-slate-200' },
  'Under Repair':{ label: 'Under Repair',  className: 'bg-orange-50 text-orange-700 border-orange-200' },
  Calculating:   { label: 'Calculating',   className: 'bg-amber-50  text-amber-700  border-amber-200' },
  'On Leave':    { label: 'On Leave',      className: 'bg-amber-50  text-amber-700  border-amber-200' },
  Retired:       { label: 'Retired',       className: 'bg-slate-100 text-slate-500 border-slate-200' },
  Terminated:    { label: 'Terminated',    className: 'bg-red-50    text-red-700    border-red-200' },
  Low:           { label: 'Low',           className: 'bg-amber-50  text-amber-700  border-amber-200' },
  Out:           { label: 'Out of Stock',  className: 'bg-red-50    text-red-700    border-red-200' },
  Expiring:      { label: 'Expiring',      className: 'bg-orange-50 text-orange-700 border-orange-200' },
  'In Stock':    { label: 'In Stock',      className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Locked:        { label: 'Locked',        className: 'bg-amber-50  text-amber-700  border-amber-200' },
  Disabled:      { label: 'Disabled',      className: 'bg-slate-100 text-slate-500 border-slate-200' },
  Warning:       { label: 'Warning',       className: 'bg-amber-50  text-amber-700  border-amber-200' },
  'Over Budget': { label: 'Over Budget',   className: 'bg-red-50    text-red-700    border-red-200' },
  Monthly:       { label: 'Monthly',       className: 'bg-blue-50   text-blue-700   border-blue-200' },
  Bonus:         { label: 'Bonus',         className: 'bg-purple-50 text-purple-700 border-purple-200' },
  'Year-End':    { label: 'Year-End',      className: 'bg-teal-50   text-teal-700   border-teal-200' },
}

interface StatusBadgeProps {
  status: Status
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
