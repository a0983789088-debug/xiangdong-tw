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
import { estimateReadingMinutes } from '@/lib/readingTime'

export const revalidate = 300

export default async function HomePage() {
  const [articles, products, settings] = await Promise.all([
    sanityClient.fetch<ArticleCardData[]>(HOME_ARTICLES_QUERY).catch(() => []),
    sanityClient.fetch<ProductCardData[]>(HOME_PRODUCTS_QUERY).catch(() => []),
    sanityClient.fetch<any>(SITE_SETTINGS_QUERY).catch(() => null),
  ])

  const faq = settings?.homepageFaq || []
  const livestreamTitle = settings?.livestreamTitle
  const livestreamSchedule = settings?.livestreamSchedule
  const livestreamContent = settings?.livestreamContent
  const founderPhoto = settings?.founderPhoto
  const founderPhotoUrl = founderPhoto ? urlForImage(founderPhoto)?.width(800).url() : null

  return (
    <>
      {/* === 首頁 FAQ Rich Snippet JSON-LD === */}
      {faq.length > 0 && <JsonLd data={buildFaqJsonLd(faq)} />}

      {/* ===== Hero ===== */}
      <section className="bg-cream border-b border-gold/15">
        <div className="container-x py-14 md:py-20">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7">
              <p className="text-xs tracking-[3px] text-gold uppercase mb-4">
                沉香 · 線香 · 佛珠 · 原料
              </p>
              <h1 className="font-serif text-3xl md:text-5xl text-navy leading-tight tracking-wide mb-5">
                真正的天然好香，<br />
                從原料到成品都看得見。
              </h1>
              <p className="text-base text-woodLight leading-relaxed mb-7 max-w-xl">
                做這行十幾年。<strong className="text-navy">看得見的原料、算得出的成本、聞得出的香韻</strong>
                ── 才是一支好香的真價值。
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <Link
                  href="/line"
                  className="inline-flex items-center justify-center gap-2 bg-lineGreen text-white px-5 py-3 rounded-md font-medium hover:opacity-90 transition"
                >
                  加 LINE 領《沉香新手避雷指南》
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 border border-navy text-navy px-5 py-3 rounded-md font-medium hover:bg-navy hover:text-white transition"
                >
                  開始讀沉香知識 →
                </Link>
              </div>
              <p className="text-xs text-woodLight/85 leading-relaxed">
                加 LINE 還可以收到：
                <span className="text-navy">收藏級沉香優先通知</span>
                <span className="mx-1.5 text-gold/50">·</span>
                <span className="text-navy">直播開播提醒</span>
                <span className="mx-1.5 text-gold/50">·</span>
                <span className="text-navy">新品試聞資訊</span>
              </p>
            </div>

            {/* Hero side: 本週直播（從 siteSettings 動態取） */}
            <div className="md:col-span-5">
              <div className="bg-white border border-gold/30 rounded-lg p-6 md:p-7">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-gold" />
                  <p className="text-xs tracking-[3px] text-gold uppercase">直播花絮</p>
                </div>
                <p className="font-serif text-lg text-navy leading-snug mb-2">
                  {livestreamTitle || '每週固定 FB 直播'}
                </p>
                {livestreamSchedule && (
                  <p className="text-sm text-gold mb-3">{livestreamSchedule}</p>
                )}
                <p className="text-sm text-woodLight leading-relaxed mb-5">
                  {livestreamContent ||
                    '開料、品香、社團競標。香董親自切原料、現場試香、即時答疑。收藏級單一件多在直播中釋出。'}
                </p>
                <div className="space-y-2">
                  <a
                    href="https://www.facebook.com/groups/1789214647984397"
                    target="_blank"
                    rel="noopener"
                    className="block text-sm text-navy underline decoration-gold underline-offset-4 hover:text-goldDark"
                  >
                    → 加入 FB 競標社團
                  </a>
                  <a
                    href="https://jambolive.tv/shop/62349/product/fb/"
                    target="_blank"
                    rel="noopener"
                    className="block text-sm text-navy underline decoration-gold underline-offset-4 hover:text-goldDark"
                  >
                    → 看就醬播商城
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 知識主題入口 ===== */}
      <section className="container-x py-16 md:py-20">
        <div className="text-center mb-10 md:mb-12">
          <p className="text-xs tracking-[3px] text-gold uppercase mb-3">
            Knowledge Hub · 從這裡開始
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-navy mb-3">
            香董想跟你聊的三件事
          </h2>
          <p className="text-sm text-woodLight max-w-xl mx-auto leading-relaxed">
            買賣、開料、品香的十幾年經驗，香董用文字一篇一篇記下來。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <TopicHub
            icon="❖"
            title="沉香知識"
            intro="什麼是沉香、怎麼分辨真假、各產地的差別。新手最常踩雷的地方都在這。"
            items={[]}
            mainLink="/blog?topic=agarwood-knowledge"
            mainLinkLabel="看沉香知識全部文章"
          />
          <TopicHub
            icon="❀"
            title="線香使用"
            intro="從日常一支香開始，把香放進生活。新手線香怎麼挑、怎麼用、怎麼配空間。"
            items={[]}
            mainLink="/blog?topic=incense-culture"
            mainLinkLabel="看線香相關文章"
          />
          <TopicHub
            icon="◎"
            title="佛珠文化"
            intro="香木手珠不只是配件。從木質差異、配戴保養到收藏觀念，講清楚。"
            items={[]}
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
              <p className="text-xs tracking-[3px] text-gold uppercase mb-3">
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
                    width={800}
                    height={1000}
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
              <p className="text-xs tracking-[3px] text-gold uppercase mb-2">
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

          {articles.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {articles.slice(0, 6).map((a) => (
                <ArticleCard
                  key={a._id}
                  article={{
                    ...a,
                    readingMinutes: estimateReadingMinutes((a as any).body),
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              label="文章準備中"
              hint="香董正在錄製第一批內容"
            />
          )}
        </div>
      </section>

      {/* ===== 商品櫥窗 ===== */}
      <section className="container-x py-16 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-[3px] text-gold uppercase mb-2">
              Featured Products
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-navy">本週精選</h2>
            <p className="text-sm text-woodLight mt-2">
              點商品 → 跳轉就醬播商城
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
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
            <div className="text-center mb-8">
              <p className="text-xs tracking-[3px] text-gold uppercase mb-2">
                FAQ
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-navy">
                沉香常見問題
              </h2>
              <p className="text-sm text-woodLight mt-2">
                新手最常問香董的問題
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <FaqSection items={faq} title="" />
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
          <p className="text-xs tracking-[3px] text-gold uppercase mb-2">
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

function EmptyState({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="bg-white border border-dashed border-gold/40 rounded-lg py-14 text-center">
      <p className="text-navy text-lg mb-1">{label}</p>
      <p className="text-sm text-woodLight">{hint}</p>
    </div>
  )
}
