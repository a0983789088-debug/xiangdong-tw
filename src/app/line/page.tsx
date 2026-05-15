import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/Breadcrumb'
import { CTA_PRESETS } from '@/lib/cta'

export const metadata: Metadata = {
  title: '加 LINE 領《沉香新手避雷指南》｜香董',
  description:
    '免費領取《沉香新手避雷指南》PDF + 收藏級沉香優先通知 + 直播開播提醒 + 新品試聞資訊。',
  alternates: { canonical: '/line' },
}

const BENEFITS = [
  { title: '收藏級沉香優先通知', body: 'LINE 好友比 FB 社團早 24 小時收到通知。' },
  { title: '直播開播提醒', body: '每週 FB 直播開料、品香、競標，LINE 推播提醒你別錯過。' },
  { title: '新品試聞資訊', body: '新到的香材、線香、雕件，試聞活動會在 LINE 公告。' },
  { title: '即時答疑', body: '挑香、配香、保存、辨識真假，遇到問題直接訊息問香董。' },
]

export default function LineLandingPage() {
  return (
    <>
      <div className="container-x pt-6 pb-2">
        <Breadcrumb items={[{ label: '首頁', href: '/' }, { label: '領手冊 / 加 LINE' }]} />
      </div>

      <section className="container-x pt-4 pb-10 max-w-3xl">
        <p className="text-xs tracking-[3px] text-gold uppercase mb-3">
          《沉香新手避雷指南》
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-navy leading-tight mb-5">
          香董寫的 6 頁 PDF<br />
          給第一次想買沉香的人
        </h1>
        <p className="text-base text-woodLight leading-relaxed mb-7">
          沉香真假辨識、產地差別、保存重點、新手入門路徑全在裡面。
        </p>

        {/* 直接下載 PDF（最快路徑） */}
        <div className="bg-cream border border-gold/30 rounded-lg p-6 mb-6">
          <p className="text-xs tracking-[3px] text-gold uppercase mb-2">
            直接下載
          </p>
          <h2 className="font-serif text-xl text-navy mb-3">點下面、馬上下載 PDF</h2>
          <p className="text-sm text-wood leading-relaxed mb-4">
            不用加 LINE、不用留資料。香董相信「真正好的東西就該攤開來看」。
          </p>
          <a
            href="/沉香新手避雷指南.pdf"
            download="沉香新手避雷指南.pdf"
            className="inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-3 rounded-md font-medium hover:bg-navyDark transition"
          >
            <span>下載 PDF（6 頁，132KB）</span>
            <span>↓</span>
          </a>
        </div>

        {/* 加 LINE（推薦） */}
        <div className="border border-lineGreen/30 rounded-lg p-6 mb-12">
          <p className="text-xs tracking-[3px] text-lineGreen uppercase mb-2">
            或者，加 LINE 拿到的更多
          </p>
          <h2 className="font-serif text-xl text-navy mb-3">加香董 LINE 官方帳號</h2>
          <p className="text-sm text-wood leading-relaxed mb-5">
            加好友後不只是 PDF，還會收到每週直播提醒、收藏級單一件優先通知、新品試聞資訊。
          </p>
          <a
            href={CTA_PRESETS.line.url}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-2 bg-lineGreen text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition"
          >
            <span>加入香董 LINE 官方帳號</span>
            <span>→</span>
          </a>
        </div>

        <div className="space-y-5">
          <p className="text-sm tracking-[3px] text-gold uppercase">加入後你會持續收到</p>
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex gap-4 pb-5 border-b border-gold/20 last:border-0">
              <span className="text-gold text-xl mt-0.5">◆</span>
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
            那也可以加入 4,488 位香友的 FB 社團，或直接到 FB 競標社團看每週直播。
          </p>
          <div className="space-y-2">
            <a href={CTA_PRESETS.fbKnowledge.url} target="_blank" rel="noopener"
               className="block text-navy underline decoration-gold underline-offset-4 hover:text-goldDark">
              → 加入 FB 香董職人老實說社團
            </a>
            <a href={CTA_PRESETS.fbBidding.url} target="_blank" rel="noopener"
               className="block text-navy underline decoration-gold underline-offset-4 hover:text-goldDark">
              → 加入 FB 直播競標社團
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
