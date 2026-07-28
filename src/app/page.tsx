import Link from 'next/link'
import Image from 'next/image'
import { sanityClient } from '@/lib/sanity/client'
import { urlForImage } from '@/lib/sanity/image'
import {
  HOME_ARTICLES_QUERY,
  HOME_PRODUCTS_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/lib/sanity/queries'
import { ArticleCard, type ArticleCardData } from '@/components/ArticleCard'
import { ProductCard, type ProductCardData } from '@/components/ProductCard'
import { CtaBlock } from '@/components/CtaBlock'
import { TopicHub } from '@/components/TopicHub'
import { FaqSection } from '@/components/FaqSection'
import { JsonLd, buildFaqJsonLd } from '@/components/JsonLd'
import { TrackedShopLink } from '@/components/TrackedShopLink'
import { estimateReadingMinutes } from '@/lib/readingTime'
import { MY_SHOP_PRODUCTS } from '@/lib/myShopProducts'

export const revalidate = 300

const SHOP_URL = 'https://baujie-agarwood.my1shop.com/'

const HOME_HERO_PRODUCT_SLUGS = [
  'hku',
  'kundian-powder',
  'gubang-incense',
  'indonesia-jiangzhen-coil',
]

const HOME_ENTRY_ROUTES = [
  {
    title: '第一次買香',
    text: '先用日常點香、製香調香、送禮收藏三種需求縮小選擇。',
    href: '/shop#starter-guide',
    action: '看新手怎麼選',
  },
  {
    title: '想直接看現貨',
    text: '看一頁購物同步整理的商品、價格與規格，喜歡就能直接下單。',
    href: '/shop#products',
    action: '看商城現貨',
  },
  {
    title: '不確定先問',
    text: '把用途、預算、想送誰傳給香董，先問清楚再買。',
    href: '/line',
    action: '加 LINE 詢問',
  },
]

type OriginMapCountry = 'indonesia' | 'vietnam'

type OriginMapRegion = {
  name: string
  area: string
  note: string
  x: number
  y: number
  labelSide?: 'left' | 'right'
}

type OriginMapData = {
  country: OriginMapCountry
  kicker: string
  title: string
  intro: string
  regions: OriginMapRegion[]
}

const AGARWOOD_ORIGIN_MAPS: OriginMapData[] = [
  {
    country: 'indonesia',
    kicker: 'Indonesia Map',
    title: '印尼沉香產區',
    intro: '印尼產區常以島嶼或舊地名出現在市場，例如坤甸、伊利安、馬魯古。先看位置，再回頭看香韻與規格。',
    regions: [
      {
        name: '蘇門答臘',
        area: 'Aceh / Riau / Jambi / Bangka',
        note: '西印尼常見產區帶，市場名稱多，入門先看油線、氣味乾淨度與價格級距。',
        x: 19,
        y: 49,
      },
      {
        name: '坤甸 / 加里曼丹',
        area: 'West Kalimantan',
        note: '香材、粉料常見名稱，適合拿來理解產地名、油脂感與價格差。',
        x: 41,
        y: 47,
      },
      {
        name: '蘇拉威西',
        area: 'Sulawesi',
        note: '島嶼型產區，市場量與批次感差異大，買時更要回到實際香韻。',
        x: 56,
        y: 51,
      },
      {
        name: '馬魯古',
        area: 'Maluku',
        note: '東印尼島群，常和深色、油脂感、野生料印象一起被討論。',
        x: 69,
        y: 55,
      },
      {
        name: '伊利安 / 巴布亞',
        area: 'Papua / Irian Jaya',
        note: '許多商品會稱伊利安，常出現在粉料、土沉、抽油粉脈絡。',
        x: 84,
        y: 57,
        labelSide: 'left',
      },
    ],
  },
  {
    country: 'vietnam',
    kicker: 'Vietnam Map',
    title: '越南沉香產區',
    intro: '越南產區多集中在中部到中南部山地與沿海，惠安、芽莊、慶和等名稱常被拿來判斷等級與風格。',
    regions: [
      {
        name: '長山山脈帶',
        area: 'Nghe An to Phu Quoc',
        note: '越南沉香樹自然分布可從義安往南看，理解大範圍分布後再看重點產區。',
        x: 43,
        y: 33,
      },
      {
        name: '惠安 / 廣南',
        area: 'Quang Nam',
        note: '越南中部經典產區名，新手常把它當成理解越南沉香的起點。',
        x: 48,
        y: 49,
      },
      {
        name: '平定 / 歸仁',
        area: 'Binh Dinh / Quy Nhon',
        note: '位在中部沿海，常與廣南、富安、慶和一起被列入高品質沉香研究範圍。',
        x: 55,
        y: 60,
      },
      {
        name: '富安',
        area: 'Phu Yen',
        note: '中南部產區，放在平定與慶和之間看，產區脈絡更清楚。',
        x: 59,
        y: 68,
      },
      {
        name: '慶和 / 芽莊',
        area: 'Khanh Hoa / Nha Trang',
        note: '越南最具代表性的產區之一，奇楠與高品質沉香常拿這裡當對照。',
        x: 64,
        y: 76,
        labelSide: 'left',
      },
    ],
  },
]

export default async function HomePage() {
  const [articles, products, settings] = await Promise.all([
    sanityClient.fetch<ArticleCardData[]>(HOME_ARTICLES_QUERY).catch(() => []),
    sanityClient.fetch<ProductCardData[]>(HOME_PRODUCTS_QUERY).catch(() => []),
    sanityClient.fetch<any>(SITE_SETTINGS_QUERY).catch(() => null),
  ])

  const faq = settings?.homepageFaq || []
  const founderPhoto = settings?.founderPhoto
  const founderPhotoUrl = founderPhoto ? urlForImage(founderPhoto)?.width(600).height(750).fit('crop').url() : null
  const heroProducts = HOME_HERO_PRODUCT_SLUGS
    .map((slug) => MY_SHOP_PRODUCTS.find((product) => product.slug === slug))
    .filter((product): product is (typeof MY_SHOP_PRODUCTS)[number] => Boolean(product))
  const articlesWithReading = articles.map((article) => ({
    ...article,
    readingMinutes: estimateReadingMinutes((article as any).body),
  }))
  const featuredArticle = articlesWithReading[0]
  const secondaryArticles = articlesWithReading.slice(1, 6)

  return (
    <>
      {/* === 首頁 FAQ Rich Snippet JSON-LD === */}
      {faq.length > 0 && <JsonLd data={buildFaqJsonLd(faq)} />}

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-navy text-cream">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,#081B33_0%,#0B2545_54%,#3D2E1F_100%)]" />
        <div className="container-x relative py-14 md:py-16 lg:py-20">
          <div className="grid gap-9 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <p className="text-xs tracking-[3px] text-gold uppercase mb-4">
                天然沉香 · 線香 · 香材原料
              </p>
              <h1 className="font-serif text-3xl md:text-5xl text-cream leading-tight tracking-wide mb-5">
                天然沉香、線香與香材，<br />
                新手也買得懂。
              </h1>
              <p className="max-w-xl text-base md:text-lg text-cream/86 leading-relaxed mb-7">
                香董把產地、用途、價格差異講清楚。想每天點香、自己製香、送禮收藏，
                都先有路線，再去看現貨。
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <Link
                  href="/shop#starter-guide"
                  className="inline-flex items-center justify-center gap-2 bg-gold text-navy px-5 py-3 rounded-md font-medium hover:opacity-90 transition"
                >
                  第一次買香怎麼選 →
                </Link>
                <Link
                  href="/shop#products"
                  className="inline-flex items-center justify-center gap-2 border border-cream/55 text-cream px-5 py-3 rounded-md font-medium hover:bg-cream hover:text-navy transition"
                >
                  直接看商城現貨 →
                </Link>
                <Link
                  href="/line"
                  className="inline-flex items-center justify-center gap-2 bg-lineGreen text-white px-5 py-3 rounded-md font-medium hover:opacity-90 transition"
                >
                  加 LINE 先問
                </Link>
              </div>
              <p className="text-xs text-cream/72 leading-relaxed">
                不靠神話、不靠話術，先讓你知道這款香適合誰、怎麼用、值不值得。
              </p>
            </div>

            <div className="grid grid-cols-5 gap-3 md:gap-4">
              {heroProducts[0] && (
                <HomeHeroProductTile
                  product={heroProducts[0]}
                  className="col-span-3 row-span-2 aspect-[4/5]"
                  priority
                />
              )}
              {heroProducts.slice(1).map((product) => (
                <HomeHeroProductTile
                  key={product._id}
                  product={product}
                  className="col-span-2 aspect-square"
                />
              ))}
              <TrackedShopLink
                href={SHOP_URL}
                target="_blank"
                rel="noopener"
                trackingName="首頁一頁購物商城"
                trackingType="shop_home"
                className="col-span-2 flex min-h-24 flex-col justify-between rounded-lg border border-gold/30 bg-cream px-4 py-3 text-navy hover:bg-white"
              >
                <span className="text-xs tracking-[2px] text-goldDark uppercase">
                  Shop
                </span>
                <span className="text-sm font-medium leading-snug">
                  前往一頁購物商城 →
                </span>
              </TrackedShopLink>
            </div>
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {HOME_ENTRY_ROUTES.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="group block rounded-lg border border-cream/18 bg-cream/8 p-4 transition-colors hover:bg-cream hover:text-navy"
              >
                <h2 className="font-sans text-base text-cream group-hover:text-navy font-medium mb-2">
                  {route.title}
                </h2>
                <p className="text-sm text-cream/72 group-hover:text-woodLight leading-relaxed mb-3">
                  {route.text}
                </p>
                <p className="text-xs text-gold group-hover:text-goldDark">
                  {route.action} →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 新手停留導覽 ===== */}
      <section className="bg-white border-b border-gold/15">
        <div className="container-x py-9 md:py-11">
          <div className="grid gap-5 md:grid-cols-12 md:items-center">
            <div className="md:col-span-4">
              <p className="text-xs tracking-[3px] text-goldDark uppercase mb-2">
                第一次來香董
              </p>
              <h2 className="font-serif text-2xl text-navy leading-snug">
                先把三個最容易踩雷的問題搞懂
              </h2>
            </div>
            <div className="md:col-span-8 grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: '沉香價格怎麼看才合理？',
                  href: '/blog/why-agarwood-prices-vary-so-much',
                },
                {
                  label: '沉香會沉水就比較貴嗎？',
                  href: '/blog/agarwood-sinking-water-value',
                },
                {
                  label: '線香推薦先看什麼？',
                  href: '/blog/agarwood-incense-binder-ratio-explained',
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex min-h-24 flex-col justify-between rounded-lg border border-gold/20 bg-cream px-4 py-4 transition-colors hover:border-gold/60 hover:bg-white"
                >
                  <span className="text-sm font-medium leading-snug text-navy">
                    {item.label}
                  </span>
                  <span className="mt-3 text-xs text-goldDark group-hover:text-navy">
                    讀香董實戰說法 →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 選香路線 ===== */}
      <section className="bg-cream border-b border-gold/15">
        <div className="container-x py-14 md:py-16">
          <div className="grid gap-8 md:grid-cols-12 md:items-start">
            <div className="md:col-span-4">
              <p className="text-xs tracking-[3px] text-goldDark uppercase mb-3">
                Choose Your Route
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-navy leading-snug mb-4">
                不同的人，第一支香不該買一樣的
              </h2>
              <p className="text-sm text-woodLight leading-relaxed">
                香不是越貴越適合。先看你要的是日常使用、送禮，還是收藏玩料，才不會買到規格很好但用不到的東西。
              </p>
            </div>
            <div className="md:col-span-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: '日常點香',
                  body: '先挑燃燒乾淨、香韻穩、價格能長期使用的線香。',
                  action: '看線香挑選',
                  href: '/blog/agarwood-incense-binder-ratio-explained',
                },
                {
                  title: '新手入門',
                  body: '先建立真假、產地、沉水與價格的基本判斷。',
                  action: '看新手指南',
                  href: '/blog/how-to-pick-agarwood-beginner-guide',
                },
                {
                  title: '收藏玩料',
                  body: '重點看油線、結香、產區特徵與現場香韻表現。',
                  action: '加入直播社團',
                  href: 'https://www.facebook.com/groups/1789214647984397',
                },
              ].map((route, index) => {
                const isExternal = route.href.startsWith('https://')
                const className =
                  'group flex min-h-[13rem] flex-col justify-between rounded-lg border border-gold/20 bg-white p-5 transition-colors hover:border-gold/60'
                const content = (
                  <>
                    <div>
                      <p className="text-xs text-goldDark mb-4">
                        0{index + 1}
                      </p>
                      <h3 className="text-xl text-navy mb-3">
                        {route.title}
                      </h3>
                      <p className="text-sm text-woodLight leading-relaxed">
                        {route.body}
                      </p>
                    </div>
                    <span className="mt-6 text-sm text-goldDark group-hover:text-navy">
                      {route.action} →
                    </span>
                  </>
                )

                return isExternal ? (
                  <a
                    key={route.href}
                    href={route.href}
                    target="_blank"
                    rel="noopener"
                    className={className}
                  >
                    {content}
                  </a>
                ) : (
                  <Link key={route.href} href={route.href} className={className}>
                    {content}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 沉香產區地圖 ===== */}
      <section id="origin-map" className="bg-white border-b border-gold/15">
        <div className="container-x py-14 md:py-16">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="text-xs tracking-[3px] text-goldDark uppercase mb-3">
                Origin Map · 產區導覽
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-navy leading-snug mb-4">
                把產地名放回地圖上，才知道自己在看什麼
              </h2>
              <p className="text-sm text-woodLight leading-relaxed max-w-2xl">
                很多人第一次聽到坤甸、伊利安、芽莊、惠安，只知道名字很厲害，
                卻不知道它們分別在哪裡。這裡先用印尼、越南兩張地圖，把常見沉香產區整理出來。
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="border-l border-gold/35 pl-3">
                  <p className="text-2xl text-navy leading-tight">2</p>
                  <p className="text-xs text-woodLight mt-1">張產區地圖</p>
                </div>
                <div className="border-l border-gold/35 pl-3">
                  <p className="text-2xl text-navy leading-tight">10</p>
                  <p className="text-xs text-woodLight mt-1">個常見產區點位</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {AGARWOOD_ORIGIN_MAPS.map((map) => (
              <OriginMapCard key={map.country} map={map} />
            ))}
          </div>

          <p className="mt-5 rounded-lg border border-gold/20 bg-cream px-4 py-3 text-xs leading-relaxed text-woodLight">
            小提醒：地圖是產區導覽示意，不是品質保證。真正要判斷一件香材，還是要回到香韻、油線、結香狀態、燃燒表現與價格是否合理。
          </p>
        </div>
      </section>

      {/* ===== 知識主題入口 ===== */}
      <section className="container-x py-16 md:py-20">
        <div className="mb-10 md:mb-12 md:flex md:items-end md:justify-between md:gap-8">
          <div>
            <p className="text-xs tracking-[3px] text-goldDark uppercase mb-3">
              Knowledge Hub · 從這裡開始
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-navy mb-3">
              香董想跟你聊的三件事
            </h2>
          </div>
          <p className="text-sm text-woodLight max-w-xl leading-relaxed">
            買賣、開料、品香的十幾年經驗，香董用文字一篇一篇記下來。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <TopicHub
            icon="❖"
            title="沉香知識"
            intro="沉香真假、價格、產地、沉水與味道差異。新手最常踩雷的地方都在這。"
            items={[
              { label: '沉香價格為什麼差很多？', href: '/blog/why-agarwood-prices-vary-so-much' },
              { label: '真假沉香怎麼辨識？', href: '/blog/agarwood-real-vs-fake' },
              { label: '沉水能不能判斷價格？', href: '/blog/agarwood-sinking-water-value' },
            ]}
            mainLink="/blog?topic=agarwood-knowledge"
            mainLinkLabel="看沉香知識全部文章"
          />
          <TopicHub
            icon="❀"
            title="線香推薦"
            intro="從日常一支天然線香開始，把香放進生活。新手先看成分、黏粉、燃燒與香氣表現。"
            items={[
              { label: '天然線香和化學線香差在哪？', href: '/blog/natural-vs-chemical-incense-sticks' },
              { label: '黏粉比例越低越好嗎？', href: '/blog/agarwood-incense-binder-ratio-explained' },
              { label: '點香後為什麼別用嘴吹？', href: '/blog/how-to-light-and-extinguish-incense' },
            ]}
            mainLink="/blog?topic=incense-culture"
            mainLinkLabel="看線香相關文章"
          />
          <TopicHub
            icon="◎"
            title="沉香佛珠"
            intro="沉香佛珠不只是配件。從木質、油線、珠數、香氣到收藏觀念，先把選購邏輯講清楚。"
            items={[
              { label: '先看木質、油線還是香氣？', href: '/blog/how-to-pick-agarwood-beginner-guide' },
              { label: '為什麼價格會差很多？', href: '/blog/why-agarwood-prices-vary-so-much' },
              { label: '買之前先問哪三件事？', href: '/line' },
            ]}
            mainLink="/blog?topic=incense-culture"
            mainLinkLabel="看佛珠相關文章"
          />
        </div>
      </section>

      {/* ===== 香董是誰 ===== */}
      <section className="bg-cream py-16 md:py-20 border-y border-gold/15">
        <div className="container-x">
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <p className="text-xs tracking-[3px] text-goldDark uppercase mb-3">
                關於香董
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-navy mb-5 leading-snug">
                我不是什麼大師<br />
                也沒想改變世界
              </h2>
              <div className="aspect-[4/5] bg-wood/10 rounded-lg border border-gold/20 overflow-hidden flex items-center justify-center text-woodLight/50 text-sm">
                {founderPhotoUrl ? (
                  <Image
                    src={founderPhotoUrl}
                    alt={founderPhoto?.alt || '香董本人'}
                    width={600}
                    height={750}
                    priority
                    fetchPriority="high"
                    loading="eager"
                    sizes="(max-width: 768px) 50vw, 400px"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>（香董本人照片）</span>
                )}
              </div>
            </div>
            <div className="md:col-span-8 md:pl-6">
              <div className="space-y-5 text-wood leading-loose">
                <p>
                  我是一個沉香買賣商，做這行十幾年。
                  從擺攤、賣佛珠開始，一路到沉香、線香、開料、原料。
                  <strong className="text-navy">我不是什麼大師，也沒有什麼改變世界的想法。</strong>
                </p>
                <p>但有兩件事我堅持很久。</p>
                <p>
                  <span className="text-gold font-medium">第一，賣的東西要對得起客人。</span>
                  就算是五千塊的入門品，也要讓人聞到「真的是沉香的味道」，
                  而不是泡油泡出來的假香。
                </p>
                <p>
                  <span className="text-gold font-medium">第二，定價要說得出口。</span>
                  一支香值不值得，不應該靠「某某大師加持」、「祖傳秘方」這種故事撐起來。
                  應該靠：用了什麼料、比例怎麼配、燃燒是否乾淨。
                  所以我們連製香的原材料都直接賣 ── 你看得到原料、聞得到香韻、算得出成本，
                  這個生意才走得遠。
                </p>
                <p className="text-navy">
                  這個網站，是我這十幾年累積的東西的記事本。
                  不一定每篇文章都寫得多漂亮，但每一篇都是真的。
                </p>
                <p className="text-sm text-woodLight tracking-widest pt-2">— 香董</p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-sm text-navy border-b border-gold pb-0.5 hover:text-goldDark"
                >
                  讀完整的香董創業故事 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 最新文章 ===== */}
      <section className="bg-cream py-16 md:py-20 border-b border-gold/15">
        <div className="container-x">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs tracking-[3px] text-goldDark uppercase mb-2">
                Latest Articles
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-navy">最新文章</h2>
            </div>
            <Link
              href="/blog"
              className="hidden sm:inline-flex text-sm text-navy hover:text-goldDark border-b border-gold pb-0.5"
            >
              看全部文章 →
            </Link>
          </div>

          {articlesWithReading.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
              {featuredArticle && (
                <div className="lg:col-span-6">
                  <FeaturedArticleCard article={featuredArticle} />
                </div>
              )}
              <div className="grid gap-5 sm:grid-cols-2 lg:col-span-6">
                {secondaryArticles.map((a) => (
                  <ArticleCard key={a._id} article={a} />
                ))}
              </div>
              <Link
                href="/blog"
                className="sm:hidden inline-flex text-sm text-navy hover:text-goldDark border-b border-gold pb-0.5 justify-self-start"
              >
                看全部文章 →
              </Link>
            </div>
          ) : (
            <EmptyState
              label="文章準備中"
              hint="香董正在錄製第一批內容"
            />
          )}
        </div>
      </section>

      {/* ===== 香董商城 ===== */}
      <section className="container-x py-16 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-[3px] text-goldDark uppercase mb-2">
              Featured Products
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-navy">本週精選</h2>
            <p className="text-sm text-woodLight mt-2">
              先看適合誰與香韻，再到香董商城下單或洽詢。
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex text-sm text-navy hover:text-goldDark border-b border-gold pb-0.5"
          >
            看全部商品 →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="sticky top-24 rounded-lg border border-gold/20 bg-cream p-5 md:p-6">
                <p className="text-xs tracking-[3px] text-goldDark uppercase mb-3">
                  Buying Notes
                </p>
                <h3 className="text-xl text-navy mb-4">
                  本週精選先看三件事
                </h3>
                <div className="space-y-4 text-sm text-woodLight leading-relaxed">
                  <p>
                    <span className="text-goldDark font-medium">香韻</span>
                    ：清涼、甜、藥香、木質感，先挑自己每天聞得住的。
                  </p>
                  <p>
                    <span className="text-goldDark font-medium">用途</span>
                    ：日常點香、送禮、收藏，會影響預算與規格。
                  </p>
                  <p>
                    <span className="text-goldDark font-medium">來源</span>
                    ：能看原料、能講配方，才有辦法判斷價格。
                  </p>
                </div>
                <Link
                  href="/line"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-navy px-4 py-3 text-sm font-medium text-cream transition hover:bg-navyDark"
                >
                  不確定先問香董 →
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-5 lg:col-span-8">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
            <Link
              href="/shop"
              className="sm:hidden inline-flex text-sm text-navy hover:text-goldDark border-b border-gold pb-0.5 justify-self-start"
            >
              看全部商品 →
            </Link>
          </div>
        ) : (
          <EmptyState
            label="商品準備中"
            hint="香董正在挑選本週要上的好香"
          />
        )}
      </section>

      {/* ===== 沉香常見問題 FAQ（SEO Rich Snippet） ===== */}
      {faq.length > 0 && (
        <section className="bg-cream py-16 md:py-20 border-y border-gold/15">
          <div className="container-x">
            <div className="grid gap-8 md:grid-cols-12 md:items-start">
              <div className="md:col-span-4">
                <p className="text-xs tracking-[3px] text-goldDark uppercase mb-3">
                  FAQ
                </p>
                <h2 className="font-serif text-2xl md:text-3xl text-navy leading-snug mb-4">
                  買之前，先把常見問題問完
                </h2>
                <p className="text-sm text-woodLight leading-relaxed">
                  真正會影響購買的，通常不是名詞，而是保存、真假、香韻、價格與使用情境。
                </p>
              </div>
              <div className="md:col-span-8">
                <FaqSection items={faq} title="" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA Block ===== */}
      <section className="container-x py-12 md:py-16">
        <CtaBlock />
      </section>

      {/* ===== 延伸學習 ===== */}
      <section className="container-x pb-20">
        <div className="border-t border-dashed border-gold/40 pt-8 text-center">
          <p className="text-xs tracking-[3px] text-goldDark uppercase mb-2">
            Extended Learning
          </p>
          <p className="text-navy">
            想看更多沉香專業知識，歡迎加入
          </p>
          <a
            href="https://www.facebook.com/groups/260642251054970"
            target="_blank"
            rel="noopener"
            className="inline-block mt-2 text-navy font-medium border-b border-gold pb-0.5 hover:text-goldDark"
          >
            「香董職人老實說｜沉香知識 × 香友交流」
          </a>
          <p className="text-xs text-woodLight/70 mt-2">
            4,488 位成員的交流社團
          </p>
        </div>
      </section>
    </>
  )
}

