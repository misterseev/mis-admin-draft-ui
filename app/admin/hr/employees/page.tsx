'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus, Upload, Search, X, Eye, Edit, Printer,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Download, FileSpreadsheet,
} from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { PageHeader } from '@/components/mis/PageHeader'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type EmpStatus = 'Active' | 'On Leave' | 'Retired' | 'Terminated'

interface Employee {
  code: string; nameEn: string; nameLao: string; gender: string
  dept: string; position: string; grade: string; hireDate: string
  status: EmpStatus
}

export const EMPLOYEES: Employee[] = [
  { code:'EMP-2024-0142', nameEn:'Somsak Phommachanh',  nameLao:'ທ້າວ ສົມສັກ ພົມມະຈັນ',     gender:'M', dept:'Finance',        position:'Senior Accountant',  grade:'P4', hireDate:'15/03/2019', status:'Active'     },
  { code:'EMP-2023-0098', nameEn:'Noy Silavong',         nameLao:'ນາງ ນ້ອຍ ສີລາວົງ',          gender:'F', dept:'HR',             position:'HR Officer',          grade:'P3', hireDate:'01/06/2020', status:'Active'     },
  { code:'EMP-2022-0055', nameEn:'Khamla Boupha',        nameLao:'ນາງ ຄຳລາ ບຸບຜາ',            gender:'F', dept:'Nursing',        position:'Head Nurse',          grade:'P5', hireDate:'12/01/2018', status:'Active'     },
  { code:'EMP-2021-0033', nameEn:'Vilay Sengdara',       nameLao:'ທ້າວ ວິໄລ ແສງດາລາ',        gender:'M', dept:'Administration', position:'Admin Officer',       grade:'P3', hireDate:'07/08/2021', status:'Active'     },
  { code:'EMP-2020-0019', nameEn:'Phonsa Luangrath',     nameLao:'ນາງ ຜອນສາ ຫຼວງຣາດ',        gender:'F', dept:'Pharmacy',       position:'Pharmacist',          grade:'P4', hireDate:'14/02/2020', status:'Active'     },
  { code:'EMP-2019-0012', nameEn:'Bounmy Keovixay',      nameLao:'ທ້າວ ບຸນມີ ແກ້ວວິໄຊ',      gender:'M', dept:'Lab',            position:'Lab Technician',      grade:'P3', hireDate:'03/09/2019', status:'Active'     },
  { code:'EMP-2018-0008', nameEn:'Dalavanh Phommavong',  nameLao:'ນາງ ດາລາວັນ ພົມມະວົງ',     gender:'F', dept:'Finance',        position:'Accountant',          grade:'P3', hireDate:'20/11/2018', status:'Active'     },
  { code:'EMP-2024-0201', nameEn:'Sombath Inthavong',    nameLao:'ທ້າວ ສົມບັດ ອິນທາວົງ',     gender:'M', dept:'IT',             position:'IT Support',          grade:'P2', hireDate:'05/04/2024', status:'Active'     },
  { code:'EMP-2017-0005', nameEn:'Khamthavy Vongsavan',  nameLao:'ນາງ ຄຳທາວີ ວົງສາວັນ',      gender:'F', dept:'Administration', position:'Medical Director',    grade:'P7', hireDate:'01/01/2017', status:'Active'     },
  { code:'EMP-2016-0003', nameEn:'Souliya Phetsomphou',  nameLao:'ທ້າວ ສູລິຍາ ເພດສົມພູ',     gender:'M', dept:'Nursing',        position:'Nurse',               grade:'P3', hireDate:'15/06/2016', status:'On Leave'   },
  { code:'EMP-2023-0134', nameEn:'Manivahn Saymouangkhot',nameLao:'ນາງ ມະນີວັນ ໄຊມ່ວງຄຳ',   gender:'F', dept:'Pharmacy',       position:'Pharmacy Technician', grade:'P2', hireDate:'12/03/2023', status:'Active'     },
  { code:'EMP-2015-0001', nameEn:'Bouakham Singhalath',  nameLao:'ທ້າວ ບົວຄຳ ສິງຫາລາດ',     gender:'M', dept:'Maintenance',    position:'Maintenance Clerk',   grade:'S2', hireDate:'01/03/2015', status:'Retired'    },
  { code:'EMP-2024-0188', nameEn:'Naphaphone Oudomvilay',nameLao:'ນາງ ນ້ຳຜ້ອນ ອຸດົມວິໄລ',    gender:'F', dept:'HR',             position:'Recruiter',           grade:'P2', hireDate:'20/07/2024', status:'Active'     },
  { code:'EMP-2022-0077', nameEn:'Thongkham Phommasith', nameLao:'ທ້າວ ທອງຄຳ ພົມມະສິດ',     gender:'M', dept:'Administration', position:'Driver',              grade:'S3', hireDate:'11/02/2022', status:'Active'     },
  { code:'EMP-2020-0044', nameEn:'Sengphet Southida',    nameLao:'ນາງ ແສງເພັດ ສຸທິດາ',       gender:'F', dept:'Nursing',        position:'Nurse Practitioner',  grade:'P4', hireDate:'22/09/2020', status:'Active'     },
  { code:'EMP-2021-0060', nameEn:'Khamphan Vongkhamphanh',nameLao:'ທ້າວ ຄຳພັນ ວົງຄຳພັນ',   gender:'M', dept:'Lab',            position:'Lab Manager',         grade:'P5', hireDate:'16/01/2021', status:'Active'     },
  { code:'EMP-2023-0115', nameEn:'Bouavanh Douangchanh', nameLao:'ນາງ ບົວວັນ ດວງຈັນ',       gender:'F', dept:'Finance',        position:'Finance Officer',     grade:'P3', hireDate:'08/05/2023', status:'Active'     },
  { code:'EMP-2019-0025', nameEn:'Ketsana Phommasack',   nameLao:'ທ້າວ ເກດສະໜາ ພົມມະສັກ',  gender:'M', dept:'IT',             position:'System Admin',        grade:'P4', hireDate:'03/11/2019', status:'Active'     },
  { code:'EMP-2024-0222', nameEn:'Vatsana Sithixay',     nameLao:'ນາງ ວັດສະໜາ ສີທິໄຊ',      gender:'F', dept:'Nursing',        position:'Nurse',               grade:'P2', hireDate:'01/09/2024', status:'Active'     },
  { code:'EMP-2018-0011', nameEn:'Somchith Phoummasak',  nameLao:'ທ້າວ ສົມຈິດ ພູມມະສັກ',    gender:'M', dept:'Maintenance',    position:'Cleaner',             grade:'S1', hireDate:'01/04/2018', status:'Terminated' },
  { code:'EMP-2022-0089', nameEn:'Ladavanh Inthasith',   nameLao:'ນາງ ລາດາວັນ ອິນທາສິດ',    gender:'F', dept:'Administration', position:'Admin Assistant',     grade:'P2', hireDate:'14/06/2022', status:'Active'     },
  { code:'EMP-2020-0038', nameEn:'Phousavanh Keodouangdy',nameLao:'ທ້າວ ພູສາວັນ ແກ້ວດວງດີ', gender:'M', dept:'Finance',        position:'Budget Officer',      grade:'P3', hireDate:'10/10/2020', status:'Active'     },
  { code:'EMP-2021-0052', nameEn:'Santisouk Luangkhot',  nameLao:'ນາງ ສັນຕິສຸກ ຫຼວງຄຳ',     gender:'F', dept:'Pharmacy',       position:'Senior Pharmacist',   grade:'P5', hireDate:'25/03/2021', status:'On Leave'   },
  { code:'EMP-2023-0122', nameEn:'Thongvanh Keomixay',   nameLao:'ທ້າວ ທອງວັນ ແກ້ວມີໄຊ',   gender:'M', dept:'Lab',            position:'Lab Analyst',         grade:'P3', hireDate:'18/08/2023', status:'Active'     },
  { code:'EMP-2024-0251', nameEn:'Phengkeo Vongphakdy',  nameLao:'ນາງ ເພັງແກ້ວ ວົງຜັກດີ',  gender:'F', dept:'Nursing',        position:'Head Nurse',          grade:'P5', hireDate:'15/11/2024', status:'Active'     },
]

