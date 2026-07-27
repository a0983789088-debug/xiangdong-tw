import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard'
import { Breadcrumb } from '@/components/Breadcrumb'
import { TrackedShopLink } from '@/components/TrackedShopLink'
import { MY_SHOP_PRODUCTS } from '@/lib/myShopProducts'

export const revalidate = 300

type ShopProduct = (typeof MY_SHOP_PRODUCTS)[number]

const SHOP_URL = 'https://baujie-agarwood.my1shop.com/'

const SHOP_PROMISES = [
  {
    title: '現貨先看價格',
    text: '把商城現貨、價格級距與品項先攤開，想買粉料、臥香、盤香或手串都能直接比較。',
  },
  {
    title: '香材用途清楚',
    text: '商品依線香、原料、佛珠與日常香品整理，新手不用先背一堆產地名也能開始挑。',
  },
  {
    title: '可買也可先問',
    text: '看中商品可直接到一頁購物下單；想確認用途、香韻或收藏件，再加 LINE 問香董。',
  },
]

const SHOP_STEPS = [
  {
    title: '先選使用情境',
    text: '日常薰香看臥香與盤香，製香或調香看粉料，收藏佩戴看手串與限量件。',
  },
  {
    title: '再看價格級距',
    text: '從入門試用到收藏級品項分開陳列，先抓預算，再決定要直接買或先詢問。',
  },
  {
    title: '最後到商城完成',
    text: '商品卡會帶到對應的一頁購物頁；收藏級或直播釋出的單一件，可到社團追現場。',
  },
]

const PRODUCT_GROUPS = [
  { label: '線香 / 盤香', type: 'incense-stick' },
  { label: '香材原料', type: 'raw-material' },
  { label: '佛珠手串', type: 'beads' },
  { label: '日常香品', type: 'other' },
]

const BEGINNER_GUIDES = [
  {
    kicker: '日常點香',
    title: '想每天點一支，先從臥香或盤香開始',
    text: '適合放在書房、客廳、睡前放鬆或固定薰香。氣味穩定、使用簡單，不需要準備太多器具。',
    budget: 'NT$88 - 999',
    tags: ['日常薰香', '新手友善', '空間使用'],
    productSlugs: [
      'indonesia-jiangzhen-coil',
      'gubang-incense',
      'tonga-incense',
      'africa-sandalwood-coil',
    ],
  },
  {
    kicker: '製香 / 調香',
    title: '想自己配香、做香，先看粉料',
    text: '粉料適合製香、調配、試香氣基底，也適合已經知道自己喜歡沉香或檀香方向的人。',
    budget: 'NT$50 - 1,200',
    tags: ['製香原料', '可試比例', '價格透明'],
    productSlugs: [
      'mk',
      'laoshan-powder',
      'irian-extract-powder',
      'africa-sandalwood-powder',
    ],
  },
  {
    kicker: '收藏 / 送禮',
    title: '想買有存在感的品項，看手串與高階香材',
    text: '適合送禮、佩戴收藏，或想挑一件比較有記憶點的香品。高價與限量品項建議先詢問再下單。',
    budget: 'NT$660 - 5,100',
    tags: ['收藏級', '送禮', '可先諮詢'],
    productSlugs: [
      'hku',
      'kundian-powder',
      'green-kinam-incense',
      'agarwood-spray-lotion',
    ],
  },
]

