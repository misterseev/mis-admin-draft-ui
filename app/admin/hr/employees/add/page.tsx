'use client'

import { AppShell } from '@/components/mis/AppShell'
import React, { useState } from 'react'
import Link from 'next/link'
import {
    User, Mail, Phone, MapPin, Calendar, Briefcase, Building2,
    GraduationCap, CreditCard, Upload, Save, X, ChevronLeft,
    IdCard, Users, Award, FileText, AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────
// Field primitives
// ─────────────────────────────────────────────────────────────
interface FieldProps {
    label: string
    labelLao?: string
    required?: boolean
    error?: string
    children: React.ReactNode
    className?: string
}

function Field({ label, labelLao, required, error, children, className }: FieldProps) {
    return (
        <div className={cn('flex flex-col gap-1', className)}>
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <span>{label}</span>
                {required && <span className="text-destructive">*</span>}
            </label>
            {children}
            {error && (
                <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </p>
            )}
        </div>
    )
}

const inputClass = cn(
    'w-full h-8 px-2.5 text-xs rounded-md border border-input bg-background',
    'placeholder:text-muted-foreground/60',
    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
    'transition-colors'
)

const selectClass = cn(inputClass, 'cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27%23999%27%3E%3Cpath fill-rule=%27evenodd%27 d=%27M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z%27 clip-rule=%27evenodd%27/%3E%3C/svg%3E")] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1rem] pr-8')

// ─────────────────────────────────────────────────────────────
// Section wrapper
// ─────────────────────────────────────────────────────────────
interface SectionProps {
    title: string
    titleLao?: string
    description?: string
    icon: React.ComponentType<{ className?: string }>
    children: React.ReactNode
}

function Section({ title, titleLao, description, icon: Icon, children }: SectionProps) {
    return (
        <section className="bg-card border border-border rounded-lg overflow-hidden">
            <header className="flex items-start gap-3 px-4 py-3 border-b border-border bg-muted/30">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground leading-tight">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
                    )}
                </div>
            </header>
            <div className="p-4">
                {children}
            </div>
        </section>
    )
}

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const DEPARTMENTS = [
    'Finance', 'Human Resources', 'Medical', 'Nursing', 'Pharmacy',
    'Laboratory', 'Radiology', 'Administration', 'IT', 'Maintenance',
]

const POSITIONS = [
    'Senior Accountant', 'Accountant', 'HR Manager', 'HR Officer',
    'Doctor', 'Nurse', 'Pharmacist', 'Lab Technician', 'Radiologist',
    'Administrator', 'IT Officer', 'Maintenance Staff',
]

const GRADES = ['P1', 'P2', 'P3', 'P4', 'P5', 'M1', 'M2', 'M3', 'E1', 'E2']

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Intern']