const DEPT_COLORS: Record<string, string> = {
  Finance:        'bg-blue-50 text-blue-700',
  HR:             'bg-purple-50 text-purple-700',
  Nursing:        'bg-emerald-50 text-emerald-700',
  Administration: 'bg-slate-100 text-slate-700',
  Pharmacy:       'bg-teal-50 text-teal-700',
  Lab:            'bg-orange-50 text-orange-700',
  Maintenance:    'bg-gray-100 text-gray-700',
  IT:             'bg-indigo-50 text-indigo-700',
}

export default function EmployeeListPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(25)
  const [sortField, setSortField] = useState<keyof Employee>('code')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filtered = EMPLOYEES.filter(e => {
    const q = search.toLowerCase()
    if (q && !e.nameEn.toLowerCase().includes(q) && !e.code.toLowerCase().includes(q)) return false
    if (deptFilter !== 'all' && e.dept !== deptFilter) return false
    if (statusFilter !== 'all' && e.status !== statusFilter) return false
    return true
  }).sort((a, b) => {
    const av = String(a[sortField]), bv = String(b[sortField])
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  const toggleSort = (field: keyof Employee) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const toggleAll = () => {
    if (selected.size === paged.length) setSelected(new Set())
    else setSelected(new Set(paged.map(e => e.code)))
  }

  const SortIcon = ({ field }: { field: keyof Employee }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp   className={`w-2.5 h-2.5 ${sortField === field && sortDir === 'asc'  ? 'text-primary' : 'text-border'}`} />
      <ChevronDown className={`w-2.5 h-2.5 -mt-1 ${sortField === field && sortDir === 'desc' ? 'text-primary' : 'text-border'}`} />
    </span>
  )

  return (
    <AppShell breadcrumbs={[{ label: 'Human Resources', href: '/admin/hr/employees' }, { label: 'Employee List' }]}>
      <PageHeader
        title="Employee List"
        description="Manage staff records — personal details, position, department · HRM-001"
        primaryAction={{ label: 'Add Employee', icon: <Plus className="w-3.5 h-3.5" />, href: "/admin/hr/employees/add" }}
        secondaryActions={[{ label: 'Import Excel', icon: <Upload className="w-3.5 h-3.5 mr-1" /> }]}
        overflowActions={[
          { label: 'Export CSV',   icon: <Download className="w-3.5 h-3.5 mr-1.5" /> },
          { label: 'Export Excel', icon: <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> },
          { label: 'Print List',   icon: <Printer className="w-3.5 h-3.5 mr-1.5" /> },
        ]}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            className="pl-8 h-8 text-xs w-64"
            placeholder="Search name, code, national ID..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <Select value={deptFilter} onValueChange={v => { setDeptFilter(v); setPage(1) }}>
          <SelectTrigger className="h-8 text-xs w-36"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Departments</SelectItem>
            {['HR','Finance','Nursing','Administration','Pharmacy','Lab','Maintenance','IT'].map(d => (
              <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1) }}>
          <SelectTrigger className="h-8 text-xs w-32"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Status</SelectItem>
            {['Active','On Leave','Retired','Terminated'].map(s => (
              <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || deptFilter !== 'all' || statusFilter !== 'all') && (
          <button
            className="text-xs text-primary hover:underline flex items-center gap-1"
            onClick={() => { setSearch(''); setDeptFilter('all'); setStatusFilter('all'); setPage(1) }}
          >
            <X className="w-3 h-3" />Clear filters
          </button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} employees</span>
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg text-xs">
          <span className="font-semibold text-primary">{selected.size} selected</span>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
            <Download className="w-3 h-3" />Export Selected
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs">Change Department</Button>
          <Button variant="outline" size="sm" className="h-7 text-xs text-destructive border-destructive/30">Mark Inactive</Button>
          <button className="ml-auto text-muted-foreground hover:text-foreground" onClick={() => setSelected(new Set())}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="w-8 px-3 py-2">
                  <Checkbox checked={selected.size === paged.length && paged.length > 0} onCheckedChange={toggleAll} />
                </th>
                {([
                  ['code',     'Employee Code'],
                  ['nameEn',   'Full Name'],
                  ['gender',   'Gender'],
                  ['dept',     'Department'],
                  ['position', 'Position'],
                  ['grade',    'Grade'],
                  ['hireDate', 'Hire Date'],
                  ['status',   'Status'],
                ] as [keyof Employee, string][]).map(([f, label]) => (
                  <th
                    key={f}
                    className="text-left px-3 py-2 font-medium text-muted-foreground cursor-pointer hover:text-foreground whitespace-nowrap"
                    onClick={() => toggleSort(f)}
                  >
                    {label}<SortIcon field={f} />
                  </th>
                ))}
                <th className="px-3 py-2 font-medium text-muted-foreground text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(emp => (
                <tr key={emp.code} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-1.5">
                    <Checkbox
                      checked={selected.has(emp.code)}
                      onCheckedChange={c => {
                        const s = new Set(selected)
                        c ? s.add(emp.code) : s.delete(emp.code)
                        setSelected(s)
                      }}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <Link href={`/admin/hr/employees/${emp.code}`} className="font-mono text-primary hover:underline text-[11px]">
                      {emp.code}
                    </Link>
                  </td>
                  <td className="px-3 py-1.5">
                    <p className="font-medium text-foreground">{emp.nameEn}</p>
                    <p className="text-[10px] text-muted-foreground">{emp.nameLao}</p>
                  </td>
                  <td className="px-3 py-1.5 text-muted-foreground">{emp.gender === 'M' ? 'Male' : 'Female'}</td>
                  <td className="px-3 py-1.5">
                    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${DEPT_COLORS[emp.dept] ?? 'bg-slate-100 text-slate-700'}`}>
                      {emp.dept}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-foreground">{emp.position}</td>
                  <td className="px-3 py-1.5 text-muted-foreground">{emp.grade}</td>
                  <td className="px-3 py-1.5 tabular-nums text-muted-foreground">{emp.hireDate}</td>
                  <td className="px-3 py-1.5"><StatusBadge status={emp.status} /></td>
                  <td className="px-3 py-1.5">
                    <div className="flex items-center gap-1 justify-center">
                      <Link href={`/admin/hr/employees/${emp.code}`}>
                        <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Edit">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Print ID Card">
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-muted/10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rows per page:</span>
            <Select value={String(perPage)} onValueChange={v => { setPerPage(Number(v)); setPage(1) }}>
              <SelectTrigger className="h-7 text-xs w-16"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map(n => (
                  <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">
              {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length} employees
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7 px-2" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground px-1">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" className="h-7 px-2" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
