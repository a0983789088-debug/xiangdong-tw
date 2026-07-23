import Link from 'next/link'
import { CTA_PRESETS } from '@/lib/cta'

export function Footer() {
  return (
    <footer className="mt-24 bg-navy text-cream/85">
      <div className="container-x py-14">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <p className="font-serif text-2xl text-cream tracking-wider">香董</p>
            <p className="text-xs text-cream/60 tracking-widest mt-1 uppercase">
              Xiangdong · 真正的天然好香
            </p>
            <p className="text-sm text-cream/70 mt-5 leading-relaxed">
              推動沉香「標準化」與「價格透明化」。
              不只賣成品，連製香原材料都直接販售。
            </p>
          </div>

          {/* Sitemap */}
          <div>
            <p className="text-cream font-medium mb-4 text-sm">網站</p>
            <ul className="space-y-2 text-sm text-cream/70">
              <li><Link href="/" className="hover:text-gold">首頁</Link></li>
              <li><Link href="/blog" className="hover:text-gold">香董文章</Link></li>
              <li><Link href="/shop" className="hover:text-gold">香董商城</Link></li>
              <li><Link href="/about" className="hover:text-gold">關於香董</Link></li>
            </ul>
          </div>

          {/* Channels */}
          <div>
            <p className="text-cream font-medium mb-4 text-sm">跟香董聊聊</p>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>
                <a href={CTA_PRESETS.line.url} target="_blank" rel="noopener" className="hover:text-gold">
                  LINE 官方帳號
                </a>
              </li>
              <li>
                <a href={CTA_PRESETS.community.url} target="_blank" rel="noopener" className="hover:text-gold">
                  香董香生活 社群
                </a>
              </li>
              <li>
                <a href={CTA_PRESETS.fbBidding.url} target="_blank" rel="noopener" className="hover:text-gold">
                  FB 競標社團
                </a>
              </li>
              <li>
                <a href={CTA_PRESETS.fbKnowledge.url} target="_blank" rel="noopener" className="hover:text-gold">
                  FB 香董職人老實說
                </a>
              </li>
              <li>
                <a href={CTA_PRESETS.shop.url} target="_blank" rel="noopener" className="hover:text-gold">
                  香董商城
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / About */}
          <div>
            <p className="text-cream font-medium mb-4 text-sm">我們相信的事</p>
            <p className="text-xs text-cream/70 leading-relaxed">
              真正能走得長久的品牌，
              不是建立在神話，
              而是建立在信任。
            </p>
            <p className="text-xs text-cream/50 mt-6">
              © {new Date().getFullYear()} 香董 · xiangdong.tw
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
