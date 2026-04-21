'use client'

import { useState, useEffect } from 'react'

export type PlanStatus = 'Draft' | 'Pending' | 'Approved' | 'Rejected'
export type ExecStatus = 'Pending' | 'Approved' | 'Rejected'

export interface BudgetHead {
  code: string
  name: string
  nameLao: string
  category: 'Recurrent' | 'Capital'
  annualBudget: number   // millions LAK
  committed: number
  actual: number
  dept: string
}

export interface BudgetPlan {
  ref: string
  name: string
  dept: string
  requestedBy: string
  submittedDate: string
  amount: number   // millions
  status: PlanStatus
  budgetHead: string
  justification: string
  approvals: { role: string; name: string; status: 'Pending' | 'Approved' | 'Rejected'; comment?: string; date?: string }[]
}

export interface Execution {
  ref: string
  date: string
  budgetHead: string
  dept: string
  description: string
  vendor: string
  amount: number   // millions
  type: 'Actual' | 'Commitment'
  poRef?: string
  invoiceRef?: string
}

const SEED_HEADS: BudgetHead[] = [
  { code: 'BGT-PRS-001', name: 'Personnel Costs',         nameLao: 'ຄ່າຈ້າງ ແລະ ບໍລິຫານ',  category: 'Recurrent', annualBudget: 14900, committed: 0,    actual: 4960, dept: 'All Departments' },
  { code: 'BGT-MED-001', name: 'Medical Supplies',        nameLao: 'ເວດຊະພັນ ແລະ ອຸປະກອນ', category: 'Recurrent', annualBudget: 1800,  committed: 120, actual: 560,  dept: 'Pharmacy'        },
  { code: 'BGT-MED-002', name: 'Laboratory Reagents',     nameLao: 'ສານ Lab',               category: 'Recurrent', annualBudget: 680,   committed: 46,  actual: 212,  dept: 'Lab'             },
  { code: 'BGT-OPS-001', name: 'Utilities (Electricity)', nameLao: 'ໄຟຟ້າ',                  category: 'Recurrent', annualBudget: 480,   committed: 0,   actual: 158,  dept: 'Maintenance'     },
  { code: 'BGT-OPS-002', name: 'Utilities (Water)',       nameLao: 'ນ້ຳ',                    category: 'Recurrent', annualBudget: 120,   committed: 0,   actual: 38,   dept: 'Maintenance'     },
  { code: 'BGT-OPS-003', name: 'Fuel & Transport',        nameLao: 'ນ້ຳມັນ ແລະ ຂົນສົ່ງ',    category: 'Recurrent', annualBudget: 240,   committed: 0,   actual: 82,   dept: 'Administration'  },
  { code: 'BGT-CAP-001', name: 'Medical Equipment Capex', nameLao: 'ຊື້ອຸປະກອນການແພດ',      category: 'Capital',   annualBudget: 2400,  committed: 850, actual: 0,    dept: 'Radiology'       },
  { code: 'BGT-CAP-002', name: 'Building Renovation',     nameLao: 'ສ້ອມແປງ',               category: 'Capital',   annualBudget: 600,   committed: 0,   actual: 180,  dept: 'Maintenance'     },
  { code: 'BGT-TRN-001', name: 'Training & Development',  nameLao: 'ຝຶກອົບຮົມ',             category: 'Recurrent', annualBudget: 280,   committed: 0,   actual: 64,   dept: 'HR'              },
  { code: 'BGT-ICT-001', name: 'IT & Communications',     nameLao: 'ໄອທີ ແລະ ສື່ສານ',       category: 'Recurrent', annualBudget: 320,   committed: 22,  actual: 90,   dept: 'IT'              },
]

