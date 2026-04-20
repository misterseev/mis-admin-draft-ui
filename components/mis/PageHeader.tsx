'use client'

import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ActionItem {
  label: string
  onClick?: () => void
  icon?: React.ReactNode
  href?: string
}

interface PageHeaderProps {
  title: string
  titleLao?: string
  description?: string
  primaryAction?: ActionItem
  secondaryActions?: ActionItem[]
  overflowActions?: ActionItem[]
  className?: string
  children?: React.ReactNode
}

export function PageHeader({
  title,
  titleLao,
  description,
  primaryAction,
  secondaryActions = [],
  overflowActions = [],
  className,
  children,
}: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-4', className)}>
      <div>
        <div className="flex items-baseline gap-2">
          <h1 className="text-lg font-semibold text-foreground leading-tight">{title}</h1>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {children}
        {secondaryActions.map((action, i) => (
          <Button key={i} variant="outline" size="sm" onClick={action.onClick}>
            {action.icon}
            {action.label}
          </Button>
        ))}
        {overflowActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="px-2">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {overflowActions.map((action, i) => (
                <DropdownMenuItem key={i} onClick={action.onClick}>
                  {action.icon}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {primaryAction && (
          <Button className='cursor-pointer'>
            <Link href={`${primaryAction.href}`} className='flex justify-center items-center gap-2'>
              {primaryAction.icon}
              {primaryAction.label}
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
