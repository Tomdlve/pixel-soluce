import { urlFor } from '~/client'
import { usePage } from '@inertiajs/react'
import { type LucideIcon } from 'lucide-react'
import { type ReactNode, type CSSProperties } from 'react'
import { Link } from '@adonisjs/inertia/react'

export type NavRoute = Parameters<typeof urlFor>[0]

export type NavItem = {
  label: string
  route: NavRoute
  icon?: LucideIcon
}

export default function NavLink({
  route,
  exact = false,
  className,
  style,
  children,
}: {
  route: NavRoute
  exact?: boolean
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const { url } = usePage()
  const href = urlFor(route)
  const path = url.split('?')[0]
  const isActive = exact ? path === href : path === href || path.startsWith(`${href}/`)

  return (
    <Link href={href} className={className} style={style} aria-current={isActive ? 'page' : undefined}>
      {children}
    </Link>
  )
}