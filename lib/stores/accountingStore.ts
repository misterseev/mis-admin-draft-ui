'use client'

import { useState, useEffect } from 'react'

export type AccountClass = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense'
export type AccountNature = 'Debit' | 'Credit'

export interface Account {
  code: string
  name: string
  nameLao: string
  class: AccountClass
  group: string
  nature: AccountNature
  balance: number   // positive = normal balance
  isGroup?: boolean
}

export interface JournalLine {
  accountCode: string
  accountName: string
  debit: number
  credit: number
  memo: string
}

export interface JournalEntry {
  ref: string
  date: string
  description: string
  type: 'Manual' | 'Payroll' | 'Purchase' | 'Depreciation' | 'Closing'
  lines: JournalLine[]
  posted: boolean
  postedBy?: string
}

export interface ClosingPeriod {
  period: string   // e.g. "March 2026"
  status: 'Open' | 'In Progress' | 'Closed'
  steps: { id: string; label: string; done: boolean; doneDate?: string; doneBy?: string }[]
}

export const ACCOUNTS: Account[] = [
  // Assets
  { code: '1000', name: 'Cash & Cash Equivalents', nameLao: 'ເງິນສົດ',           class: 'Asset',   group: 'Current Assets',     nature: 'Debit',  balance: 4820 },
  { code: '1100', name: 'Accounts Receivable',      nameLao: 'ລູກໜີ້',            class: 'Asset',   group: 'Current Assets',     nature: 'Debit',  balance: 1240 },
  { code: '1200', name: 'Medical Supplies Inventory',nameLao: 'ສາງຢາ',            class: 'Asset',   group: 'Current Assets',     nature: 'Debit',  balance: 680  },
  { code: '1300', name: 'Prepaid Expenses',         nameLao: 'ຄ່າໃຊ້ຈ່າຍລ່ວງໜ້າ', class: 'Asset',   group: 'Current Assets',     nature: 'Debit',  balance: 120  },
  { code: '1500', name: 'Property & Equipment',     nameLao: 'ຊັບສິນຖາວອນ',       class: 'Asset',   group: 'Non-Current Assets', nature: 'Debit',  balance: 28400 },
  { code: '1510', name: 'Accumulated Depreciation', nameLao: 'ຄ່າເສື່ອມ',          class: 'Asset',   group: 'Non-Current Assets', nature: 'Credit', balance: -5640 },
  // Liabilities
  { code: '2000', name: 'Accounts Payable',         nameLao: 'ເຈົ້າໜີ້',           class: 'Liability', group: 'Current Liabilities',   nature: 'Credit', balance: 840  },
  { code: '2100', name: 'Accrued Salaries',         nameLao: 'ເງິນເດືອນຄ້າງຈ່າຍ', class: 'Liability', group: 'Current Liabilities',   nature: 'Credit', balance: 620  },
  { code: '2200', name: 'Deferred Revenue',         nameLao: 'ລາຍຮັບຮັບລ່ວງໜ້າ', class: 'Liability', group: 'Current Liabilities',   nature: 'Credit', balance: 180  },
  { code: '2500', name: 'Long-term Loans',          nameLao: 'ກູ້ຢືມໄລຍະຍາວ',     class: 'Liability', group: 'Non-Current Liabilities',nature: 'Credit',balance: 3200 },
  // Equity
  { code: '3000', name: 'Government Capital',       nameLao: 'ທຶນລັດ',             class: 'Equity',  group: 'Equity',             nature: 'Credit', balance: 18200 },
  { code: '3100', name: 'Retained Earnings',        nameLao: 'ກຳໄລສະສົມ',          class: 'Equity',  group: 'Equity',             nature: 'Credit', balance: 4880 },
  // Revenue
  { code: '4000', name: 'Patient Service Revenue',  nameLao: 'ລາຍຮັບຈາກຄົນເຈັບ',  class: 'Revenue', group: 'Revenue',            nature: 'Credit', balance: 8640 },
  { code: '4100', name: 'Government Subsidy',       nameLao: 'ອຸດໜູນລັດ',           class: 'Revenue', group: 'Revenue',            nature: 'Credit', balance: 5200 },
  { code: '4200', name: 'Other Income',             nameLao: 'ລາຍຮັບອື່ນ',          class: 'Revenue', group: 'Revenue',            nature: 'Credit', balance: 380  },
  // Expenses
  { code: '5000', name: 'Personnel Costs',          nameLao: 'ຄ່າຈ້າງ',             class: 'Expense', group: 'Operating Expenses', nature: 'Debit',  balance: 4960 },
  { code: '5100', name: 'Medical Supplies Expense', nameLao: 'ຄ່າຢາ-ອຸປະກອນ',     class: 'Expense', group: 'Operating Expenses', nature: 'Debit',  balance: 560  },
  { code: '5200', name: 'Utilities Expense',        nameLao: 'ຄ່ານ້ຳ-ໄຟ',           class: 'Expense', group: 'Operating Expenses', nature: 'Debit',  balance: 196  },
  { code: '5300', name: 'Depreciation Expense',     nameLao: 'ຄ່າເສື່ອມ',           class: 'Expense', group: 'Operating Expenses', nature: 'Debit',  balance: 320  },
  { code: '5400', name: 'Administrative Expenses',  nameLao: 'ຄ່າບໍລິຫານ',          class: 'Expense', group: 'Operating Expenses', nature: 'Debit',  balance: 148  },
  { code: '5500', name: 'Other Expenses',           nameLao: 'ຄ່າໃຊ້ຈ່າຍອື່ນ',      class: 'Expense', group: 'Operating Expenses', nature: 'Debit',  balance: 82   },
]