const SEED_PLANS: BudgetPlan[] = [
  {
    ref: 'BPLAN-2027-001', name: 'FY 2027 Personnel Budget Plan', dept: 'HR',
    requestedBy: 'Khamthavy V.', submittedDate: '20/04/2026', amount: 15600,
    status: 'Draft', budgetHead: 'BGT-PRS-001',
    justification: 'Annual increment of 4.7% aligned with government salary scale. Covers 142 staff across all departments.',
    approvals: [
      { role: 'Finance Manager', name: 'Bounlieng S.', status: 'Pending' },
      { role: 'Director', name: 'Dr. Phonpasit K.', status: 'Pending' },
    ],
  },
  {
    ref: 'BPLAN-2027-002', name: 'FY 2027 Medical Supplies Plan', dept: 'Pharmacy',
    requestedBy: 'Phonsa L.', submittedDate: '19/04/2026', amount: 1950,
    status: 'Pending', budgetHead: 'BGT-MED-001',
    justification: 'Projected 8% increase in patient volume. Essential consumables to maintain 3-month buffer stock.',
    approvals: [
      { role: 'Finance Manager', name: 'Bounlieng S.', status: 'Pending' },
      { role: 'Director', name: 'Dr. Phonpasit K.', status: 'Pending' },
    ],
  },
  {
    ref: 'BPLAN-2027-003', name: 'FY 2027 IT Infrastructure Plan', dept: 'IT',
    requestedBy: 'Ketsana P.', submittedDate: '18/04/2026', amount: 420,
    status: 'Pending', budgetHead: 'BGT-ICT-001',
    justification: 'Server upgrade cycle (5-year). New network switches for OPD wing. Cybersecurity tools renewal.',
    approvals: [
      { role: 'Finance Manager', name: 'Bounlieng S.', status: 'Approved', comment: 'Budget justified. Proceed to director.', date: '20/04/2026' },
      { role: 'Director', name: 'Dr. Phonpasit K.', status: 'Pending' },
    ],
  },
  {
    ref: 'BPLAN-2027-004', name: 'FY 2027 Training Plan', dept: 'HR',
    requestedBy: 'Noy S.', submittedDate: '17/04/2026', amount: 300,
    status: 'Approved', budgetHead: 'BGT-TRN-001',
    justification: 'Mandatory clinical skills training. Includes 2 overseas conferences for senior doctors.',
    approvals: [
      { role: 'Finance Manager', name: 'Bounlieng S.', status: 'Approved', date: '18/04/2026' },
      { role: 'Director', name: 'Dr. Phonpasit K.', status: 'Approved', date: '19/04/2026' },
    ],
  },
  {
    ref: 'BPLAN-2027-005', name: 'FY 2027 Facility Maintenance Plan', dept: 'Maintenance',
    requestedBy: 'Bounmy K.', submittedDate: '15/04/2026', amount: 680,
    status: 'Approved', budgetHead: 'BGT-CAP-002',
    justification: 'Roof repair of Ward B, plumbing overhaul, electrical rewiring for new OT room.',
    approvals: [
      { role: 'Finance Manager', name: 'Bounlieng S.', status: 'Approved', date: '17/04/2026' },
      { role: 'Director', name: 'Dr. Phonpasit K.', status: 'Approved', date: '18/04/2026' },
    ],
  },
  {
    ref: 'BPLAN-2027-006', name: 'FY 2027 Lab Reagents Plan', dept: 'Lab',
    requestedBy: 'Khamphan V.', submittedDate: '14/04/2026', amount: 720,
    status: 'Rejected', budgetHead: 'BGT-MED-002',
    justification: 'New PCR reagents and ELISA kits for expanded diagnostic panel.',
    approvals: [
      { role: 'Finance Manager', name: 'Bounlieng S.', status: 'Rejected', comment: 'Exceeds category cap. Revise to LAK 680M.', date: '16/04/2026' },
      { role: 'Director', name: 'Dr. Phonpasit K.', status: 'Pending' },
    ],
  },
]

