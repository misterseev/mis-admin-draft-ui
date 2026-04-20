'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Users, CreditCard, Package, Building2, PieChart, BookOpen, Settings,
  ChevronDown, ChevronRight, Menu, X, Bell, LogOut, Globe, ChevronLeft,
  LayoutDashboard, FileText, BarChart3, ClipboardList, History,
  UserPlus, Calendar, Award, Briefcase, Wallet, Calculator, Receipt,
  ShoppingCart, Warehouse, TruckIcon, BarChart2, Landmark, BookMarked,
  FileCheck, Shield, Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface NavItem {
  label: string
  labelLao: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

interface NavGroup {
  group: string
  icon: React.ComponentType<{ className?: string }>
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: 'Human Resources',
    icon: Users,
    items: [
      { label: 'Employees',          labelLao: 'ພະນັກງານ',          href: '/admin/hr/employees',    icon: Users },
      { label: 'Personnel Changes',  labelLao: 'ການປ່ຽນແປງ',       href: '/admin/hr/changes',      icon: UserPlus },
      { label: 'Leave',              labelLao: 'ການລາ',             href: '/admin/hr/leave',        icon: Calendar },
      // { label: 'Documents',          labelLao: 'ເອກະສານ',           href: '/admin/hr/documents',    icon: FileText },
      { label: 'Statistics',         labelLao: 'ສະຖິຕິ',            href: '/admin/hr/statistics',   icon: BarChart3 },
    ],
  },
  {
    group: 'Payroll',
    icon: Wallet,
    items: [
      { label: 'Dashboard',    labelLao: 'ພາບລວມ',          href: '/admin/payroll',            icon: LayoutDashboard },
      { label: 'Setup',        labelLao: 'ການຕັ້ງຄ່າ',       href: '/admin/payroll/setup',      icon: Settings },
      { label: 'Processing',   labelLao: 'ການດໍາເນີນການ',    href: '/admin/payroll/processing', icon: Calculator },
      { label: 'Settlement',   labelLao: 'ການຊໍາລະ',         href: '/admin/payroll/settlement', icon: CreditCard },
      { label: 'Documents',    labelLao: 'ເອກະສານ',          href: '/admin/payroll/documents',  icon: FileText },
      { label: 'Statistics',   labelLao: 'ສະຖິຕິ',           href: '/admin/payroll/statistics', icon: BarChart3 },
    ],
  },
  {
    group: 'Inventory', 
    icon: Package,
    items: [
      { label: 'Master Data', labelLao: 'ຂໍ້ມູນຫຼັກ',   href: '/admin/inventory',            icon: Package },
      { label: 'Purchasing',  labelLao: 'ການຈັດຊື້',    href: '/admin/inventory/purchasing', icon: ShoppingCart },
      { label: 'Receiving',   labelLao: 'ການຮັບສິນຄ້າ', href: '/admin/inventory/receiving',  icon: TruckIcon },
      { label: 'Stock',       labelLao: 'ສາງ',          href: '/admin/inventory/stock',      icon: Warehouse },
      { label: 'Documents',   labelLao: 'ເອກະສານ',      href: '/admin/inventory/documents',  icon: FileText },
      { label: 'Statistics',  labelLao: 'ສະຖິຕິ',       href: '/admin/inventory/statistics', icon: BarChart3 },
    ],
  },
  {
    group: 'Asset',  
    icon: Building2,
    items: [
      { label: 'Master Data', labelLao: 'ຂໍ້ມູນຫຼັກ', href: '/admin/asset',            icon: Building2 },
      { label: 'Lifecycle',   labelLao: 'ວົງຈອນ',      href: '/admin/asset/lifecycle',  icon: Activity },
      { label: 'Documents',   labelLao: 'ເອກະສານ',     href: '/admin/asset/documents',  icon: FileText },
      { label: 'Statistics',  labelLao: 'ສະຖິຕິ',      href: '/admin/asset/statistics', icon: BarChart2 },
    ],
  },
  {
    group: 'Budget', 
    icon: PieChart,
    items: [
      { label: 'Master Data', labelLao: 'ຂໍ້ມູນຫຼັກ', href: '/admin/budget',           icon: Landmark },
      { label: 'Planning',    labelLao: 'ການວາງແຜນ',  href: '/admin/budget/planning',  icon: ClipboardList },
      { label: 'Approval',    labelLao: 'ການອະນຸມັດ', href: '/admin/budget/approval',  icon: FileCheck },
      { label: 'Control',     labelLao: 'ການຄວບຄຸມ',  href: '/admin/budget/control',   icon: Shield },
      { label: 'Execution',   labelLao: 'ການຈັດຕັ້ງ', href: '/admin/budget/execution', icon: Briefcase },
      { label: 'Inquiry',     labelLao: 'ສອບຖາມ',     href: '/admin/budget/inquiry',   icon: BarChart3 },
    ],
  },
  {
    group: 'Accounting', 
    icon: BookOpen,
    items: [
      { label: 'Master Data',   labelLao: 'ຂໍ້ມູນຫຼັກ', href: '/admin/accounting',            icon: BookMarked },
      { label: 'Journal Entry', labelLao: 'ລົງບັນຊີ',  href: '/admin/accounting/journal',    icon: Receipt },
      { label: 'Closing',       labelLao: 'ປິດບັນຊີ',  href: '/admin/accounting/closing',    icon: FileCheck },
      { label: 'Statements',    labelLao: 'ລາຍງານ',    href: '/admin/accounting/statements', icon: FileText },
      { label: 'Statistics',    labelLao: 'ສະຖິຕິ',    href: '/admin/accounting/statistics', icon: BarChart3 },
    ],
  },
  {
    group: 'System Admin',
    icon: Settings,
    items: [
      { label: 'Users',      labelLao: 'ຜູ້ໃຊ້',    href: '/admin/system/users',     icon: Users },
      { label: 'Settings',   labelLao: 'ການຕັ້ງຄ່າ', href: '/admin/system/settings',  icon: Settings },
      { label: 'Audit',      labelLao: 'ກວດສອບ',    href: '/admin/system/audit',     icon: History },
      { label: 'Dashboard',  labelLao: 'ພາບລວມ',    href: '/admin/dashboard',        icon: LayoutDashboard },
    ],
  },
]