const SEED_JOURNALS: JournalEntry[] = [
  {
    ref: 'JV-2026-0088', date: '20/04/2026', description: 'April payroll disbursement',
    type: 'Payroll', posted: true, postedBy: 'Bounlieng S.',
    lines: [
      { accountCode: '5000', accountName: 'Personnel Costs',    debit: 1240, credit: 0,    memo: 'Apr 2026 salaries' },
      { accountCode: '1000', accountName: 'Cash & Cash Equivalents', debit: 0, credit: 1240, memo: 'Bank transfer' },
    ],
  },
  {
    ref: 'JV-2026-0087', date: '18/04/2026', description: 'Purchase of IV fluids — PO-2026-0110',
    type: 'Purchase', posted: true, postedBy: 'Khamthavy V.',
    lines: [
      { accountCode: '1200', accountName: 'Medical Supplies Inventory', debit: 84, credit: 0, memo: 'IV fluids batch' },
      { accountCode: '2000', accountName: 'Accounts Payable',           debit: 0,  credit: 84, memo: 'Lao Medical Supplies Co.' },
    ],
  },
  {
    ref: 'JV-2026-0086', date: '15/04/2026', description: 'Patient service revenue — Week 15',
    type: 'Manual', posted: true, postedBy: 'Bounlieng S.',
    lines: [
      { accountCode: '1000', accountName: 'Cash & Cash Equivalents', debit: 420, credit: 0,   memo: 'OPD & IPD collections' },
      { accountCode: '4000', accountName: 'Patient Service Revenue', debit: 0,   credit: 420, memo: '' },
    ],
  },
  {
    ref: 'JV-2026-0085', date: '12/04/2026', description: 'Electricity bill Q1 — EDL',
    type: 'Manual', posted: true, postedBy: 'Khamthavy V.',
    lines: [
      { accountCode: '5200', accountName: 'Utilities Expense', debit: 52, credit: 0,  memo: 'EDL Q1 2026' },
      { accountCode: '2000', accountName: 'Accounts Payable',  debit: 0,  credit: 52, memo: '' },
    ],
  },
  {
    ref: 'JV-2026-0084', date: '01/04/2026', description: 'Monthly depreciation — April',
    type: 'Depreciation', posted: true, postedBy: 'System',
    lines: [
      { accountCode: '5300', accountName: 'Depreciation Expense',    debit: 80, credit: 0,  memo: '' },
      { accountCode: '1510', accountName: 'Accumulated Depreciation', debit: 0,  credit: 80, memo: '' },
    ],
  },
  {
    ref: 'JV-2026-0083', date: '31/03/2026', description: 'March closing — income summary',
    type: 'Closing', posted: true, postedBy: 'Bounlieng S.',
    lines: [
      { accountCode: '4000', accountName: 'Patient Service Revenue', debit: 2160, credit: 0,    memo: 'Close revenue' },
      { accountCode: '3100', accountName: 'Retained Earnings',       debit: 0,    credit: 2160, memo: '' },
    ],
  },
]

