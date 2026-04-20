'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Globe, Shield, CheckCircle2, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
 

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [lang, setLang] = useState<'en' | 'lo'>('en')

  const t = {
    en: {
      system:    'Management Information System',
      systemLao: 'ລະບົບຈັດການຂໍ້ມູນຫລັງບ້ານ',
      tagline:   'EDCF Loan LAO-14 — Ministry of Health, Lao PDR',
      authOnly:  'For authorized personnel only',
      selectHosp:'Select Hospital',
      username:  'Username / ຊື່ຜູ້ໃຊ້',
      password:  'Password / ລະຫັດຜ່ານ',
      role:      'Preview Role (Demo)',
      remember:  'Remember me',
      signIn:    'Sign In / ເຂົ້າສູ່ລະບົບ',
      forgot:    'Forgot password?',
    },
  }[lang === 'lo' ? 'en' : 'en']

  return (
    <div className="flex h-screen">
      {/* Left hero */}
      <div
        className="hidden lg:flex flex-col items-center justify-center w-[60%] relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F766E 0%, #0e6b64 40%, #115e59 100%)' }}
      >
        {/* Decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-150 h-150 rounded-full border border-white/5 absolute" />
          <div className="w-100 h-100 rounded-full border border-white/8 absolute" />
          <div className="w-50 h-50 rounded-full border border-white/10 absolute" />
        </div>

        <div className="relative z-10 text-center px-12 max-w-xl">
          {/* Emblem placeholder */}
          <div className="w-24 h-24 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center mx-auto mb-6">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>

          <p className="text-white/60 text-xs font-medium tracking-widest uppercase mb-3">
            Ministry of Health · Lao PDR
          </p>

          <h1 className="text-3xl font-bold text-white leading-tight mb-1">
            {t.system}
          </h1>
          <h2 className="text-xl font-medium text-white/80 mb-4">
            {t.systemLao}
          </h2>

          <p className="text-sm text-white/60 mb-8">{t.tagline}</p>

          <div className="border-t border-white/20 pt-6">
            <p className="text-xs text-white/40 uppercase tracking-widest">{t.authOnly}</p>
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { value: '3', label: 'Hospitals' },
              { value: '1,200+', label: 'Staff Records' },
              { value: '7', label: 'Modules' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-lg p-3">
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-[11px] text-white/60">{s.label}</p>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* Right form */}
      <div className="flex flex-col flex-1 items-center justify-center p-6 bg-card">
        {/* Lang toggle */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setLang(l => l === 'en' ? 'lo' : 'en')}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary border border-border rounded-md px-3 py-1.5"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === 'en' ? 'ລາວ' : 'English'}
          </button>
        </div>

        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="bg-card p-8">
            <div className="mb-6 text-center">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mx-auto mb-3">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-base font-bold text-foreground">Admin Back-Office</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Sign in to your account</p>
            </div>

            <div className="space-y-4">
              {/* Username */}
              <div>
                <Label className="text-xs font-medium mb-1 block">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  className="h-9 text-xs"
                  placeholder="e.g. somsak.p"
                  defaultValue="admin"
                />
              </div>

              {/* Password */}
              <div>
                <Label className="text-xs font-medium mb-1 block">
                  Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    className="h-9 text-xs pr-9"
                    placeholder="••••••••"
                    defaultValue="demo1234"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <Link href="/admin/dashboard" className='cursor-pointer'>
                <Button className="w-full h-9 text-sm font-semibold mt-1 cursor-pointer">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Compliance badges */}
            <div className="flex items-center justify-center gap-3 mt-6 pt-5 border-t border-border">
              {['ISO 27001', 'Audit-ready', 'Multi-hospital'].map(badge => (
                <div key={badge} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-muted-foreground mt-4">
            v1.0 · © 2026 CWIT
          </p>
        </div>
      </div>
    </div>
  )
}
