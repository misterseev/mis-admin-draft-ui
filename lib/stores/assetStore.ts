'use client'

import { useState, useEffect } from 'react'

export type AssetStatus = 'Active' | 'Under Maintenance' | 'Disposed' | 'Lost'
export type EventType = 'Maintenance' | 'Repair' | 'Transfer' | 'Disposal' | 'Inspection' | 'Upgrade'
export type EventStatus = 'Completed' | 'Scheduled' | 'In Progress'

export interface Asset {
  code: string
  name: string
  nameLao: string
  category: string
  brand: string
  model: string
  serialNo: string
  location: string
  dept: string
  purchaseDate: string
  purchaseCost: number
  usefulLife: number       // years
  residualValue: number
  bookValue: number
  status: AssetStatus
  notes?: string
}

export interface LifecycleEvent {
  ref: string
  assetCode: string
  assetName: string
  eventType: EventType
  date: string
  cost?: number
  performedBy: string
  notes: string
  status: EventStatus
  fromDept?: string
  toDept?: string
}

const SEED_ASSETS: Asset[] = [
  { code: 'AST-2024-0441', name: 'Ultrasound Machine (Portable)', nameLao: 'ເຄື່ອງ Echo', category: 'Medical Equipment', brand: 'GE Healthcare', model: 'LOGIQ e', serialNo: 'GE-US-88421', location: 'OPD Room 2', dept: 'Radiology', purchaseDate: '12/03/2024', purchaseCost: 850000000, usefulLife: 10, residualValue: 85000000, bookValue: 722500000, status: 'Active' },
  { code: 'AST-2023-0388', name: 'Patient Monitor (Bedside)', nameLao: 'ຈໍຕິດຕາມ', category: 'Medical Equipment', brand: 'Mindray', model: 'BeneVision N12', serialNo: 'MR-PM-50219', location: 'ICU Bay 3', dept: 'Nursing', purchaseDate: '05/06/2023', purchaseCost: 48000000, usefulLife: 7, residualValue: 4800000, bookValue: 31200000, status: 'Active' },
  { code: 'AST-2022-0301', name: 'Digital X-Ray System', nameLao: 'ເຄື່ອງ X-Ray ດິຈີຕອນ', category: 'Medical Equipment', brand: 'Philips', model: 'DigitalDiagnost C90', serialNo: 'PH-XR-11234', location: 'Radiology Lab', dept: 'Radiology', purchaseDate: '20/01/2022', purchaseCost: 2400000000, usefulLife: 15, residualValue: 240000000, bookValue: 1680000000, status: 'Active' },
  { code: 'AST-2024-0512', name: 'Desktop Computer (HP Prodesk)', nameLao: 'ຄອມຕັ້ງ HP', category: 'IT Equipment', brand: 'HP', model: 'ProDesk 600 G9', serialNo: 'HP-PD-77801', location: 'Finance Dept', dept: 'Finance', purchaseDate: '15/09/2024', purchaseCost: 8500000, usefulLife: 5, residualValue: 850000, bookValue: 7225000, status: 'Active' },
  { code: 'AST-2021-0211', name: 'Ambulance Vehicle (Toyota Hiace)', nameLao: 'ລົດຂົນສົ່ງ', category: 'Vehicles', brand: 'Toyota', model: 'Hiace 2.8D', serialNo: 'LPJ-4481', location: 'Motor Pool', dept: 'Administration', purchaseDate: '10/03/2021', purchaseCost: 190000000, usefulLife: 10, residualValue: 19000000, bookValue: 95000000, status: 'Active' },
  { code: 'AST-2023-0352', name: 'Autoclave Sterilizer', nameLao: 'ເຄື່ອງໄອນ້ຳ', category: 'Medical Equipment', brand: 'Tuttnauer', model: '3870EA', serialNo: 'TT-AV-30210', location: 'Sterilization', dept: 'Nursing', purchaseDate: '22/08/2023', purchaseCost: 55000000, usefulLife: 10, residualValue: 5500000, bookValue: 38500000, status: 'Under Maintenance' },
  { code: 'AST-2022-0288', name: 'Split AC Unit (2 Ton)', nameLao: 'ອ່ອ ຕ່ວ 2 ໂຕນ', category: 'Facility', brand: 'Daikin', model: 'FTXS60LVMA', serialNo: 'DK-AC-28801', location: 'Admin Block', dept: 'Administration', purchaseDate: '14/05/2022', purchaseCost: 14500000, usefulLife: 8, residualValue: 1450000, bookValue: 7250000, status: 'Active' },
  { code: 'AST-2019-0088', name: 'Laboratory Centrifuge', nameLao: 'ເຄື່ອງ Centrifuge', category: 'Medical Equipment', brand: 'Eppendorf', model: '5804R', serialNo: 'EP-CF-19033', location: 'Lab Room A', dept: 'Lab', purchaseDate: '01/02/2019', purchaseCost: 28000000, usefulLife: 7, residualValue: 2800000, bookValue: 0, status: 'Disposed' },
  { code: 'AST-2024-0488', name: 'LaserJet Printer (HP)', nameLao: 'ປຣິ້ນເຕີ HP', category: 'IT Equipment', brand: 'HP', model: 'LaserJet Pro M404n', serialNo: 'HP-LJ-55922', location: 'HR Dept', dept: 'HR', purchaseDate: '03/11/2024', purchaseCost: 5200000, usefulLife: 5, residualValue: 520000, bookValue: 4680000, status: 'Active' },
  { code: 'AST-2023-0401', name: 'Generator (Diesel 50kVA)', nameLao: 'ເຄື່ອງໄຟ 50kVA', category: 'Facility', brand: 'Cummins', model: 'C55D5', serialNo: 'CU-GN-80142', location: 'Power Room', dept: 'Maintenance', purchaseDate: '18/07/2023', purchaseCost: 280000000, usefulLife: 15, residualValue: 28000000, bookValue: 210000000, status: 'Active' },
]

