'use client'

import { useState } from 'react'
import { ArrowLeft, Edit, Printer, Award, FileText, MoreHorizontal, Plus } from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/mis/AppShell'
import { StatusBadge } from '@/components/mis/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const FAMILY: { name: string; rel: string; dob: string; occ: string; contact: string }[] = [
  { name: 'Souphasith Phommachanh', rel: 'Spouse',   dob: '12/05/1987', occ: 'Teacher',  contact: '020-5551-2345' },
  { name: 'Siphone Phommachanh',    rel: 'Son',       dob: '03/08/2010', occ: 'Student',  contact: '—' },
  { name: 'Khammanh Phommachanh',   rel: 'Daughter',  dob: '17/02/2014', occ: 'Student',  contact: '—' },
]

const CAREER = [
  { date: '01/03/2022', type: 'Promotion', from: 'Accountant · P3', to: 'Senior Accountant · P4', fromDept: 'Finance', toDept: 'Finance', order: 'MOH-2022-0145', approver: 'Dir. Khamthavy V.' },
  { date: '15/03/2019', type: 'Hire',      from: '—',               to: 'Accountant · P3',        fromDept: '—',       toDept: 'Finance', order: 'MOH-2019-0088', approver: 'Dir. Khamthavy V.' },
]

const CAREER_BADGE: Record<string, string> = {
  Promotion: 'bg-emerald-50 text-emerald-700',
  Transfer:  'bg-blue-50 text-blue-700',
  Hire:      'bg-primary/10 text-primary',
  Upgrade:   'bg-purple-50 text-purple-700',
}