const SEED_CLOSINGS: ClosingPeriod[] = [
  {
    period: 'March 2026', status: 'Closed',
    steps: [
      { id: 'reconcile', label: 'Bank Reconciliation',         done: true, doneDate: '02/04/2026', doneBy: 'Khamthavy V.' },
      { id: 'accruals',  label: 'Post Accruals & Adjustments', done: true, doneDate: '02/04/2026', doneBy: 'Bounlieng S.' },
      { id: 'deprec',    label: 'Record Depreciation',         done: true, doneDate: '01/04/2026', doneBy: 'System'       },
      { id: 'review',    label: 'Management Review & Sign-off', done: true, doneDate: '03/04/2026', doneBy: 'Dr. Phonpasit K.' },
      { id: 'close',     label: 'Close Period in System',      done: true, doneDate: '03/04/2026', doneBy: 'Bounlieng S.' },
    ],
  },
  {
    period: 'April 2026', status: 'In Progress',
    steps: [
      { id: 'reconcile', label: 'Bank Reconciliation',          done: true,  doneDate: '28/04/2026', doneBy: 'Khamthavy V.' },
      { id: 'accruals',  label: 'Post Accruals & Adjustments',  done: true,  doneDate: '29/04/2026', doneBy: 'Bounlieng S.' },
      { id: 'deprec',    label: 'Record Depreciation',          done: false },
      { id: 'review',    label: 'Management Review & Sign-off', done: false },
      { id: 'close',     label: 'Close Period in System',       done: false },
    ],
  },
  {
    period: 'May 2026', status: 'Open',
    steps: [
      { id: 'reconcile', label: 'Bank Reconciliation',          done: false },
      { id: 'accruals',  label: 'Post Accruals & Adjustments',  done: false },
      { id: 'deprec',    label: 'Record Depreciation',          done: false },
      { id: 'review',    label: 'Management Review & Sign-off', done: false },
      { id: 'close',     label: 'Close Period in System',       done: false },
    ],
  },
]

function load<T>(key: string, seed: T[]): T[] {
  if (typeof window === 'undefined') return seed
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : seed } catch { return seed }
}
function save<T>(key: string, d: T[]) {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(d))
}

export function useAccountingStore() {
  const [journals, setJournals] = useState<JournalEntry[]>([])
  const [closings, setClosings] = useState<ClosingPeriod[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setJournals(load('mis_journals', SEED_JOURNALS))
    setClosings(load('mis_closings', SEED_CLOSINGS))
    setReady(true)
  }, [])

  function addJournal(j: JournalEntry) {
    const next = [j, ...journals]; setJournals(next); save('mis_journals', next)
  }

  function postJournal(ref: string) {
    const next = journals.map(j => j.ref === ref ? { ...j, posted: true, postedBy: 'Bounlieng S.' } : j)
    setJournals(next); save('mis_journals', next)
  }

  function completeStep(period: string, stepId: string) {
    const next = closings.map(c => {
      if (c.period !== period) return c
      const steps = c.steps.map(s =>
        s.id === stepId ? { ...s, done: true, doneDate: new Date().toLocaleDateString('en-GB'), doneBy: 'Bounlieng S.' } : s
      )
      const allDone = steps.every(s => s.done)
      return { ...c, steps, status: allDone ? 'Closed' as const : 'In Progress' as const }
    })
    setClosings(next); save('mis_closings', next)
  }

  return { journals, closings, accounts: ACCOUNTS, ready, addJournal, postJournal, completeStep }
}

export const fmtLak = (v: number) => `LAK ${Math.abs(v).toLocaleString()}M`

export function getBalance(accounts: Account[], cls: AccountClass) {
  return accounts.filter(a => a.class === cls).reduce((s, a) => s + a.balance, 0)
}
