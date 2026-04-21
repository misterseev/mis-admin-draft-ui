'use client'

import { useState } from 'react'
import { Plus, Search, Shield, ShieldCheck, ShieldAlert, Mail, Phone, X, Check } from 'lucide-react'
import { AppShell } from '@/components/mis/AppShell'
import { Input } from '@/components/ui/input'

type Role = 'Super Admin' | 'Finance Manager' | 'Accountant' | 'Inventory Manager' | 'Procurement Officer' | 'Asset Manager' | 'Viewer'
type UserStatus = 'Active' | 'Inactive' | 'Pending'

interface SystemUser {
  id: string
  name: string
  nameLao: string
  email: string
  phone: string
  role: Role
  dept: string
  avatar: string
  status: UserStatus
  lastLogin: string
  modules: string[]
}

const ROLES_META: Record<Role, { color: string; bg: string; icon: typeof Shield }> = {
  'Super Admin':         { color: 'text-red-700',    bg: 'bg-red-50 border-red-200',      icon: ShieldAlert  },
  'Finance Manager':     { color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200',icon: ShieldCheck  },
  'Accountant':          { color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',    icon: Shield       },
  'Inventory Manager':   { color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',  icon: Shield       },
  'Procurement Officer': { color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',  icon: Shield       },
  'Asset Manager':       { color: 'text-teal-700',   bg: 'bg-teal-50 border-teal-200',    icon: Shield       },
  'Viewer':              { color: 'text-slate-600',  bg: 'bg-slate-50 border-slate-200',  icon: Shield       },
}

const ALL_MODULES = ['Inventory', 'Purchasing', 'Asset', 'Budget', 'Accounting', 'System Admin']

const MODULE_PERMISSIONS: Record<Role, Record<string, { read: boolean; write: boolean; approve: boolean }>> = {
  'Super Admin':         { Inventory: {read:true,write:true,approve:true}, Purchasing:{read:true,write:true,approve:true}, Asset:{read:true,write:true,approve:true}, Budget:{read:true,write:true,approve:true}, Accounting:{read:true,write:true,approve:true}, 'System Admin':{read:true,write:true,approve:true} },
  'Finance Manager':     { Inventory: {read:true,write:false,approve:false}, Purchasing:{read:true,write:false,approve:true}, Asset:{read:true,write:false,approve:false}, Budget:{read:true,write:true,approve:true}, Accounting:{read:true,write:true,approve:true}, 'System Admin':{read:false,write:false,approve:false} },
  'Accountant':          { Inventory: {read:true,write:false,approve:false}, Purchasing:{read:true,write:false,approve:false}, Asset:{read:true,write:false,approve:false}, Budget:{read:true,write:false,approve:false}, Accounting:{read:true,write:true,approve:false}, 'System Admin':{read:false,write:false,approve:false} },
  'Inventory Manager':   { Inventory: {read:true,write:true,approve:false}, Purchasing:{read:true,write:true,approve:false}, Asset:{read:true,write:false,approve:false}, Budget:{read:true,write:false,approve:false}, Accounting:{read:false,write:false,approve:false}, 'System Admin':{read:false,write:false,approve:false} },
  'Procurement Officer': { Inventory: {read:true,write:false,approve:false}, Purchasing:{read:true,write:true,approve:false}, Asset:{read:false,write:false,approve:false}, Budget:{read:true,write:false,approve:false}, Accounting:{read:false,write:false,approve:false}, 'System Admin':{read:false,write:false,approve:false} },
  'Asset Manager':       { Inventory: {read:false,write:false,approve:false}, Purchasing:{read:true,write:false,approve:false}, Asset:{read:true,write:true,approve:false}, Budget:{read:true,write:false,approve:false}, Accounting:{read:false,write:false,approve:false}, 'System Admin':{read:false,write:false,approve:false} },
  'Viewer':              { Inventory: {read:true,write:false,approve:false}, Purchasing:{read:true,write:false,approve:false}, Asset:{read:true,write:false,approve:false}, Budget:{read:true,write:false,approve:false}, Accounting:{read:true,write:false,approve:false}, 'System Admin':{read:false,write:false,approve:false} },
}

const USERS: SystemUser[] = [
  { id:'u1', name:'Bounlieng Sourivong',  nameLao:'ບຸນລຽງ ສຸລິວົງ',   email:'bounlieng@hospital.la',  phone:'020-5551-0001', role:'Finance Manager',     dept:'Finance',       avatar:'BS', status:'Active',   lastLogin:'21/04/2026 08:42', modules:['Budget','Accounting','Inventory'] },
  { id:'u2', name:'Khamthavy Vongsack',   nameLao:'ຂຳທາວີ ວົງສັກ',    email:'khamthavy@hospital.la',  phone:'020-5551-0002', role:'Accountant',          dept:'Finance',       avatar:'KV', status:'Active',   lastLogin:'21/04/2026 07:58', modules:['Accounting','Budget'] },
  { id:'u3', name:'Phonsa Luangxay',      nameLao:'ໂພນສາ ຫຼວງໄຊ',     email:'phonsa@hospital.la',     phone:'020-5551-0003', role:'Inventory Manager',   dept:'Pharmacy',      avatar:'PL', status:'Active',   lastLogin:'20/04/2026 16:30', modules:['Inventory','Purchasing'] },
  { id:'u4', name:'Vilay Sengdala',       nameLao:'ວິໄລ ແສງດາລາ',     email:'vilay@hospital.la',      phone:'020-5551-0004', role:'Procurement Officer', dept:'Procurement',   avatar:'VS', status:'Active',   lastLogin:'20/04/2026 14:10', modules:['Purchasing','Inventory'] },
  { id:'u5', name:'Bounmy Keodouangsy',   nameLao:'ບຸນມີ ແກ້ວດວງສີ',  email:'bounmy@hospital.la',     phone:'020-5551-0005', role:'Asset Manager',       dept:'Maintenance',   avatar:'BK', status:'Active',   lastLogin:'19/04/2026 11:22', modules:['Asset'] },
  { id:'u6', name:'Noy Sayavong',         nameLao:'ນ້ອຍ ສາຍວົງ',       email:'noy@hospital.la',        phone:'020-5551-0006', role:'Viewer',              dept:'HR',            avatar:'NS', status:'Active',   lastLogin:'18/04/2026 09:15', modules:['Inventory','Budget'] },
  { id:'u7', name:'Sysadmin Account',     nameLao:'ບັນຊີຜູ້ດູແລ',      email:'admin@hospital.la',      phone:'020-5551-0000', role:'Super Admin',         dept:'IT',            avatar:'SA', status:'Active',   lastLogin:'21/04/2026 09:00', modules:['System Admin'] },
  { id:'u8', name:'Khamphan Vongkhot',    nameLao:'ຄຳພັນ ວົງຂົດ',     email:'khamphan@hospital.la',   phone:'020-5551-0007', role:'Accountant',          dept:'Finance',       avatar:'KP', status:'Inactive', lastLogin:'10/03/2026 14:00', modules:['Accounting'] },
  { id:'u9', name:'Soukdavanh Phomma',    nameLao:'ສຸກດາວັນ ໂພມາ',    email:'soukdavanh@hospital.la', phone:'020-5551-0008', role:'Viewer',              dept:'Nursing',       avatar:'SP', status:'Pending',  lastLogin:'—', modules:[] },
]

const STATUS_META = {
  Active:   { dot: 'bg-emerald-500', label: 'Active'   },
  Inactive: { dot: 'bg-slate-400',   label: 'Inactive' },
  Pending:  { dot: 'bg-amber-400',   label: 'Pending'  },
}

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string>('u1')
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all')

  const filtered = USERS.filter(u => {
    const q = search.toLowerCase()
    if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    return true
  })

  const selected = USERS.find(u => u.id === selectedId) ?? USERS[0]
  const RoleMeta = ROLES_META[selected.role]
  const RoleIcon = RoleMeta.icon
  const perms = MODULE_PERMISSIONS[selected.role]

  return (
    <AppShell breadcrumbs={[{ label: 'System', href: '/admin/system/users' }, { label: 'Users' }]}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold">User Management</h1>
          <p className="text-xs text-muted-foreground">{USERS.filter(u => u.status === 'Active').length} active · {USERS.length} total users</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          <Plus className="w-3.5 h-3.5" />Invite User
        </button>
      </div>

      <div className="flex gap-0 border border-border rounded-xl overflow-hidden bg-card shadow-sm" style={{ minHeight: '560px' }}>
        {/* Left: user list */}
        <div className="w-72 shrink-0 border-r border-border flex flex-col">
          <div className="p-3 border-b border-border space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input className="pl-8 h-8 text-xs" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-1 flex-wrap">
              <button
                onClick={() => setRoleFilter('all')}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${roleFilter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
              >All</button>
              {(['Finance Manager','Accountant','Inventory Manager','Procurement Officer','Asset Manager','Viewer'] as Role[]).map(r => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(roleFilter === r ? 'all' : r)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${roleFilter === r ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
                >
                  {r.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {filtered.map(u => {
              const rm = ROLES_META[u.role]
              const sm = STATUS_META[u.status]
              return (
                <button
                  key={u.id}
                  onClick={() => setSelectedId(u.id)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${selectedId === u.id ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-muted/30'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${rm.bg} ${rm.color}`}>
                    {u.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold truncate">{u.name}</p>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${sm.dot}`} />
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{u.role}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: user detail */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Profile header */}
          <div className="px-6 py-5 border-b border-border bg-muted/10">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-black border-2 shrink-0 ${RoleMeta.bg} ${RoleMeta.color}`}>
                {selected.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h2 className="text-base font-bold">{selected.name}</h2>
                  <span className={`inline-flex items-center gap-1 border rounded-full px-2 py-0.5 text-[10px] font-semibold ${RoleMeta.bg} ${RoleMeta.color}`}>
                    <RoleIcon className="w-3 h-3" />{selected.role}
                  </span>
                  <span className={`flex items-center gap-1 text-[10px] font-medium ${STATUS_META[selected.status].dot === 'bg-emerald-500' ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_META[selected.status].dot}`} />
                    {selected.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{selected.nameLao} · {selected.dept}</p>
                <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{selected.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{selected.phone}</span>
                  <span>Last login: <span className="font-medium text-foreground">{selected.lastLogin}</span></span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted">Edit</button>
                {selected.status === 'Active'
                  ? <button className="px-3 py-1.5 text-xs border border-red-200 text-red-600 rounded-md hover:bg-red-50">Deactivate</button>
                  : <button className="px-3 py-1.5 text-xs border border-emerald-200 text-emerald-600 rounded-md hover:bg-emerald-50">Activate</button>
                }
              </div>
            </div>
          </div>

          {/* Permission matrix */}
          <div className="px-6 py-4">
            <p className="text-xs font-bold uppercase tracking-wide mb-3">Module Permissions — Role: {selected.role}</p>
            <div className="rounded-xl border border-border overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[1fr_80px_80px_80px] bg-muted/30 border-b border-border text-[10px] font-bold uppercase text-muted-foreground tracking-wide">
                <div className="px-4 py-2.5">Module</div>
                <div className="px-3 py-2.5 text-center text-blue-600">Read</div>
                <div className="px-3 py-2.5 text-center text-amber-600">Write</div>
                <div className="px-3 py-2.5 text-center text-emerald-600">Approve</div>
              </div>
              {ALL_MODULES.map((mod, i) => {
                const p = perms[mod] ?? { read: false, write: false, approve: false }
                return (
                  <div key={mod} className={`grid grid-cols-[1fr_80px_80px_80px] items-center ${i < ALL_MODULES.length - 1 ? 'border-b border-border/50' : ''} hover:bg-muted/10`}>
                    <div className="px-4 py-3 text-xs font-medium">{mod}</div>
                    {[p.read, p.write, p.approve].map((allowed, j) => (
                      <div key={j} className="flex items-center justify-center py-3">
                        {allowed
                          ? <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center"><Check className="w-3.5 h-3.5 text-emerald-600" /></div>
                          : <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center"><X className="w-3.5 h-3.5 text-muted-foreground/40" /></div>
                        }
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">Permissions are role-based. Contact Super Admin to change individual access.</p>
          </div>

          {/* Active sessions */}
          <div className="px-6 pb-6">
            <p className="text-xs font-bold uppercase tracking-wide mb-2">Account Info</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                ['Department', selected.dept],
                ['Last Login', selected.lastLogin],
                ['Modules Assigned', selected.modules.length ? selected.modules.join(', ') : 'None'],
              ].map(([l, v]) => (
                <div key={l} className="bg-muted/30 rounded-lg px-4 py-3">
                  <p className="text-[10px] text-muted-foreground uppercase mb-0.5">{l}</p>
                  <p className="text-xs font-medium">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
