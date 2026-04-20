'use client'

import { useState } from 'react'
import { Plus, Eye, Edit, Send } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { WorkflowStepper } from '@/components/mis/WorkflowStepper'
import { Button } from '@/components/ui/button'

const PLANS = [
  { ref: 'BPLAN-2027-001', name: 'FY 2027 Personnel Budget Plan',     dept: 'HR',             requestedBy: 'Khamthavy V.', submittedDate: '20/04/2026', amount: 'LAK 15,600M', status: 'Draft'    },
  { ref: 'BPLAN-2027-002', name: 'FY 2027 Medical Supplies Plan',     dept: 'Pharmacy',       requestedBy: 'Phonsa L.',    submittedDate: '19/04/2026', amount: 'LAK 1,950M',  status: 'Pending'  },
  { ref: 'BPLAN-2027-003', name: 'FY 2027 IT Infrastructure Plan',    dept: 'IT',             requestedBy: 'Ketsana P.',   submittedDate: '18/04/2026', amount: 'LAK 420M',    status: 'Pending'  },
  { ref: 'BPLAN-2027-004', name: 'FY 2027 Training Plan',             dept: 'HR',             requestedBy: 'Noy S.',       submittedDate: '17/04/2026', amount: 'LAK 300M',    status: 'Approved' },
  { ref: 'BPLAN-2027-005', name: 'FY 2027 Facility Maintenance Plan', dept: 'Maintenance',    requestedBy: 'Bounmy K.',    submittedDate: '15/04/2026', amount: 'LAK 680M',    status: 'Approved' },
  { ref: 'BPLAN-2027-006', name: 'FY 2027 Lab Reagents Plan',         dept: 'Lab',            requestedBy: 'Khamphan V.',  submittedDate: '14/04/2026', amount: 'LAK 720M',    status: 'Rejected' },
]

const WORKFLOW_STEPS = ['Dept. Request', 'Finance Review', 'Director Review', 'MOH Submission', 'Approved']

export default function BudgetPlanningPage() {
  return (
    <AppShell breadcrumbs={[{ label: 'Budget', href: '/admin/budget' }, { label: 'Planning' }]}>
      <PageHeader
        title="Budget Planning"
        titleLao="ການວາງແຜນງົບປະມານ"
        description="Submit and manage annual department budget plans · BGT-002"
        primaryAction={{ label: '+ New Budget Plan', icon: <Plus className="w-3.5 h-3.5" /> }}
      />

      <div className="mb-4">
        <WorkflowStepper steps={WORKFLOW_STEPS} currentStep={1} />
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Draft Plans',     value: PLANS.filter(p => p.status === 'Draft').length,    color: 'text-muted-foreground' },
          { label: 'Under Review',    value: PLANS.filter(p => p.status === 'Pending').length,  color: 'text-amber-600' },
          { label: 'Approved',        value: PLANS.filter(p => p.status === 'Approved').length, color: 'text-emerald-600' },
          { label: 'Total Requested', value: 'LAK 19,670M',                                     color: 'text-foreground' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-lg px-4 py-3">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Reference','Plan Name','Department','Requested By','Submitted','Requested Amount','Status','Actions'].map(h => (
                <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PLANS.map(p => (
              <tr key={p.ref} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{p.ref}</td>
                <td className="px-3 py-2 font-medium">{p.name}</td>
                <td className="px-3 py-2 text-muted-foreground">{p.dept}</td>
                <td className="px-3 py-2 text-muted-foreground">{p.requestedBy}</td>
                <td className="px-3 py-2 tabular-nums text-muted-foreground">{p.submittedDate}</td>
                <td className="px-3 py-2 tabular-nums font-semibold text-foreground">{p.amount}</td>
                <td className="px-3 py-2"><StatusBadge status={p.status} /></td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary"><Eye className="w-3.5 h-3.5" /></button>
                    {p.status === 'Draft' && (
                      <>
                        <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit className="w-3.5 h-3.5" /></button>
                        <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary"><Send className="w-3.5 h-3.5" /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}