function OriginMapCard({ map }: { map: OriginMapData }) {
  return (
    <div className="rounded-lg border border-gold/20 bg-cream/75 p-5 md:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs tracking-[3px] text-goldDark uppercase mb-2">
            {map.kicker}
          </p>
          <h3 className="font-serif text-2xl text-navy">{map.title}</h3>
        </div>
        <span className="self-start rounded-full border border-gold/30 bg-white px-3 py-1 text-xs text-goldDark">
          {map.regions.length} 個點位
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-woodLight">{map.intro}</p>

      <div className="relative mt-5 aspect-[5/3] overflow-hidden rounded-lg border border-gold/20 bg-[#ECF3F1]">
        <div className="absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.7)_0%,rgba(236,243,241,0.35)_45%,rgba(201,169,97,0.14)_100%)]" />
        <div className="absolute inset-x-5 top-1/2 h-px bg-white/70" />
        <div className="absolute inset-y-5 left-1/2 w-px bg-white/70" />
        <OriginMapSilhouette country={map.country} />
        {map.regions.map((region) => (
          <OriginMapPin key={`${map.country}-${region.name}`} region={region} />
        ))}
      </div>

      <div className="mt-5 divide-y divide-gold/20">
        {map.regions.map((region) => (
          <div
            key={`${map.country}-note-${region.name}`}
            className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[8rem_1fr]"
          >
            <div>
              <p className="text-sm font-medium text-navy leading-snug">
                {region.name}
              </p>
              <p className="mt-0.5 text-[11px] text-goldDark leading-snug">
                {region.area}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-woodLight">
              {region.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function OriginMapSilhouette({ country }: { country: OriginMapCountry }) {
  if (country === 'indonesia') {
    return (
      <div aria-hidden="true" className="absolute inset-0">
        <span className="absolute left-[9%] top-[45%] h-[15%] w-[28%] -rotate-[16deg] rounded-[60%] border border-navy/10 bg-navy/12" />
        <span className="absolute left-[27%] top-[63%] h-[7%] w-[25%] -rotate-[3deg] rounded-[60%] border border-navy/10 bg-navy/12" />
        <span className="absolute left-[32%] top-[35%] h-[28%] w-[22%] rotate-[8deg] rounded-[45%_55%_50%_40%] border border-navy/10 bg-navy/12" />
        <span className="absolute left-[53%] top-[41%] h-[23%] w-[12%] rotate-[22deg] rounded-[60%_35%_60%_35%] border border-navy/10 bg-navy/12" />
        <span className="absolute left-[59%] top-[50%] h-[16%] w-[10%] -rotate-[30deg] rounded-[60%] border border-navy/10 bg-navy/12" />
        <span className="absolute left-[69%] top-[47%] h-[5%] w-[5%] rounded-full border border-navy/10 bg-navy/12" />
        <span className="absolute left-[72%] top-[57%] h-[4%] w-[4%] rounded-full border border-navy/10 bg-navy/12" />
        <span className="absolute left-[77%] top-[44%] h-[23%] w-[19%] rotate-[4deg] rounded-[35%_60%_45%_55%] border border-navy/10 bg-navy/12" />
      </div>
    )
  }

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <span className="absolute left-[35%] top-[12%] h-[19%] w-[24%] -rotate-[12deg] rounded-[55%_45%_50%_55%] border border-navy/10 bg-navy/12" />
      <span className="absolute left-[46%] top-[27%] h-[34%] w-[8%] rotate-[8deg] rounded-full border border-navy/10 bg-navy/12" />
      <span className="absolute left-[50%] top-[48%] h-[26%] w-[9%] -rotate-[15deg] rounded-full border border-navy/10 bg-navy/12" />
      <span className="absolute left-[57%] top-[66%] h-[21%] w-[18%] rotate-[20deg] rounded-[50%_35%_55%_45%] border border-navy/10 bg-navy/12" />
      <span className="absolute left-[49%] top-[84%] h-[8%] w-[17%] -rotate-[12deg] rounded-full border border-navy/10 bg-navy/12" />
    </div>
  )
}

function OriginMapPin({ region }: { region: OriginMapRegion }) {
  const labelClassName =
    region.labelSide === 'left'
      ? 'absolute right-4 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded bg-white/95 px-2 py-0.5 text-[11px] text-navy shadow-sm sm:block'
      : 'absolute left-4 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded bg-white/95 px-2 py-0.5 text-[11px] text-navy shadow-sm sm:block'

  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${region.x}%`, top: `${region.y}%` }}
    >
      <span className="relative flex h-3.5 w-3.5 items-center justify-center">
        <span className="absolute h-3.5 w-3.5 rounded-full bg-gold/35" />
        <span className="relative h-2 w-2 rounded-full border border-white bg-goldDark shadow" />
      </span>
      <span className={labelClassName}>{region.name}</span>
    </div>
  )
}

function EmptyState({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="bg-white border border-dashed border-gold/40 rounded-lg py-14 text-center">
      <p className="text-navy text-lg mb-1">{label}</p>
      <p className="text-sm text-woodLight">{hint}</p>
    </div>
  )
}

function HomeHeroProductTile({
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
      className={`group relative block overflow-hidden rounded-lg bg-cream shadow-sm ${className}`}
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

function FeaturedArticleCard({ article }: { article: ArticleCardData }) {
  const imageUrl = article.coverImage
    ? urlForImage(article.coverImage)?.width(1100).height(780).url()
    : null
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\//g, '.')
    : ''

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block h-full overflow-hidden rounded-lg border border-gold/20 bg-white transition-colors hover:border-gold/60"
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-cream">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gold/40">
            （封面圖）
          </div>
        )}
        <div className="absolute left-4 top-4 rounded bg-navy/90 px-3 py-1 text-xs text-cream">
          本週先讀
        </div>
      </div>
      <div className="p-5 md:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] text-woodLight">
          {date && <span>{date}</span>}
          {article.category && (
            <>
              <span className="opacity-50">·</span>
              <span>{article.category.name}</span>
            </>
          )}
          {article.readingMinutes && (
            <>
              <span className="opacity-50">·</span>
              <span>閱讀時間 {article.readingMinutes} 分鐘</span>
            </>
          )}
        </div>
        <h3 className="mb-3 text-2xl leading-snug text-navy transition-colors group-hover:text-goldDark">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="line-clamp-3 text-sm leading-relaxed text-woodLight">
            {article.excerpt}
          </p>
        )}
        <p className="mt-5 inline-flex items-center gap-1 text-sm text-goldDark">
          讀這篇建立判斷 →
        </p>
      </div>
    </Link>
  )
}
