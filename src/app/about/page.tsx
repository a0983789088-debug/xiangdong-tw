import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Breadcrumb } from '@/components/Breadcrumb'
import { CTA_PRESETS } from '@/lib/cta'
import { JsonLd } from '@/components/JsonLd'
import { sanityClient } from '@/lib/sanity/client'
import { SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { urlForImage } from '@/lib/sanity/image'

export const revalidate = 300

export const metadata: Metadata = {
  title: '關於香董｜從打工仔到沉香買賣商的十幾年',
  description:
    '香董創業故事：18 歲入伍、退伍夜間部、中國信託、保誠人壽、2008 創業。我不是大師，也沒想改變世界，只想做一件自己相信的事。',
  alternates: { canonical: '/about' },
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://xiangdong.tw'

export default async function AboutPage() {
  const settings = await sanityClient.fetch<any>(SITE_SETTINGS_QUERY).catch(() => null)
  const founderPhoto = settings?.founderPhoto
  const founderPhotoUrl = founderPhoto ? urlForImage(founderPhoto)?.width(2000).url() : null

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: '香董',
          url: `${SITE_URL}/about`,
          jobTitle: '沉香買賣商',
          worksFor: {
            '@type': 'Organization',
            name: '香董 Xiangdong',
            url: SITE_URL,
          },
          knowsAbout: ['沉香', '線香', '佛珠', '香道', '製香原料'],
        }}
      />

      <div className="container-x pt-6 pb-2">
        <Breadcrumb items={[{ label: '首頁', href: '/' }, { label: '關於香董' }]} />
      </div>

      <article className="container-x pt-4 pb-16 max-w-2xl">
        <p className="text-xs tracking-[3px] text-gold uppercase mb-3">
          關於香董
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-navy leading-tight mb-6">
          我不是什麼大師<br />
          也沒想改變世界
        </h1>

        <div className="aspect-square bg-wood/10 rounded-lg border border-gold/20 overflow-hidden flex items-center justify-center text-woodLight/50 text-sm mb-10">
          {founderPhotoUrl ? (
            <Image
              src={founderPhotoUrl}
              alt={founderPhoto?.alt || '香董本人'}
              width={2000}
              height={2000}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>（香董本人照片）</span>
          )}
        </div>

        <div className="prose-xd">
          <h2>從入伍到創業</h2>

          <p>
            18 歲那年，我剛高中畢業，就選擇入伍。那時候的薪水其實不差，
            底薪加上加給，一個月有五萬左右。工作不算操，但生活很單調，
            每天幾乎都在重複一樣的事情。
            我開始思考，如果人生一直這樣下去，
            會不會有一天連自己都不知道到底在忙什麼。
          </p>
          <p>
            退伍之後，我去讀商專夜間部。白天為了生活，我同時做了好幾份工作。
            早上六點到郵局打工，中午送便當，
            下午去泡沫紅茶店上班，晚上再趕去學校上課。
            那幾年，我幾乎每天都在通車、工作、上課之間循環。
          </p>
          <p>
            後來我開始意識到，光靠打工很難真正累積未來。
            於是大二時，我透過 104 應徵進了中國信託，做約聘總務。
            那段時間，我第一次真正接觸企業制度與職場文化，
            也開始知道，原來工作不只是賺薪水，
            而是很多細節、責任與信任累積出來的結果。
          </p>
          <p>
            之後，我被主管挖去美國人壽做內勤，
            又因為訓練部同仁的推薦，進入保誠人壽擔任教育訓練人員。
            畢業那年，原本終於轉成正式員工，以為人生慢慢穩定下來，
            卻又遇到公司被併購。
            那時候的我第一次真正感受到，很多事情不是努力就一定能掌握。
          </p>

          <h2>2008 年，我決定創業</h2>

          <p>
            一開始沒有什麼資源，也沒有太多資金，只是從自己熟悉的市場慢慢開始。
            我做過代工、擺過攤、賣過佛珠，也曾經一個人處理所有事情。
            後來開始接觸木頭、沉香、線香，慢慢一路做到今天。
          </p>
          <p>
            很多人現在看到的是直播、品牌、公司、系統，甚至覺得好像發展得不錯。
            但對我來說，我始終覺得自己只是個做小生意的人。
          </p>
          <blockquote>
            我沒有什麼改變世界的想法。我比較在意的是，
            公司能不能活下去、產品能不能對得起客人、
            團隊能不能穩定、家人能不能安心生活。
          </blockquote>
          <p>
            一路走到現在，我稱不上很有錢，
            但我有妻子、有孩子、有自己的房子與車子，
            也有一群願意相信我的客人。對我而言，這其實已經很足夠了。
          </p>

          <h2>我們相信的事</h2>

          <p>
            我們做了一件這個行業很少有人願意做的事 ──
            <strong>我們不只賣成品，連製香原材料都直接販售。</strong>
            從沉香原料、檀香粉、楠木黏粉，
            到不同產區、不同油脂狀態的材料，
            我們自己長期都在接觸、使用、比較、製作。
          </p>
          <p>
            一支香值不值得，不是因為誰代言、誰開光、誰說它有多神，
            而是它用了什麼料、比例怎麼配、香氣層次如何、燃燒是否乾淨、留韻是否舒服。
            這些東西，懂原料的人，其實聞得出來。
          </p>
          <p>
            我們沒有名人加持。也不刻意去蹭宗教熱度。
            不會把一塊普通材料，包裝成「某某大師珍藏」。
            也不會把天然香氣，硬講成神秘玄學。
          </p>
          <blockquote>
            真正能走得長久的品牌，不是建立在神話，而是建立在信任。
          </blockquote>
          <p>
            我們希望做的，不是讓人仰望的香，而是讓人願意長久使用的香。
            所以我們選擇把很多業界原本藏起來的東西攤開來講。
            讓更多人知道：原來沉香不是只有「天價」跟「玄學」。
            原來香氣是有脈絡、有邏輯、有材料依據的。
          </p>
          <p>
            這條路也許不好走。但總要有人開始。
          </p>

          <p style={{ textAlign: 'right', color: 'var(--color-navy)', letterSpacing: '4px', marginTop: '2rem' }}>
            ─ 香董
          </p>
        </div>

        <div className="mt-12 pt-10 border-t border-gold/30 grid sm:grid-cols-2 gap-4">
          <Link
            href={CTA_PRESETS.line.url}
            target="_blank"
            className="block bg-lineGreen text-white p-5 rounded-lg hover:opacity-90"
          >
            <p className="font-medium mb-1">加 LINE 領沉香新手手冊</p>
            <p className="text-xs opacity-90">每週直播提醒、限定品優先看</p>
          </Link>
          <Link
            href="/blog"
            className="block bg-navy text-cream p-5 rounded-lg hover:bg-navyDark"
          >
            <p className="font-medium mb-1">讀香董的沉香文章</p>
            <p className="text-xs opacity-90">沉香知識 / 新手教學 / 香董專欄</p>
          </Link>
        </div>
      </article>
    </>
  )
}
