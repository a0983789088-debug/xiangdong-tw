import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard'
import { Breadcrumb } from '@/components/Breadcrumb'
import { MY_SHOP_PRODUCTS } from '@/lib/myShopProducts'

export const revalidate = 300

export const metadata: Metadata = {
  title: '香董天然香品商城',
  description:
    '香董精選天然沉香、天然線香、沉香佛珠、香材原料與日常香品。點商品可直接前往香董商城選購或洽詢。',
  alternates: { canonical: '/shop' },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '香董',
    title: '香董天然香品商城｜香董',
    description:
      '香董精選天然沉香、天然線香、沉香佛珠、香材原料與日常香品。點商品可直接前往香董商城選購或洽詢。',
    url: 'https://xiangdong.tw/shop',
    images: [
      {
        url: 'https://cdn.sanity.io/images/3zcpri8u/production/0c1e0af9fc086aa30ced2d021f00a80936570387-954x955.jpg?rect=0,228,954,501&w=1200&h=630&fit=crop&auto=format',
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function ShopPage() {
  const products = MY_SHOP_PRODUCTS

  return (
    <>
      <div className="container-x pt-6 pb-2">
        <Breadcrumb items={[{ label: '首頁', href: '/' }, { label: '香董商城' }]} />
      </div>

      <header className="container-x pt-4 pb-6">
        <p className="text-xs tracking-[3px] text-goldDark uppercase mb-2">
          Shop · 香董商城
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-navy mb-4">
          香董天然香品商城
        </h1>
        <p className="text-base text-woodLight max-w-2xl leading-relaxed">
          這裡整理香董商城現貨與精選香品，包含沉香、天然線香、沉香佛珠、製香原料與日常香品。
          每一件商品點下去，會直接前往香董商城完成購買或洽詢。
          收藏級單一件多半在 FB 直播競標釋出。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="https://baujie-agarwood.my1shop.com/"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 bg-gold text-navy px-4 py-2 rounded-md text-sm font-medium hover:opacity-90"
          >
            直接到香董商城 →
          </a>
          <a
            href="https://www.facebook.com/groups/1789214647984397"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 bg-fbBlue text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90"
          >
            加入 FB 直播競標社團 →
          </a>
        </div>
      </header>

      <section className="container-x pb-20">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-cream border border-dashed border-gold/40 rounded-lg py-16 text-center">
            <p className="text-navy text-lg mb-2">商品準備中</p>
            <p className="text-sm text-woodLight mb-6">
              香董正在挑選本週要上的好香、好料
            </p>
            <Link
              href="/line"
              className="inline-flex items-center gap-2 bg-lineGreen text-white px-5 py-2.5 rounded-md text-sm font-medium"
            >
              先加 LINE，新品上架 + 直播提醒 →
            </Link>
          </div>
        )}
      </section>
    </>
  )
}