export const metadata: Metadata = {
  title: '香董天然香品商城｜沉香線香與香材現貨',
  description:
    '香董精選沉香粉、檀香粉、天然線香、盤香、佛珠手串與日常香品。直接看商城現貨與價格，前往一頁購物選購或洽詢。',
  alternates: { canonical: '/shop' },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '香董',
    title: '香董天然香品商城｜沉香線香與香材現貨',
    description:
      '香董精選沉香粉、檀香粉、天然線香、盤香、佛珠手串與日常香品。直接看商城現貨與價格，前往一頁購物選購或洽詢。',
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
  const heroProduct = products.find((product) => product.slug === 'hku') || products[0]
  const heroSideProducts = products
    .filter((product) => product._id !== heroProduct?._id)
    .slice(0, 4)
  const featuredProducts = products
    .filter((product) => product.isCollectible || product.productType === 'incense-stick')
    .slice(0, 4)
  const beginnerGuides = BEGINNER_GUIDES.map((guide) => ({
    ...guide,
    products: findProductsBySlugs(products, guide.productSlugs),
  }))

  return (
    <>
      <header className="bg-cream border-b border-gold/15">
        <div className="container-x pt-6 pb-12 md:pb-16">
          <Breadcrumb items={[{ label: '首頁', href: '/' }, { label: '香董商城' }]} />

          <div className="grid gap-8 pt-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <p className="text-xs tracking-[3px] text-goldDark uppercase mb-3">
                Shop · 官方一頁購物
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-navy leading-tight mb-5">
                香董天然香品商城
              </h1>
              <p className="text-lg text-wood leading-relaxed max-w-2xl">
                從沉香粉、檀香粉、天然線香到收藏手串，把現貨、價格與用途整理在同一頁。
                你可以直接下單，也可以先加 LINE 問香材、香韻與適合的使用情境。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#products"
                  className="inline-flex items-center gap-1.5 bg-navy text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-navyDark"
                >
                  看商城現貨 →
                </a>
                <TrackedShopLink
                  href={SHOP_URL}
                  target="_blank"
                  rel="noopener"
                  trackingName="香董一頁購物商城"
                  trackingType="shop_home"
                  className="inline-flex items-center gap-1.5 bg-gold text-navy px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90"
                >
                  前往一頁購物 →
                </TrackedShopLink>
                <Link
                  href="/line"
                  className="inline-flex items-center gap-1.5 bg-lineGreen text-white px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90"
                >
                  加 LINE 詢問 →
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
                <ShopStat value={`${products.length}`} label="件商城現貨" />
                <ShopStat value="4" label="大類香品" />
                <ShopStat value="LINE" label="可先諮詢" />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3 md:gap-4">
              {heroProduct && (
                <HeroProductImage
                  product={heroProduct}
                  className="col-span-3 row-span-2 aspect-[4/5]"
                  priority
                />
              )}
              {heroSideProducts.map((product) => (
                <HeroProductImage
                  key={product._id}
                  product={product}
                  className="col-span-2 aspect-square"
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="container-x py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {SHOP_PROMISES.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-gold/20 bg-white p-5 md:p-6"
            >
              <h2 className="font-serif text-xl text-navy mb-3">{item.title}</h2>
              <p className="text-sm text-woodLight leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy text-cream">
        <div className="container-x py-12 md:py-14">
          <div className="grid gap-8 md:grid-cols-12 md:items-start">
            <div className="md:col-span-4">
              <p className="text-xs tracking-[3px] text-gold uppercase mb-3">
                Buying Flow
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-cream leading-snug">
                買香不用先猜，先照用途選
              </h2>
            </div>
            <div className="md:col-span-8 grid gap-4">
              {SHOP_STEPS.map((step, index) => (
                <div
                  key={step.title}
                  className="grid gap-3 border-t border-cream/15 pt-4 sm:grid-cols-[3rem_1fr]"
                >
                  <p className="text-gold text-sm tracking-[3px]">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <div>
                    <h3 className="font-sans text-base text-cream font-medium mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-cream/75 leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream border-b border-gold/15">
        <div className="container-x py-12 md:py-16">
          <div className="grid gap-4 md:grid-cols-12 md:items-end mb-7">
            <div className="md:col-span-7">
              <p className="text-xs tracking-[3px] text-goldDark uppercase mb-2">
                Starter Guide
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-navy">
                第一次買香，先從這 3 種需求選
              </h2>
              <p className="text-sm text-woodLight mt-2 leading-relaxed">
                不用一次看懂所有產地和香材，先從使用情境切入，選到方向後再比較價格與規格。
              </p>
            </div>
            <div className="md:col-span-5">
              <p className="text-sm text-wood leading-relaxed md:text-right">
                看完還不確定，先把用途和預算傳給香董，讓他直接幫你縮小選項。
              </p>
            </div>
          </div>

          <div className="divide-y divide-gold/20">
            {beginnerGuides.map((guide) => (
              <div
                key={guide.title}
                className="grid gap-5 py-7 first:pt-0 last:pb-0 lg:grid-cols-[0.9fr_1.35fr] lg:items-start"
              >
                <div>
                  <p className="text-xs tracking-[3px] text-goldDark uppercase mb-2">
                    {guide.kicker}
                  </p>
                  <h3 className="font-serif text-xl md:text-2xl text-navy mb-3">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-woodLight leading-relaxed">
                    {guide.text}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs text-navy border border-gold/20">
                      預算 {guide.budget}
                    </span>
                    {guide.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex rounded-full px-3 py-1 text-xs text-woodLight border border-gold/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {guide.products.map((product) => (
                    <GuideProductLink key={product._id} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="container-x py-12 md:py-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-7">
            <div>
              <p className="text-xs tracking-[3px] text-goldDark uppercase mb-2">
                Featured
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-navy">
                先看本週主打
              </h2>
              <p className="text-sm text-woodLight mt-2">
                從收藏手串、沉香粉到臥香，挑幾個最容易被問到的品項先放前面。
              </p>
            </div>
            <TrackedShopLink
              href={SHOP_URL}
              target="_blank"
              rel="noopener"
              trackingName="香董一頁購物商城"
              trackingType="shop_home"
              className="text-sm text-navy hover:text-goldDark border-b border-gold pb-0.5 self-start md:self-auto"
            >
              開啟完整商城 →
            </TrackedShopLink>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section id="products" className="container-x pb-12 md:pb-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-7">
          <div>
            <p className="text-xs tracking-[3px] text-goldDark uppercase mb-2">
              In Stock
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-navy">
              商城現貨品項
            </h2>
            <p className="text-sm text-woodLight mt-2">
              商品點下去會開啟對應的一頁購物商品頁，價格與規格以商城頁面為準。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRODUCT_GROUPS.map((group) => (
              <span
                key={group.type}
                className="inline-flex items-center rounded-full border border-gold/25 px-3 py-1 text-xs text-woodLight"
              >
                {group.label} · {products.filter((product) => product.productType === group.type).length}
              </span>
            ))}
          </div>
        </div>

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

      <section className="container-x pb-20">
        <div className="rounded-lg bg-cream border border-gold/20 p-6 md:p-8">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs tracking-[3px] text-goldDark uppercase mb-2">
                Need Help
              </p>
              <h2 className="font-serif text-2xl text-navy mb-2">
                不確定先買哪一款，直接問香董
              </h2>
              <p className="text-sm text-woodLight leading-relaxed">
                把用途、預算、喜歡的香氣或想送禮的對象傳來，香董會幫你縮小選擇。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/line"
                className="inline-flex items-center gap-1.5 bg-lineGreen text-white px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90"
              >
                加 LINE 問香 →
              </Link>
              <a
                href="https://www.facebook.com/groups/1789214647984397"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 bg-fbBlue text-white px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90"
              >
                看 FB 直播社團 →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function findProductsBySlugs(products: ShopProduct[], slugs: string[]) {
  return slugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is ShopProduct => Boolean(product))
}

function ShopStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-gold/40 pl-3">
      <p className="text-xl md:text-2xl text-navy font-medium leading-tight">{value}</p>
      <p className="text-xs text-woodLight mt-1">{label}</p>
    </div>
  )
}

function GuideProductLink({ product }: { product: ShopProduct }) {
  if (!product.mainImageUrl) return null

  return (
    <TrackedShopLink
      href={product.externalUrl}
      target="_blank"
      rel="noopener"
      trackingName={product.name}
      trackingCategory={product.productType}
      trackingPrice={product.priceLabel}
      isCollectible={product.isCollectible}
      className="group block overflow-hidden rounded-lg border border-gold/20 bg-white hover:border-gold/50"
    >
      <div className="relative aspect-square bg-cream">
        <Image
          src={product.mainImageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 160px, 45vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-3">
        <p className="text-[13px] text-navy font-medium leading-snug line-clamp-2">
          {product.name}
        </p>
        <p className="mt-1 text-xs text-goldDark">{product.priceLabel}</p>
      </div>
    </TrackedShopLink>
  )
}

function HeroProductImage({
  product,
  className,
  priority = false,
}: {
  product: (typeof MY_SHOP_PRODUCTS)[number]
  className: string
  priority?: boolean
}) {
  if (!product.mainImageUrl) return null

  return (
    <TrackedShopLink
      href={product.externalUrl}
      target="_blank"
      rel="noopener"
      trackingName={product.name}
      trackingCategory={product.productType}
      trackingPrice={product.priceLabel}
      isCollectible={product.isCollectible}
      className={`group relative block overflow-hidden rounded-lg bg-white shadow-sm ${className}`}
    >
      <Image
        src={product.mainImageUrl}
        alt={product.name}
        fill
        sizes="(min-width: 1024px) 320px, 45vw"
        priority={priority}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <span className="absolute left-2.5 top-2.5 rounded bg-white/90 px-2 py-0.5 text-[10.5px] text-navy">
        {product.priceLabel}
      </span>
    </TrackedShopLink>
  )
}
