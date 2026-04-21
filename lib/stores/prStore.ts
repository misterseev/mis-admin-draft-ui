'use client'

import { useCallback, useEffect, useState } from 'react'

export type PRStatus = 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Completed'
export type ApprovalAction = 'pending' | 'approved' | 'rejected' | 'returned' | 'submitted'

export interface PRApprover {
  actor: string
  role: string
  action: ApprovalAction
  date?: string
  comment?: string
}

export interface PRItem {
  id: string
  code: string
  name: string
  unit: string
  price: number
  qty: number
  note: string
}

export interface PurchaseRequisition {
  ref: string
  title: string
  dept: string
  requestedBy: string
  priority: 'Normal' | 'Urgent' | 'Critical'
  purpose: string
  items: PRItem[]
  approvers: PRApprover[]
  dateRaised: string
  requiredBy: string
  status: PRStatus
  workflowStep: number  // 0=Draft 1=Authorization 2=Order 3=Inspection 4=Goods Receipt
}

// Seed data matching purchasing page mock
const SEED_PRS: PurchaseRequisition[] = [
  {
    ref: 'PR-2026-0142', title:  'Medical Supplies Q2 2026', dept: 'Pharmacy',
    requestedBy: 'Phonsa L.', priority: 'Urgent',
    purpose: 'Quarterly resupply for pharmacy critical consumables.',
    dateRaised: '2026-04-18', requiredBy: '2026-05-05',
    status: 'Pending', workflowStep: 1,
    items: [
      { id: '1', code: 'ITM-MS-0042', name: 'Surgical Gloves (Medium)', unit: 'Box',   price: 45_000,  qty: 200, note: '' },
      { id: '2', code: 'ITM-MS-0015', name: 'Syringe 5ml',              unit: 'Box',   price: 35_000,  qty: 100, note: '' },
    ],
    approvers: [
      { actor: 'Phonsa L.',   role: 'Dept Head — Pharmacy',    action: 'submitted', date: '18/04/2026' },
      { actor: 'Noy S.',      role: 'Purchasing Manager',       action: 'pending' },
      { actor: 'Dr. Somchay', role: 'Finance Manager',          action: 'pending' },
    ],
  },
  {
    ref: 'PR-2026-0141', title: 'Office Stationery — Admin', dept: 'Administration',
    requestedBy: 'Vilay S.', priority: 'Normal',
    purpose: 'Monthly stationery replenishment for admin department.',
    dateRaised: '2026-04-17', requiredBy: '2026-04-30',
    status: 'Approved', workflowStep: 2,
    items: [
      { id: '3', code: 'ITM-OF-0008', name: 'A4 Paper 80gsm', unit: 'Pack', price: 28_000, qty: 50, note: '' },
      { id: '4', code: 'ITM-OF-0021', name: 'Printer Toner (HP)', unit: 'Piece', price: 450_000, qty: 2, note: '' },
    ],
    approvers: [
      { actor: 'Vilay S.',    role: 'Dept Head — Admin',        action: 'submitted', date: '17/04/2026' },
      { actor: 'Noy S.',      role: 'Purchasing Manager',       action: 'approved', date: '18/04/2026', comment: 'Within budget' },
      { actor: 'Dr. Somchay', role: 'Finance Manager',          action: 'approved', date: '19/04/2026' },
    ],
  },
  {
    ref: 'PR-2026-0140', title: 'Lab Reagents & Consumables', dept: 'Lab',
    requestedBy: 'Khamphan V.', priority: 'Critical',
    purpose: 'Lab is fully depleted on reagents — operations at risk.',
    dateRaised: '2026-04-15', requiredBy: '2026-05-01',
    status: 'Approved', workflowStep: 2,
    items: [
      { id: '5', code: 'ITM-LB-0012', name: 'Rapid Test Kit — Malaria', unit: 'Kit', price: 180_000, qty: 120, note: 'Urgent' },
    ],
    approvers: [
      { actor: 'Khamphan V.', role: 'Dept Head — Lab',          action: 'submitted', date: '15/04/2026' },
      { actor: 'Noy S.',      role: 'Purchasing Manager',       action: 'approved', date: '16/04/2026' },
      { actor: 'Dr. Somchay', role: 'Finance Manager',          action: 'approved', date: '17/04/2026' },
    ],
  },
  {
    ref: 'PR-2026-0139', title: 'IT Equipment — HP Laptop x3', dept: 'IT',
    requestedBy: 'Ketsana P.', priority: 'Normal',
    purpose: 'Replacing 3 obsolete workstations in IT.',
    dateRaised: '2026-04-14', requiredBy: '2026-04-30',
    status: 'Pending', workflowStep: 1,
    items: [
      { id: '6', code: 'ITM-IT-0022', name: 'HP Laptop 14"', unit: 'Piece', price: 4_000_000, qty: 3, note: '' },
    ],
    approvers: [
      { actor: 'Ketsana P.',  role: 'Dept Head — IT',           action: 'submitted', date: '14/04/2026' },
      { actor: 'Noy S.',      role: 'Purchasing Manager',       action: 'pending' },
      { actor: 'Dr. Somchay', role: 'Finance Manager',          action: 'pending' },
    ],
  },
  {
    ref: 'PR-2026-0138', title: 'Nursing Ward Consumables', dept: 'Nursing',
    requestedBy: 'Khamla B.', priority: 'Urgent',
    purpose: 'Weekly resupply for surgical ward consumables.',
    dateRaised: '2026-04-12', requiredBy: '2026-04-25',
    status: 'Completed', workflowStep: 4,
    items: [
      { id: '7', code: 'ITM-MS-0042', name: 'Surgical Gloves (Medium)', unit: 'Box', price: 45_000, qty: 80, note: '' },
    ],
    approvers: [
      { actor: 'Khamla B.',   role: 'Dept Head — Nursing',      action: 'submitted', date: '12/04/2026' },
      { actor: 'Noy S.',      role: 'Purchasing Manager',       action: 'approved', date: '13/04/2026' },
      { actor: 'Dr. Somchay', role: 'Finance Manager',          action: 'approved', date: '13/04/2026' },
    ],
  },
  {
    ref: 'PR-2026-0135', title: 'Surgical Instruments — ICU', dept: 'Nursing',
    requestedBy: 'Khamla B.', priority: 'Critical',
    purpose: 'New ICU surgical instruments requested by clinical team.',
    dateRaised: '2026-04-05', requiredBy: '2026-04-20',
    status: 'Rejected', workflowStep: 1,
    items: [
      { id: '8', code: 'ITM-EQ-0030', name: 'Laparoscopy Set', unit: 'Set', price: 42_000_000, qty: 1, note: '' },
      { id: '9', code: 'ITM-EQ-0031', name: 'Surgical Drill',  unit: 'Piece', price: 22_000_000, qty: 2, note: '' },
    ],
    approvers: [
      { actor: 'Khamla B.',   role: 'Dept Head — Nursing',      action: 'submitted', date: '05/04/2026' },
      { actor: 'Noy S.',      role: 'Purchasing Manager',       action: 'rejected', date: '07/04/2026', comment: 'Exceeds Q2 capital budget. Re-submit in Q3.' },
      { actor: 'Dr. Somchay', role: 'Finance Manager',          action: 'pending' },
    ],
  },
  {
    ref: 'PR-2026-0134', title: 'Printer Ink & Toner (All Depts)', dept: 'Administration',
    requestedBy: 'Ladavanh I.', priority: 'Normal',
    purpose: 'Consolidated ink & toner order for all departments.',
    dateRaised: '2026-04-03', requiredBy: '2026-04-15',
    status: 'Draft', workflowStep: 0,
    items: [
      { id: '10', code: 'ITM-OF-0021', name: 'Printer Toner (HP)', unit: 'Piece', price: 450_000, qty: 6, note: '' },
    ],
    approvers: [
      { actor: 'Ladavanh I.', role: 'Dept Head — Admin',        action: 'pending' },
      { actor: 'Noy S.',      role: 'Purchasing Manager',       action: 'pending' },
    ],
  },
]

