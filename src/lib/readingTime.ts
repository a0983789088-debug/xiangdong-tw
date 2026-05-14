/**
 * 估算閱讀時間（分鐘）。
 * 中文以「字數 / 400」估算；英文以「words / 200」估算。
 * 從 PortableText body 推算。
 */
export function estimateReadingMinutes(body: any): number {
  if (!body || !Array.isArray(body)) return 1
  let chars = 0
  for (const block of body) {
    if (block?._type !== 'block' || !Array.isArray(block.children)) continue
    for (const child of block.children) {
      if (typeof child?.text === 'string') chars += child.text.length
    }
  }
  return Math.max(1, Math.ceil(chars / 400))
}
