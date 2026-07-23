import Link from 'next/link'

const NAV = [
  { href: '/blog', label: '香董文章' },
  { href: '/shop', label: '香董商城' },
  { href: '/about', label: '關於香董' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur border-b border-gold/20">
      <div className="container-x flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-serif font-medium text-navy tracking-wider">
            香董
          </span>
          <span className="hidden sm:inline text-[11px] text-woodLight tracking-[3px] uppercase">
            Xiangdong
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-wood hover:text-navy transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/line"
          className="hidden sm:inline-flex items-center gap-1.5 bg-lineGreen text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          <span>加 LINE 領手冊</span>
        </Link>

        {/* Mobile menu trigger (簡化：之後加 drawer) */}
        <Link
          href="/line"
          className="inline-flex sm:hidden items-center gap-1.5 bg-lineGreen text-white px-3 py-1.5 rounded-lg text-xs font-medium"
        >
          加 LINE
        </Link>
      </div>
    </header>
  )
}