const SEED_EVENTS: LifecycleEvent[] = [
  { ref: 'LCE-2026-0052', assetCode: 'AST-2023-0352', assetName: 'Autoclave Sterilizer', eventType: 'Repair', date: '20/04/2026', cost: 3200000, performedBy: 'MedEquip Lao', notes: 'Heating element replacement', status: 'In Progress' },
  { ref: 'LCE-2026-0051', assetCode: 'AST-2021-0211', assetName: 'Ambulance (Toyota Hiace)', eventType: 'Maintenance', date: '15/04/2026', cost: 850000, performedBy: 'Toyota Lao', notes: '30,000km service & oil change', status: 'Completed' },
  { ref: 'LCE-2026-0050', assetCode: 'AST-2024-0441', assetName: 'Ultrasound Machine (Portable)', eventType: 'Inspection', date: '10/04/2026', performedBy: 'GE Healthcare', notes: 'Annual calibration check', status: 'Completed' },
  { ref: 'LCE-2026-0049', assetCode: 'AST-2022-0288', assetName: 'Split AC Unit (2 Ton)', eventType: 'Maintenance', date: '05/04/2026', cost: 400000, performedBy: 'CoolTech Lao', notes: 'Filter clean & gas refill', status: 'Completed' },
  { ref: 'LCE-2026-0048', assetCode: 'AST-2024-0512', assetName: 'Desktop Computer (HP Prodesk)', eventType: 'Transfer', date: '01/04/2026', performedBy: 'IT Dept', notes: 'Moved from HR to Finance Dept', fromDept: 'HR', toDept: 'Finance', status: 'Completed' },
  { ref: 'LCE-2026-0047', assetCode: 'AST-2019-0088', assetName: 'Laboratory Centrifuge', eventType: 'Disposal', date: '28/03/2026', performedBy: 'Asset Committee', notes: 'Beyond economic repair, disposed', status: 'Completed' },
  { ref: 'LCE-2026-0046', assetCode: 'AST-2023-0401', assetName: 'Generator (Diesel 50kVA)', eventType: 'Maintenance', date: '05/05/2026', cost: 1200000, performedBy: 'Cummins Lao', notes: 'Scheduled 500hr service', status: 'Scheduled' },
  { ref: 'LCE-2026-0045', assetCode: 'AST-2022-0301', assetName: 'Digital X-Ray System', eventType: 'Upgrade', date: '10/05/2026', cost: 45000000, performedBy: 'Philips Lao', notes: 'Software update + detector upgrade', status: 'Scheduled' },
]

function load<T>(key: string, seed: T[]): T[] {
  if (typeof window === 'undefined') return seed
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : seed
  } catch { return seed }
}

function save<T>(key: string, data: T[]) {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(data))
}

export function useAssetStore() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [events, setEvents] = useState<LifecycleEvent[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setAssets(load('mis_assets', SEED_ASSETS))
    setEvents(load('mis_asset_events', SEED_EVENTS))
    setReady(true)
  }, [])

  function addAsset(a: Asset) {
    const next = [a, ...assets]
    setAssets(next)
    save('mis_assets', next)
  }

  function updateAsset(code: string, patch: Partial<Asset>) {
    const next = assets.map(a => a.code === code ? { ...a, ...patch } : a)
    setAssets(next)
    save('mis_assets', next)
  }

  function addEvent(e: LifecycleEvent) {
    const next = [e, ...events]
    setEvents(next)
    save('mis_asset_events', next)
  }

  function updateEvent(ref: string, patch: Partial<LifecycleEvent>) {
    const next = events.map(e => e.ref === ref ? { ...e, ...patch } : e)
    setEvents(next)
    save('mis_asset_events', next)
  }

  return { assets, events, ready, addAsset, updateAsset, addEvent, updateEvent }
}

export function fmtLak(n: number) {
  return 'LAK ' + n.toLocaleString()
}