export default function EmployeeDetailClient({ code }: { code: string }) {
  const [tab, setTab] = useState('personal')

  return (
    <AppShell breadcrumbs={[
      { label: 'Human Resources', href: '/admin/hr/employees' },
      { label: 'Employee List', href: '/admin/hr/employees' },
      { label: 'Somsak Phommachanh' },
    ]}>
      {/* Back + title */}
      <div className="flex items-center gap-3 mb-3">
        <Link href="/admin/hr/employees">
          <Button variant="outline" size="sm" className="h-8 px-2">
            <ArrowLeft className="w-3.5 h-3.5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-foreground">Somsak Phommachanh</h1>
              <span className="text-xs text-muted-foreground">ທ້າວ ສົມສັກ ພົມມະຈັນ</span>
              <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">EMP-2024-0142</span>
              <StatusBadge status="Active" />
            </div>
          </div>
        </div>
      </div>

      {/* Summary card */}
      <div className="bg-card border border-border rounded-lg p-4 mb-4 flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-primary">SP</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-1">
            {[
              ['Department', 'Finance'],
              ['Position', 'Senior Accountant'],
              ['Grade', 'P4'],
              ['Hire Date', '15/03/2019'],
              ['Years of Service', '7 years'],
              ['Supervisor', 'Ms. Khamla B.'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-[10px] text-muted-foreground">{k}</p>
                <p className="text-xs font-semibold text-foreground">{v}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Edit className="w-3 h-3" />
          <Link href="/admin/hr/employees/add">Edit</Link>
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Printer className="w-3 h-3" />Print ID Card</Button>
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Award className="w-3 h-3" />Certificate</Button>
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><FileText className="w-3 h-3" />Payslips</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="h-7 text-xs px-2"><MoreHorizontal className="w-3.5 h-3.5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs">
              <DropdownMenuItem>Transfer</DropdownMenuItem>
              <DropdownMenuItem>Issue Warning</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Terminate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-8 text-xs mb-3">
          {[
            ['personal',  'Personal Info (HRM-001)'],
            ['family',    'Family (HRM-002)'],
            ['education', 'Education (HRM-003)'],
            ['certs',     'Certificates (HRM-004)'],
            ['career',    'Career History (HRM-005)'],
            ['leave',     'Leave Balance (HRM-011)'],
            ['docs',      'Documents'],
          ].map(([v, l]) => (
            <TabsTrigger key={v} value={v} className="text-xs h-7">{l}</TabsTrigger>
          ))}
        </TabsList>

        {/* Personal Info */}
        <TabsContent value="personal">
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-xs font-semibold text-foreground mb-3 pb-1 border-b border-border uppercase tracking-wide">
                Basic Information / ຂໍ້ມູນພື້ນຖານ
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Employee Code / ລະຫັດ" value="EMP-2024-0142" readonly />
                <Field label="National ID / ບັດປະຈຳຕົວ" value="12345678901234" />
                <Field label="First Name (EN)" value="Somsak" />
                <Field label="Last Name (EN)" value="Phommachanh" />
                <Field label="First Name (ລາວ)" value="ສົມສັກ" />
                <Field label="Last Name (ລາວ)" value="ພົມມະຈັນ" />
                <div>
                  <Label className="text-xs mb-1 block">Gender / ເພດ <span className="text-destructive">*</span></Label>
                  <div className="flex gap-4 mt-1">
                    {['Male','Female','Other'].map(g => (
                      <label key={g} className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <input type="radio" name="gender" defaultChecked={g==='Male'} className="accent-primary" />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>
                <Field label="Date of Birth / ວັນເດືອນປີເກີດ" value="12/07/1985" />
                <Field label="Age (calculated)" value="40 years" readonly />
                <Field label="Marital Status / ສະຖານະ" value="Married" select options={['Single','Married','Divorced','Widowed']} />
                <Field label="Nationality / ສັນຊາດ" value="Lao" />
              </div>
            </div>

            {/* Contact */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-xs font-semibold text-foreground mb-3 pb-1 border-b border-border uppercase tracking-wide">
                Contact / ຂໍ້ມູນຕິດຕໍ່
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Phone / ໂທລະສັບ" value="020-5551-0142" />
                <Field label="Email" value="somsak.p@mittaphab.gov.la" />
                <div className="col-span-2">
                  <Label className="text-xs mb-1 block">Current Address / ທີ່ຢູ່ປັດຈຸບັນ</Label>
                  <Textarea className="text-xs h-14 resize-none" defaultValue="Ban Phonxay, Sisattanak District, Vientiane Capital" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs mb-1 block">Permanent Address / ທີ່ຢູ່ຖາວອນ</Label>
                  <Textarea className="text-xs h-14 resize-none" defaultValue="Ban Nongviengkham, Pak Ngum District, Vientiane Province" />
                </div>
                <Field label="Emergency Contact Name" value="Souphasith P." />
                <Field label="Emergency Contact Phone" value="020-5551-2345" />
              </div>
            </div>

            {/* Employment */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-xs font-semibold text-foreground mb-3 pb-1 border-b border-border uppercase tracking-wide">
                Employment / ການຈ້າງງານ
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Hospital / ໂຮງໝໍ" value="Mittaphab" select options={['Mittaphab','Setthathirath','Mahosot']} />
                <Field label="Department / ພະແນກ" value="Finance" select options={['Finance','HR','Nursing','Administration','Pharmacy','Lab','Maintenance','IT']} />
                <Field label="Position / ຕຳແໜ່ງ" value="Senior Accountant" />
                <Field label="Grade / Level" value="P4" />
                <Field label="Employment Type" value="Permanent" select options={['Permanent','Contract','Temporary']} />
                <Field label="Hire Date / ວັນທີເຂົ້າວຽກ" value="15/03/2019" />
                <Field label="Probation End Date" value="15/06/2019" />
                <Field label="Supervisor / ຜູ້ຄຸ້ມຄອງ" value="Ms. Khamla Boupha" />
                <Field label="Employment Status" value="Active" select options={['Active','On Leave','Retired','Terminated']} />
                <Field label="Retirement Date" value="" />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Family */}
        <TabsContent value="family">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
              <p className="text-xs font-semibold">Family Members / ສະມາຊິກໃນຄອບຄົວ</p>
              <Button size="sm" className="h-7 text-xs gap-1"><Plus className="w-3 h-3" />Add Member</Button>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Name','Relationship','Date of Birth','Occupation','Contact',''].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FAMILY.map((f, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-3 py-2 font-medium">{f.name}</td>
                    <td className="px-3 py-2">{f.rel}</td>
                    <td className="px-3 py-2 tabular-nums">{f.dob}</td>
                    <td className="px-3 py-2">{f.occ}</td>
                    <td className="px-3 py-2">{f.contact}</td>
                    <td className="px-3 py-2">
                      <button className="text-primary hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Career */}
        <TabsContent value="career">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold">Career History / ປະຫວັດການທຳງານ</p>
              <Button size="sm" className="h-7 text-xs gap-1"><Plus className="w-3 h-3" />Add Entry</Button>
            </div>
            <div className="space-y-4">
              {CAREER.map((c, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary/30 mt-1" />
                    {i < CAREER.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="tabular-nums text-xs text-muted-foreground">{c.date}</span>
                      <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${CAREER_BADGE[c.type]}`}>{c.type}</span>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-[10px] text-muted-foreground">From</p>
                          <p className="font-medium">{c.from}</p>
                          <p className="text-muted-foreground">{c.fromDept}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">To</p>
                          <p className="font-medium">{c.to}</p>
                          <p className="text-muted-foreground">{c.toDept}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">Order No.</p>
                          <p className="font-mono text-[11px]">{c.order}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">Approved by</p>
                          <p>{c.approver}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Other tabs — placeholder */}
        {['education','certs','leave','docs'].map(t => (
          <TabsContent key={t} value={t}>
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <p className="text-xs text-muted-foreground">This tab maps to HRM-00{t === 'education' ? 3 : t === 'certs' ? 4 : t === 'leave' ? 11 : 'x'} — data will be loaded here.</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Sticky bottom bar */}
      {/* <div className="fixed bottom-0 right-0 bg-card border-t border-border px-6 py-2 flex items-center justify-end gap-2 z-20">
        <Link href="/admin/hr/employees">
          <Button variant="ghost" size="sm" className="text-xs h-8">Cancel</Button>
        </Link>
        <Button variant="outline" size="sm" className="text-xs h-8">Save Draft</Button>
        <Button size="sm" className="text-xs h-8">Save &amp; Close</Button>
      </div>
      <div className="h-12" /> */}
    </AppShell>
  )
}

function Field({ label, value, readonly, select, options }: {
  label: string; value: string; readonly?: boolean
  select?: boolean; options?: string[]
}) {
  return (
    <div>
      <Label className="text-xs mb-1 block">{label}</Label>
      {select ? (
        <Select defaultValue={value}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {options?.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
          </SelectContent>
        </Select>
      ) : (
        <Input
          className="h-8 text-xs"
          defaultValue={value}
          readOnly={readonly}
          disabled={readonly}
        />
      )}
    </div>
  )
}
