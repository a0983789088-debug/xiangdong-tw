import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityClient } from '@/lib/sanity/client'
import { ALL_PRODUCTS_QUERY } from '@/lib/sanity/queries'
import { ProductCard, type ProductCardData } from '@/components/ProductCard'
import { Breadcrumb } from '@/components/Breadcrumb'

export const revalidate = 300

export const metadata: Metadata = {
  title: '商品櫥窗｜沉香 · 線香 · 佛珠 · 原料',
  description:
    '香董精選商品櫥窗：沉香、線香、佛珠、製香原料。每一件附產地、香韻、適合誰的說明。點商品跳轉就醬播商城選購、直播洽詢。',
  alternates: { canonical: '/shop' },
}

export default async function ShopPage() {
  const products = await sanityClient
    .fetch<ProductCardData[]>(ALL_PRODUCTS_QUERY)
    .catch(() => [])

  return (
    <>
      <div className="container-x pt-6 pb-2">
        <Breadcrumb items={[{ label: '首頁', href: '/' }, { label: '商品櫥窗' }]} />
      </div>

      <header className="container-x pt-4 pb-6">
        <p className="text-xs tracking-[3px] text-gold uppercase mb-2">
          Shop · 商品櫥窗
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-navy mb-4">
          香董精選商品
        </h1>
        <p className="text-base text-woodLight max-w-2xl leading-relaxed">
          這裡是櫥窗、不是結帳頁。每一件商品點下去，會跳到香董在
          <strong className="text-navy">「就醬播」</strong>的商品頁完成購買或洽詢。
          收藏級單一件多半在 FB 直播競標釋出。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="https://jambolive.tv/shop/62349/product/fb/"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 bg-gold text-navy px-4 py-2 rounded-md text-sm font-medium hover:opacity-90"
          >
            直接到就醬播商城 →
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
