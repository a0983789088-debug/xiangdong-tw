import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/Breadcrumb'
import { CTA_PRESETS } from '@/lib/cta'

export const metadata: Metadata = {
  title: '加入 FB 競標社團｜每週直播好貨先看｜香董',
  description:
    '香董每週固定 FB 直播競標：開料、品香、收藏級單一件。加入社團，獨家好貨優先看，現場試香、即時答疑。',
  alternates: { canonical: '/community' },
}

export default function CommunityPage() {
  return (
    <>
      <div className="container-x pt-6 pb-2">
        <Breadcrumb items={[{ label: '首頁', href: '/' }, { label: 'FB 競標社團' }]} />
      </div>

      <section className="container-x pt-4 pb-16 max-w-3xl">
        <p className="text-xs tracking-[3px] text-goldDark uppercase mb-3">
          FB 直播競標社團
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-navy leading-tight mb-5">
          每週直播競標<br />
          收藏級好貨先看
        </h1>
        <p className="text-base text-woodLight leading-relaxed mb-8">
          這是香董最熟悉的場域。
          每週固定 FB 直播開料、品香、競標好貨，
          收藏級單一件多在這裡釋出。
        </p>

        <a
          href={CTA_PRESETS.fbBidding.url}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center justify-center gap-3 w-full sm:w-auto bg-fbBlue text-white px-8 py-4 rounded-md text-base font-medium hover:opacity-90 transition mb-12"
        >
          <span>加入 FB 競標社團</span>
          <span>→</span>
        </a>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="bg-cream rounded-lg p-6 border border-gold/20">
            <p className="text-xs tracking-[3px] text-goldDark uppercase mb-2">
              直播內容
            </p>
            <h3 className="text-navy text-lg mb-3">每週直播</h3>
            <ul className="space-y-2 text-sm text-wood">
              <li className="flex gap-2"><span className="text-gold">·</span>沉香原料開料</li>
              <li className="flex gap-2"><span className="text-gold">·</span>現場試香、香韻分析</li>
              <li className="flex gap-2"><span className="text-gold">·</span>收藏級單一件釋出</li>
              <li className="flex gap-2"><span className="text-gold">·</span>即時答疑、配香建議</li>
            </ul>
          </div>
          <div className="bg-cream rounded-lg p-6 border border-gold/20">
            <p className="text-xs tracking-[3px] text-goldDark uppercase mb-2">
              社團規則
            </p>
            <h3 className="text-navy text-lg mb-3">入社團須知</h3>
            <ul className="space-y-2 text-sm text-wood">
              <li className="flex gap-2"><span className="text-gold">·</span>競標規則直播時公告</li>
              <li className="flex gap-2"><span className="text-gold">·</span>得標後 24 小時內聯絡</li>
              <li className="flex gap-2"><span className="text-gold">·</span>付款連結走香董商城</li>
              <li className="flex gap-2"><span className="text-gold">·</span>有任何問題可私訊香董</li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-gold/20">
          <p className="text-sm text-woodLight mb-4">
            想看深度沉香知識交流？另一個 4,488 人的學習社團也歡迎加入：
          </p>
          <a
            href={CTA_PRESETS.fbKnowledge.url}
            target="_blank"
            rel="noopener"
            className="block text-navy underline decoration-gold underline-offset-4 hover:text-goldDark"
          >
            → 加入 FB 香董職人老實說｜沉香知識 × 香友交流
          </a>
        </div>
      </section>
    </>
  )
}
