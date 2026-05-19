/**
 * 香董後台 Sanity Studio 嵌入點
 * 訪問網址：xiangdong.tw/studio
 *
 * 用 dynamic + ssr:false 把整個 Sanity Studio bundle（含 schema config）
 * 限制在 /studio 路由 client-side 才載入、避免污染前台 CSS/JS。
 */
'use client'

import dynamic from 'next/dynamic'

const StudioWrapper = dynamic(
  async () => {
    const [studioMod, configMod] = await Promise.all([
      import('next-sanity/studio'),
      import('../../../../sanity.config'),
    ])
    const { NextStudio } = studioMod
    const config = configMod.default
    return function StudioWrapper() {
      return <NextStudio config={config} />
    }
  },
  {
    ssr: false,
    loading: () => (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#5C4E3D' }}>
        Loading Studio…
      </div>
    ),
  }
)

export default function StudioPage() {
  return <StudioWrapper />
}
