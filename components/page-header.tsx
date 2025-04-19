import React from 'react'
import { Button } from '@/components/ui/button'
import { LucideIcon, ChevronLeft } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
    icon?: LucideIcon
  }
  backButton?: {
    href: string
    label?: string
  }
}

export function PageHeader({
  title,
  description,
  action,
  backButton,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        {backButton && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="-ml-2 text-muted-foreground"
          >
            <a href={backButton.href}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              {backButton.label || 'Back'}
            </a>
          </Button>
        )}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <div className="mt-4 md:mt-0">
          {action.href ? (
            <Button asChild>
              <a href={action.href}>
                {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                {action.label}
              </a>
            </Button>
          ) : (
            <Button onClick={action.onClick}>
              {action.icon && <action.icon className="mr-2 h-4 w-4" />}
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
