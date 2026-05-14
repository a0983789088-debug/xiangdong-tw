import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/Breadcrumb'
import { CTA_PRESETS } from '@/lib/cta'

export const metadata: Metadata = {
  title: '加 LINE 領《沉香新手避雷指南》｜香董',
  description:
    '免費領取《沉香新手避雷指南》PDF + 收藏級沉香優先通知 + 直播開播提醒 + 新品試聞資訊。加香董 LINE 官方帳號，第一手好香不錯過。',
  alternates: { canonical: '/line' },
  openGraph: {
    title: '加 LINE 領《沉香新手避雷指南》',
    description: '免費 PDF + 收藏級沉香優先通知 + 直播開播提醒',
  },
}

const BENEFITS = [
  {
    icon: '◆',
    title: '免費下載《沉香新手避雷指南》',
    body: '香董親自寫的 6 頁 PDF。沉香真假辨識、產地差別、保存重點、新手入門路徑全在裡面。',
  },
  {
    icon: '◆',
    title: '收藏級沉香優先通知',
    body: '香董手上有限的收藏級單一件，LINE 好友比 FB 社團早 24 小時收到通知。',
  },
  {
    icon: '◆',
    title: '直播開播提醒',
    body: '每週 FB 直播開料、品香、競標。LINE 推播提醒你別錯過。',
  },
  {
    icon: '◆',
    title: '新品試聞資訊',
    body: '新到的香材、線香、雕件，試聞活動、限量配額會在 LINE 公告。',
  },
  {
    icon: '◆',
    title: '即時答疑',
    body: '挑香、配香、保存、辨識真假，遇到問題可以直接訊息問香董。',
  },
]

export default function LineLandingPage() {
  return (
    <>
      <div className="container-x pt-6 pb-2">
        <Breadcrumb items={[{ label: '首頁', href: '/' }, { label: '加 LINE' }]} />
      </div>

      <section className="container-x pt-4 pb-16 max-w-3xl">
        <p className="text-xs tracking-[3px] text-gold uppercase mb-3">
          香董 LINE 官方帳號
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-navy leading-tight mb-5">
          加 LINE 領《沉香新手避雷指南》<br />
          + 每週直播提醒
        </h1>
        <p className="text-base text-woodLight leading-relaxed mb-8">
          香董每週固定 FB 直播開料、品香、社團競標。
          加入 LINE 官方帳號，第一手收到通知，
          不錯過任何一場好料。
        </p>

        <a
          href={CTA_PRESETS.line.url}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center justify-center gap-3 w-full sm:w-auto bg-lineGreen text-white px-8 py-4 rounded-md text-base font-medium hover:opacity-90 transition shadow-sm mb-3"
        >
          <span>加入香董 LINE 官方帳號</span>
          <span>→</span>
        </a>
        <p className="text-xs text-woodLight">
          連結會打開 LINE App。完成加好友後系統會自動傳送 PDF 下載連結給你。
        </p>

        <div className="mt-12 space-y-5">
          <p className="text-sm tracking-[3px] text-gold uppercase">
            加入後你會收到
          </p>
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="flex gap-4 pb-5 border-b border-gold/20 last:border-0"
            >
              <span className="text-gold text-xl mt-0.5">{b.icon}</span>
              <div>
                <h3 className="text-navy text-lg mb-1">{b.title}</h3>
                <p className="text-sm text-wood leading-relaxed">{b.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-10 border-t border-gold/20">
          <h2 className="font-serif text-xl text-navy mb-4">不喜歡 LINE？</h2>
          <p className="text-sm text-wood leading-relaxed mb-4">
            那也可以加入 4,488 位香友的 FB 社團
            「香董職人老實說｜沉香知識 × 香友交流」，
            或直接到 FB 競標社團看每週直播。
          </p>
          <div className="space-y-2">
            <a
              href={CTA_PRESETS.fbKnowledge.url}
              target="_blank"
              rel="noopener"
              className="block text-navy underline decoration-gold underline-offset-4 hover:text-goldDark"
            >
              → 加入 FB 香董職人老實說社團
            </a>
            <a
              href={CTA_PRESETS.fbBidding.url}
              target="_blank"
              rel="noopener"
              className="block text-navy underline decoration-gold underline-offset-4 hover:text-goldDark"
            >
              → 加入 FB 直播競標社團
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