const SEED_EXECUTIONS: Execution[] = [
  { ref: 'EXE-2026-0088', date: '20/04/2026', budgetHead: 'BGT-MED-001', dept: 'Pharmacy',      description: 'Purchase of IV fluids (Apr batch)',    vendor: 'Lao Medical Supplies Co.', amount: 84,   type: 'Actual',      poRef: 'PO-2026-0110' },
  { ref: 'EXE-2026-0087', date: '18/04/2026', budgetHead: 'BGT-PRS-001', dept: 'All Depts',     description: 'April payroll disbursement',           vendor: '—',                        amount: 1240, type: 'Actual' },
  { ref: 'EXE-2026-0086', date: '15/04/2026', budgetHead: 'BGT-CAP-001', dept: 'Radiology',     description: 'Ultrasound machine deposit (50%)',     vendor: 'GE Healthcare Lao',        amount: 425,  type: 'Commitment',  poRef: 'PO-2026-0108' },
  { ref: 'EXE-2026-0085', date: '12/04/2026', budgetHead: 'BGT-OPS-001', dept: 'Maintenance',   description: 'Electricity bill — Q1 2026',          vendor: 'EDL',                      amount: 52,   type: 'Actual',      invoiceRef: 'EDL-2026-Q1' },
  { ref: 'EXE-2026-0084', date: '10/04/2026', budgetHead: 'BGT-MED-002', dept: 'Lab',           description: 'Malaria rapid test kits',              vendor: 'DiagnoTech Asia',          amount: 43.2, type: 'Actual',      poRef: 'PO-2026-0105' },
  { ref: 'EXE-2026-0083', date: '08/04/2026', budgetHead: 'BGT-OPS-003', dept: 'Administration',description: 'Fuel refill — motor pool (Apr)',       vendor: 'PetroLao',                 amount: 22,   type: 'Actual' },
  { ref: 'EXE-2026-0082', date: '05/04/2026', budgetHead: 'BGT-TRN-001', dept: 'HR',            description: 'Clinical skills training — Vientiane', vendor: 'MedTrain Lao',             amount: 18,   type: 'Actual' },
  { ref: 'EXE-2026-0081', date: '01/04/2026', budgetHead: 'BGT-ICT-001', dept: 'IT',            description: 'Antivirus renewal — 50 licenses',     vendor: 'Kaspersky Lao',            amount: 8.5,  type: 'Actual',      invoiceRef: 'KSP-2026-042' },
]

function load<T>(key: string, seed: T[]): T[] {
  if (typeof window === 'undefined') return seed
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : seed } catch { return seed }
}
function save<T>(key: string, data: T[]) {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(data))
}

export function useBudgetStore() {
  const [heads, setHeads] = useState<BudgetHead[]>([])
  const [plans, setPlans] = useState<BudgetPlan[]>([])
  const [executions, setExecutions] = useState<Execution[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setHeads(load('mis_budget_heads', SEED_HEADS))
    setPlans(load('mis_budget_plans', SEED_PLANS))
    setExecutions(load('mis_budget_execs', SEED_EXECUTIONS))
    setReady(true)
  }, [])

  function approvePlan(ref: string, role: string, comment: string) {
    const next = plans.map(p => {
      if (p.ref !== ref) return p
      const approvals = p.approvals.map(a =>
        a.role === role ? { ...a, status: 'Approved' as const, comment, date: new Date().toLocaleDateString('en-GB') } : a
      )
      const allDone = approvals.every(a => a.status === 'Approved')
      return { ...p, approvals, status: allDone ? 'Approved' as const : p.status }
    })
    setPlans(next); save('mis_budget_plans', next)
  }

  function rejectPlan(ref: string, role: string, comment: string) {
    const next = plans.map(p => {
      if (p.ref !== ref) return p
      const approvals = p.approvals.map(a =>
        a.role === role ? { ...a, status: 'Rejected' as const, comment, date: new Date().toLocaleDateString('en-GB') } : a
      )
      return { ...p, approvals, status: 'Rejected' as const }
    })
    setPlans(next); save('mis_budget_plans', next)
  }

  function addPlan(p: BudgetPlan) {
    const next = [p, ...plans]; setPlans(next); save('mis_budget_plans', next)
  }

  function addExecution(e: Execution) {
    const next = [e, ...executions]; setExecutions(next); save('mis_budget_execs', next)
    const nh = heads.map(h => {
      if (h.code !== e.budgetHead) return h
      return e.type === 'Actual'
        ? { ...h, actual: h.actual + e.amount }
        : { ...h, committed: h.committed + e.amount }
    })
    setHeads(nh); save('mis_budget_heads', nh)
  }

  return { heads, plans, executions, ready, approvePlan, rejectPlan, addPlan, addExecution }
}

export const fmtM = (v: number) => `LAK ${v.toLocaleString()}M`