const STORE_KEY = 'mis_prs_v1'

function loadPRs(): PurchaseRequisition[] {
  if (typeof window === 'undefined') return SEED_PRS
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return SEED_PRS
    const parsed = JSON.parse(raw) as PurchaseRequisition[]
    return parsed.length ? parsed : SEED_PRS
  } catch {
    return SEED_PRS
  }
}

function savePRs(prs: PurchaseRequisition[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORE_KEY, JSON.stringify(prs))
}

export function usePRStore() {
  const [prs, setPRsRaw] = useState<PurchaseRequisition[]>(SEED_PRS)

  useEffect(() => {
    setPRsRaw(loadPRs())
  }, [])

  const setPRs = useCallback((updater: (prev: PurchaseRequisition[]) => PurchaseRequisition[]) => {
    setPRsRaw(prev => {
      const next = updater(prev)
      savePRs(next)
      return next
    })
  }, [])

  const addPR = useCallback((pr: PurchaseRequisition) => {
    setPRs(prev => [pr, ...prev])
  }, [setPRs])

  const updatePR = useCallback((ref: string, patch: Partial<PurchaseRequisition>) => {
    setPRs(prev => prev.map(p => p.ref === ref ? { ...p, ...patch } : p))
  }, [setPRs])

  const getPR = useCallback((ref: string) => {
    return prs.find(p => p.ref === ref) ?? null
  }, [prs])

  const approveStep = useCallback((ref: string, approverIdx: number, comment?: string) => {
    setPRs(prev => prev.map(p => {
      if (p.ref !== ref) return p
      const approvers = p.approvers.map((a, i) =>
        i === approverIdx
          ? { ...a, action: 'approved' as ApprovalAction, date: new Date().toLocaleDateString('en-GB'), comment }
          : a
      )
      const nextPending = approvers.findIndex(a => a.action === 'pending')
      const allDone = nextPending === -1
      return {
        ...p,
        approvers,
        status: allDone ? 'Approved' : 'Pending',
        workflowStep: allDone ? 2 : p.workflowStep,
      }
    }))
  }, [setPRs])

  const rejectStep = useCallback((ref: string, approverIdx: number, comment: string) => {
    setPRs(prev => prev.map(p => {
      if (p.ref !== ref) return p
      const approvers = p.approvers.map((a, i) =>
        i === approverIdx
          ? { ...a, action: 'rejected' as ApprovalAction, date: new Date().toLocaleDateString('en-GB'), comment }
          : a
      )
      return { ...p, approvers, status: 'Rejected' }
    }))
  }, [setPRs])

  const returnStep = useCallback((ref: string, approverIdx: number, comment: string) => {
    setPRs(prev => prev.map(p => {
      if (p.ref !== ref) return p
      const approvers = p.approvers.map((a, i) =>
        i === approverIdx
          ? { ...a, action: 'returned' as ApprovalAction, date: new Date().toLocaleDateString('en-GB'), comment }
          : a
      )
      return { ...p, approvers, status: 'Draft', workflowStep: 0 }
    }))
  }, [setPRs])

  return { prs, addPR, updatePR, getPR, approveStep, rejectStep, returnStep }
}
