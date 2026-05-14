import Link from 'next/link'

export type BreadcrumbItem = {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-woodLight">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-navy underline-offset-2 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className={last ? 'text-navy/90 line-clamp-1' : ''} aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!last && <span className="text-gold/50">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