const STATUS_OPTIONS = ['Active', 'On Leave', 'Suspended', 'Terminated']

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export default function EmployeeForm() {
    const [formData, setFormData] = useState({
        // Personal
        employeeId: '',
        nameEn: '',
        nameLao: '',
        gender: '',
        dob: '',
        nationality: 'Lao',
        idNumber: '',
        maritalStatus: '',

        // Contact
        email: '',
        phone: '',
        emergencyContact: '',
        emergencyPhone: '',
        address: '',
        province: '',

        // Employment
        dept: '',
        position: '',
        grade: '',
        employmentType: 'Full-time',
        hireDate: '',
        contractEnd: '',
        status: 'Active',
        supervisor: '',

        // Compensation
        baseSalary: '',
        bankName: '',
        bankAccount: '',

        // Education
        education: '',
        institution: '',
        graduationYear: '',
    })

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
        // TODO: send to API
    }

    return (
        <AppShell breadcrumbs={[
            { label: 'Human Resources', href: '/admin/hr/employees' },
            { label: 'Employee List', href: '/admin/hr/employees' },
            { label: 'Add New Employee' },
        ]}>
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-4 pb-6">


                {/* ── Personal Info ── */}
                <Section
                    title="Personal Information"
                    titleLao="ຂໍ້ມູນສ່ວນຕົວ"
                    description="Basic identity and demographic details"
                    icon={User}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                        {/* Photo upload */}
                        <div className="md:col-span-3 flex items-center gap-4 pb-3 mb-1 border-b border-border/60">
                            <div className="w-20 h-20 rounded-lg bg-muted border-2 border-dashed border-border flex items-center justify-center shrink-0">
                                <User className="w-8 h-8 text-muted-foreground/40" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-foreground">Profile Photo</p>
                                <p className="text-[10px] text-muted-foreground mb-2">JPG or PNG · Max 2MB · 300×300px recommended</p>
                                <Button type="button" variant="outline" size="sm" className="h-7 text-xs">
                                    <Upload className="w-3 h-3" />
                                    Upload Photo
                                </Button>
                            </div>
                        </div>

                        <Field label="Employee ID" labelLao="ລະຫັດພະນັກງານ" required>
                            <input
                                type="text"
                                className={inputClass}
                                placeholder="EMP-0001"
                                value={formData.employeeId}
                                onChange={e => handleChange('employeeId', e.target.value)}
                            />
                        </Field>

                        <Field label="Full Name (English)" labelLao="ຊື່-ນາມສະກຸນ (ອັງກິດ)" required>
                            <input
                                type="text"
                                className={inputClass}
                                placeholder="Somsak Phommachanh"
                                value={formData.nameEn}
                                onChange={e => handleChange('nameEn', e.target.value)}
                            />
                        </Field>

                        <Field label="Full Name (Lao)" labelLao="ຊື່-ນາມສະກຸນ (ລາວ)" required>
                            <input
                                type="text"
                                className={inputClass}
                                placeholder="ສົມສັກ ພົມມະຈັນ"
                                value={formData.nameLao}
                                onChange={e => handleChange('nameLao', e.target.value)}
                            />
                        </Field>

                        <Field label="Gender" labelLao="ເພດ" required>
                            <select
                                className={selectClass}
                                value={formData.gender}
                                onChange={e => handleChange('gender', e.target.value)}
                            >
                                <option value="">Select gender</option>
                                <option value="M">Male · ຊາຍ</option>
                                <option value="F">Female · ຍິງ</option>
                            </select>
                        </Field>

                        <Field label="Date of Birth" labelLao="ວັນເດືອນປີເກີດ" required>
                            <input
                                type="date"
                                className={inputClass}
                                value={formData.dob}
                                onChange={e => handleChange('dob', e.target.value)}
                            />
                        </Field>

                        <Field label="Nationality" labelLao="ສັນຊາດ">
                            <input
                                type="text"
                                className={inputClass}
                                value={formData.nationality}
                                onChange={e => handleChange('nationality', e.target.value)}
                            />
                        </Field>

                        <Field label="National ID / Passport" labelLao="ເລກບັດປະຈໍາຕົວ">
                            <input
                                type="text"
                                className={inputClass}
                                placeholder="123456789"
                                value={formData.idNumber}
                                onChange={e => handleChange('idNumber', e.target.value)}
                            />
                        </Field>

                        <Field label="Marital Status" labelLao="ສະຖານະພາບ">
                            <select
                                className={selectClass}
                                value={formData.maritalStatus}
                                onChange={e => handleChange('maritalStatus', e.target.value)}
                            >
                                <option value="">Select status</option>
                                <option value="Single">Single · ໂສດ</option>
                                <option value="Married">Married · ແຕ່ງງານ</option>
                                <option value="Divorced">Divorced · ຢ່າຮ້າງ</option>
                                <option value="Widowed">Widowed · ໝ້າຍ</option>
                            </select>
                        </Field>
                    </div>
                </Section>

                {/* ── Contact Info ── */}
                <Section
                    title="Contact Information"
                    titleLao="ຂໍ້ມູນຕິດຕໍ່"
                    description="Phone, email, and address details"
                    icon={Phone}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                        <Field label="Email" labelLao="ອີເມວ" required>
                            <input
                                type="email"
                                className={inputClass}
                                placeholder="somsak.p@hospital.gov.la"
                                value={formData.email}
                                onChange={e => handleChange('email', e.target.value)}
                            />
                        </Field>

                        <Field label="Phone Number" labelLao="ເບີໂທ" required>
                            <input
                                type="tel"
                                className={inputClass}
                                placeholder="+856 20 5555 1234"
                                value={formData.phone}
                                onChange={e => handleChange('phone', e.target.value)}
                            />
                        </Field>

                        <Field label="Emergency Contact Name" labelLao="ຜູ້ຕິດຕໍ່ສຸກເສີນ">
                            <input
                                type="text"
                                className={inputClass}
                                placeholder="Relative's name"
                                value={formData.emergencyContact}
                                onChange={e => handleChange('emergencyContact', e.target.value)}
                            />
                        </Field>

                        <Field label="Emergency Phone" labelLao="ເບີໂທສຸກເສີນ">
                            <input
                                type="tel"
                                className={inputClass}
                                placeholder="+856 20 5555 9876"
                                value={formData.emergencyPhone}
                                onChange={e => handleChange('emergencyPhone', e.target.value)}
                            />
                        </Field>

                        <Field label="Address" labelLao="ທີ່ຢູ່" className="md:col-span-2">
                            <input
                                type="text"
                                className={inputClass}
                                placeholder="Village, District"
                                value={formData.address}
                                onChange={e => handleChange('address', e.target.value)}
                            />
                        </Field>

                        <Field label="Province" labelLao="ແຂວງ">
                            <select
                                className={selectClass}
                                value={formData.province}
                                onChange={e => handleChange('province', e.target.value)}
                            >
                                <option value="">Select province</option>
                                <option value="Vientiane Capital">Vientiane Capital · ນະຄອນຫຼວງວຽງຈັນ</option>
                                <option value="Vientiane">Vientiane · ວຽງຈັນ</option>
                                <option value="Luang Prabang">Luang Prabang · ຫຼວງພະບາງ</option>
                                <option value="Savannakhet">Savannakhet · ສະຫວັນນະເຂດ</option>
                                <option value="Champasak">Champasak · ຈໍາປາສັກ</option>
                                <option value="Other">Other</option>
                            </select>
                        </Field>
                    </div>
                </Section>

                {/* ── Employment Details ── */}
                <Section
                    title="Employment Details"
                    titleLao="ຂໍ້ມູນການຈ້າງງານ"
                    description="Position, department, and work arrangement"
                    icon={Briefcase}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                        <Field label="Department" labelLao="ພະແນກ" required>
                            <select
                                className={selectClass}
                                value={formData.dept}
                                onChange={e => handleChange('dept', e.target.value)}
                            >
                                <option value="">Select department</option>
                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </Field>

                        <Field label="Position" labelLao="ຕໍາແໜ່ງ" required>
                            <select
                                className={selectClass}
                                value={formData.position}
                                onChange={e => handleChange('position', e.target.value)}
                            >
                                <option value="">Select position</option>
                                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </Field>

                        <Field label="Grade" labelLao="ລະດັບ" required>
                            <select
                                className={selectClass}
                                value={formData.grade}
                                onChange={e => handleChange('grade', e.target.value)}
                            >
                                <option value="">Select grade</option>
                                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </Field>

                        <Field label="Employment Type" labelLao="ປະເພດການຈ້າງ" required>
                            <select
                                className={selectClass}
                                value={formData.employmentType}
                                onChange={e => handleChange('employmentType', e.target.value)}
                            >
                                {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </Field>

                        <Field label="Hire Date" labelLao="ວັນທີເລີ່ມງານ" required>
                            <input
                                type="date"
                                className={inputClass}
                                value={formData.hireDate}
                                onChange={e => handleChange('hireDate', e.target.value)}
                            />
                        </Field>

                        <Field label="Contract End Date" labelLao="ວັນສິ້ນສຸດສັນຍາ">
                            <input
                                type="date"
                                className={inputClass}
                                value={formData.contractEnd}
                                onChange={e => handleChange('contractEnd', e.target.value)}
                            />
                        </Field>

                        <Field label="Status" labelLao="ສະຖານະ" required>
                            <select
                                className={selectClass}
                                value={formData.status}
                                onChange={e => handleChange('status', e.target.value)}
                            >
                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </Field>

                        <Field label="Supervisor" labelLao="ຫົວໜ້າ" className="md:col-span-2">
                            <input
                                type="text"
                                className={inputClass}
                                placeholder="Direct supervisor's name"
                                value={formData.supervisor}
                                onChange={e => handleChange('supervisor', e.target.value)}
                            />
                        </Field>
                    </div>
                </Section>

                {/* ── Compensation & Banking ── */}
                <Section
                    title="Compensation & Banking"
                    titleLao="ເງິນເດືອນ ແລະ ທະນາຄານ"
                    description="Salary and payment information"
                    icon={CreditCard}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                        <Field label="Base Salary (LAK)" labelLao="ເງິນເດືອນພື້ນຖານ" required>
                            <input
                                type="number"
                                className={inputClass}
                                placeholder="5,000,000"
                                value={formData.baseSalary}
                                onChange={e => handleChange('baseSalary', e.target.value)}
                            />
                        </Field>

                        <Field label="Bank Name" labelLao="ຊື່ທະນາຄານ">
                            <select
                                className={selectClass}
                                value={formData.bankName}
                                onChange={e => handleChange('bankName', e.target.value)}
                            >
                                <option value="">Select bank</option>
                                <option value="BCEL">BCEL</option>
                                <option value="LDB">Lao Development Bank</option>
                                <option value="APB">Agricultural Promotion Bank</option>
                                <option value="JDB">Joint Development Bank</option>
                                <option value="ST Bank">ST Bank</option>
                                <option value="Other">Other</option>
                            </select>
                        </Field>

                        <Field label="Account Number" labelLao="ເລກບັນຊີ">
                            <input
                                type="text"
                                className={inputClass}
                                placeholder="0000-00-000-000000"
                                value={formData.bankAccount}
                                onChange={e => handleChange('bankAccount', e.target.value)}
                            />
                        </Field>
                    </div>
                </Section>

                {/* ── Education ── */}
                <Section
                    title="Education"
                    titleLao="ການສຶກສາ"
                    description="Highest qualification and institution"
                    icon={GraduationCap}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                        <Field label="Highest Education" labelLao="ລະດັບການສຶກສາ">
                            <select
                                className={selectClass}
                                value={formData.education}
                                onChange={e => handleChange('education', e.target.value)}
                            >
                                <option value="">Select level</option>
                                <option value="High School">High School</option>
                                <option value="Diploma">Diploma</option>
                                <option value="Bachelor">Bachelor's Degree</option>
                                <option value="Master">Master's Degree</option>
                                <option value="PhD">PhD</option>
                            </select>
                        </Field>

                        <Field label="Institution" labelLao="ສະຖາບັນ">
                            <input
                                type="text"
                                className={inputClass}
                                placeholder="National University of Laos"
                                value={formData.institution}
                                onChange={e => handleChange('institution', e.target.value)}
                            />
                        </Field>

                        <Field label="Graduation Year" labelLao="ປີຈົບ">
                            <input
                                type="number"
                                className={inputClass}
                                placeholder="2018"
                                min="1970"
                                max="2030"
                                value={formData.graduationYear}
                                onChange={e => handleChange('graduationYear', e.target.value)}
                            />
                        </Field>
                    </div>
                </Section>

                {/* ── Bottom action bar ── */}
                <div className="flex items-center justify-between gap-3 bg-card border border-border rounded-lg px-4 py-3">
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Fields marked with <span className="text-destructive font-semibold">*</span> are required
                    </p>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="sm" className="h-8 text-xs">
                            <X className="w-3.5 h-3.5" />
                            Cancel
                        </Button>
                        <Button type="button" variant="outline" size="sm" className="h-8 text-xs">
                            Save as Draft
                        </Button>
                        <Button type="submit" size="sm" className="h-8 text-xs">
                            <Save className="w-3.5 h-3.5" />
                            Save Employee
                        </Button>
                    </div>
                </div>

            </form>
        </AppShell>
    )
}