const HOSPITALS = ['Mittaphab Hospital', 'Setthathirath Hospital', 'Mahosot Hospital']
const HOSPITAL_LAO = ['ໂຮງໝໍມິດຕະພາບ', 'ໂຮງໝໍເສດຖາທິລາດ', 'ໂຮງໝໍມະໂຫສົດ']

interface AppShellProps {
  children: React.ReactNode
  breadcrumbs?: { label: string; href?: string }[]
}

export function AppShell({ children, breadcrumbs = [] }: AppShellProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  // ເກັບຊື່ group ດຽວທີ່ເປີດຢູ່ (ຫຼື null ຖ້າບໍ່ມີ group ໃດເປີດ)
  const [expandedGroup, setExpandedGroup] = useState<string | null>('Human Resources')
  const [hospital, setHospital] = useState(0)
  const [lang, setLang] = useState<'en' | 'lo'>('en')

  // ຖ້າຄລິກ group ດຽວກັນ → ປິດ; ຖ້າຄລິກ group ອື່ນ → ເປີດ group ນັ້ນ ແລະ ປິດອັນເກົ່າ
  const toggleGroup = (g: string) =>
    setExpandedGroup(prev => (prev === g ? null : g))

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200 flex-shrink-0',
          sidebarOpen ? 'w-64' : 'w-14'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-3 py-3 border-b border-sidebar-border">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
            <Activity className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-xs font-bold text-sidebar-foreground leading-tight truncate">MIS</p>
              <p className="text-[9px] text-sidebar-foreground/50 truncate">LAO-14 · MOH</p>
            </div>
          )}
         
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto pl-1 pr-4 py-2 scrollbar-thin">
          {NAV_GROUPS.map(group => {
            const GroupIcon = group.icon
            const expanded = expandedGroup === group.group
            const active = group.items.some(i => pathname?.startsWith(i.href))
            return (
              <div key={group.group}>
                <button
                  onClick={() => toggleGroup(group.group)}
                  className={cn(
                    'w-full cursor-pointer flex items-center gap-2 px-3 py-2.5 text-left hover:bg-sidebar-accent transition-colors',
                    active && 'text-sidebar-primary'
                  )}
                >
                  <GroupIcon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-sidebar-primary' : 'text-sidebar-foreground/60')} />
                  {sidebarOpen && (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-sidebar-foreground/90 truncate">{group.group}</p>
                      </div>
                      {expanded ? (
                        <ChevronDown className="w-3 h-3 text-sidebar-foreground/40" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-sidebar-foreground/40" />
                      )}
                    </>
                  )}
                </button>
                {sidebarOpen && expanded && (
                  <div className="ml-3 border-l border-sidebar-border pl-2 mb-1">
                    {group.items.map(item => {
                      const ItemIcon = item.icon
                      const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-2 p-2 rounded-md text-xs transition-colors my-0.5',
                            isActive
                              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                          )}
                        >
                          {ItemIcon && <ItemIcon className="w-3 h-3 flex-shrink-0" />}
                          <span className="truncate">{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-sidebar-border">
          {sidebarOpen ? (
            <p className="text-[9px] text-sidebar-foreground/30 text-center">v1.0 · Powered by CWIT</p>
          ) : (
            <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto" title="Connected" />
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 py-2 bg-card border-b border-border h-12 flex-shrink-0">
          {/* Hospital selector */}

          <div className="flex-1" />

          {/* Lang toggle */}
          <button
            onClick={() => setLang(l => l === 'en' ? 'lo' : 'en')}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded px-2 py-0.5"
          >
            <Globe className="w-3 h-3" />
            {lang === 'en' ? 'EN' : 'ລາວ'}
          </button>

          {/* Notifications */}
          <button className="relative text-muted-foreground hover:text-foreground">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-destructive text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-muted rounded-md px-2 py-1 transition-colors">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-primary">SP</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium text-foreground leading-none">Somsak P.</p>
                  <p className="text-[10px] text-muted-foreground">HR Manager</p>
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='min-w-44'>
              <DropdownMenuItem className="text-xs">Profile</DropdownMenuItem>
              <DropdownMenuItem className="text-xs">Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs text-destructive">
                <Link href="/login" className='flex justify-center items-center gap-2'>
                <LogOut className="w-3.5 h-3.5 text-destructive" />
                Sign Out 
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Breadcrumb */}
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1 px-4 py-1.5 text-[11px] text-muted-foreground bg-muted/30 border-b border-border">
            <Link href="/admin/dashboard" className="hover:text-primary transition-colors">Home</Link>
            {breadcrumbs.map((bc, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="w-3 h-3" />
                {bc.href ? (
                  <Link href={bc.href} className="hover:text-primary transition-colors">{bc.label}</Link>
                ) : (
                  <span className="text-foreground font-medium">{bc.label}</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 relative">
          {children}
        </main>

        {/* Footer */}
        <footer className="px-4 py-1.5 border-t border-border bg-card flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">v1.0.0 — EDCF LAO-14 · Ministry of Health, Lao PDR</p>
          <p className="text-[10px] text-muted-foreground">Powered by <span className="font-semibold text-primary">CWIT</span></p>
        </footer>
      </div>
    </div>
  )
}