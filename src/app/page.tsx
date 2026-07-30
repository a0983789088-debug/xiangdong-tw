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
import { getMyShopProducts } from '@/lib/myShopFeed'
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
    text: '看商城同步整理的商品、價格與規格，喜歡就能直接下單。',
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

export default async function HomePage() {
  const [articles, syncedProducts, fallbackProducts, settings] = await Promise.all([
    sanityClient.fetch<ArticleCardData[]>(HOME_ARTICLES_QUERY).catch(() => []),
    getMyShopProducts(8).catch(() => []),
    sanityClient.fetch<ProductCardData[]>(HOME_PRODUCTS_QUERY).catch(() => []),
    sanityClient.fetch<any>(SITE_SETTINGS_QUERY).catch(() => null),
  ])
  const products = syncedProducts.length > 0 ? syncedProducts : fallbackProducts

  const faq = settings?.homepageFaq || []
  const founderPhoto = settings?.founderPhoto
  const founderPhotoUrl = founderPhoto ? urlForImage(founderPhoto)?.width(600).height(750).fit('crop').url() : null
  const heroProducts = HOME_HERO_PRODUCT_SLUGS
    .map((slug) => MY_SHOP_PRODUCTS.find((product) => product.slug === slug))
    .filter((product): product is (typeof MY_SHOP_PRODUCTS)[number] => Boolean(product))
  const heroBackgroundProduct = heroProducts[0]
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
      <section className="relative overflow-hidden bg-wood text-cream">
        {heroBackgroundProduct?.mainImageUrl && (
          <Image
            src={heroBackgroundProduct.mainImageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,27,51,0.96)_0%,rgba(11,37,69,0.82)_48%,rgba(61,46,31,0.38)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-wood/85 to-transparent" />
        <div className="container-x relative py-14 md:py-16 lg:py-20">
          <div className="min-w-0 max-w-3xl">
            <p className="mb-4 text-xs tracking-[3px] text-gold uppercase">
              Xiangdong Agarwood House
            </p>
            <h1 className="mb-5 font-serif text-3xl leading-tight text-cream [overflow-wrap:anywhere] sm:text-4xl md:text-6xl">
              十幾年沉香買賣經驗，<br />
              帶你看懂真正的
              <br className="sm:hidden" />
              天然好香。
            </h1>
            <p className="mb-7 max-w-2xl text-sm leading-relaxed text-cream/86 [overflow-wrap:anywhere] md:text-lg">
              香董把沉香、線香、香粉原料和佛珠選品整理成你看得懂的路線。
              先讓你知道香氣、用途、價格差在哪。
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop#starter-guide"
                className="inline-flex items-center justify-center rounded-md bg-gold px-5 py-3 font-medium text-navy transition hover:bg-cream"
              >
                第一次買香怎麼選 →
              </Link>
              <TrackedShopLink
                href={SHOP_URL}
                target="_blank"
                rel="noopener"
                trackingName="首頁主視覺商城"
                trackingType="shop_home"
                className="inline-flex items-center justify-center rounded-md border border-cream/55 px-5 py-3 font-medium text-cream transition hover:bg-cream hover:text-navy"
              >
                看商城現貨 →
              </TrackedShopLink>
              <Link
                href="/line"
                className="inline-flex items-center justify-center rounded-md bg-lineGreen px-5 py-3 font-medium text-white transition hover:opacity-90"
              >
                加 LINE 先問
              </Link>
            </div>
            <p className="mt-4 max-w-xl text-xs leading-relaxed text-cream/72">
              從原料、香韻、燃燒表現到價格邏輯，讓你買香之前先建立判斷。
            </p>
          </div>

          <div className="mt-6 hidden gap-3 md:grid md:grid-cols-4">
            {heroProducts.slice(0, 3).map((product, index) => (
              <HomeHeroProductTile
                key={product._id}
                product={product}
                className="aspect-[4/3]"
                priority={index === 0}
              />
            ))}
            <TrackedShopLink
              href={SHOP_URL}
              target="_blank"
              rel="noopener"
              trackingName="首頁商城"
              trackingType="shop_home"
              className="flex min-h-36 flex-col justify-between rounded-lg border border-gold/35 bg-cream p-4 text-navy transition hover:bg-white"
            >
              <span className="text-xs tracking-[2px] text-goldDark uppercase">
                Shop
              </span>
              <span className="block">
                <span className="block font-serif text-xl leading-snug text-navy">
                  現貨、價格、規格一次看
                </span>
                <span className="mt-2 block text-xs leading-relaxed text-woodLight">
                  線香、香材、手串與日常香品，直接到商城下單。
                </span>
              </span>
              <span className="text-sm font-medium leading-snug text-goldDark">
                前往商城 →
              </span>
            </TrackedShopLink>
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
                先選你現在最需要的路線
              </h2>
            </div>
            <div className="md:col-span-8 grid gap-3 sm:grid-cols-3">
              {HOME_ENTRY_ROUTES.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="group flex min-h-24 flex-col justify-between rounded-lg border border-gold/20 bg-cream px-4 py-4 transition-colors hover:border-gold/60 hover:bg-white"
                >
                  <span className="text-sm font-medium leading-snug text-navy">
                    {route.title}
                  </span>
                  <span className="mt-2 text-xs leading-relaxed text-woodLight">
                    {route.text}
                  </span>
                  <span className="mt-3 text-xs text-goldDark group-hover:text-navy">
                    {route.action} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 選香路線 ===== */}
      <section className="relative overflow-hidden bg-cream border-b border-gold/15">
        <Image
          src="/maps/world-map-geographical-1920.jpg"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none object-cover opacity-[0.28] mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-cream/78" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream to-transparent" />
        <div className="container-x relative py-14 md:py-16">
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
                  'group flex min-h-[13rem] flex-col justify-between rounded-lg border border-gold/25 bg-white/88 p-5 shadow-sm backdrop-blur-[2px] transition-colors hover:border-gold/65 hover:bg-white'
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
              Shop Products
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-navy">商城最新現貨</h2>
            <p className="text-sm text-woodLight mt-2">
              依香董商城目前排序顯示，先看品項、價格與用途，再到商城下單或洽詢。
            </p>
          </div>
          <TrackedShopLink
            href={SHOP_URL}
            target="_blank"
            rel="noopener"
            trackingName="首頁商城最新現貨"
            trackingType="shop_home"
            className="hidden sm:inline-flex text-sm text-navy hover:text-goldDark border-b border-gold pb-0.5"
          >
            看全部商品 →
          </TrackedShopLink>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="sticky top-24 rounded-lg border border-gold/20 bg-cream p-5 md:p-6">
                <p className="text-xs tracking-[3px] text-goldDark uppercase mb-3">
                  Buying Notes
                </p>
                <h3 className="text-xl text-navy mb-4">
                  看商城現貨先看三件事
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
            <TrackedShopLink
              href={SHOP_URL}
              target="_blank"
              rel="noopener"
              trackingName="首頁商城最新現貨"
              trackingType="shop_home"
              className="sm:hidden inline-flex text-sm text-navy hover:text-goldDark border-b border-gold pb-0.5 justify-self-start"
            >
              看全部商品 →
            </TrackedShopLink>
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
            4,886 位成員的交流社團
          </p>
        </div>
      </section>
    </>
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
        className="object-cover object-bottom transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/92 via-navy/55 to-transparent p-3 text-cream">
        <span className="line-clamp-2 block text-sm font-medium leading-tight">
          {product.name}
        </span>
        {product.priceLabel && (
          <span className="mt-1 block text-[11px] text-gold">
            {product.priceLabel}
          </span>
        )}
      </div>
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
