import type { ProductCardData } from '@/components/ProductCard'

export const MY_SHOP_HOME_URL = 'https://baujie-agarwood.my1shop.com/'

type MyShopMediaFile = {
  URL?: string
  Extension?: string
}

type MyShopProduct = {
  AllProductID?: string
  ProductName?: string
  ProductMark?: string
  ProductStatus?: number
  PriceBase?: number
  PriceSpecial?: number
  PriceShow?: number
  Url?: string
  MediaFile?: MyShopMediaFile
}

type MyShopContentBlock = {
  type?: string
  Title?: string
  AllProduct?: MyShopProduct[]
}

type MyShopPageData = {
  Info?: {
    WebPageContent?: MyShopContentBlock[]
  }
}

export async function getMyShopProducts(limit = 8): Promise<ProductCardData[]> {
  const response = await fetch(MY_SHOP_HOME_URL, {
    headers: {
      'User-Agent': 'xiangdong.tw product sync',
    },
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    throw new Error(`Unable to fetch MyShop products: ${response.status}`)
  }

  const html = await response.text()
  const pageData = extractPageData(html)
  const content = pageData.Info?.WebPageContent ?? []
  const seen = new Set<string>()
  const products: ProductCardData[] = []

  for (const block of content) {
    if (block.type !== 'ProductList') continue

    for (const product of block.AllProduct ?? []) {
      if (product.ProductStatus !== 1) continue
      if (!product.ProductName || !product.Url) continue

      const uniqueKey = product.AllProductID || product.Url
      if (seen.has(uniqueKey)) continue
      seen.add(uniqueKey)

      products.push(normalizeProduct(product, block.Title))
      if (products.length >= limit) return products
    }
  }

  return products
}

function extractPageData(html: string): MyShopPageData {
  const marker = 'var _pageData = '
  const markerIndex = html.indexOf(marker)
  if (markerIndex < 0) {
    throw new Error('MyShop _pageData not found')
  }

  const objectStart = html.indexOf('{', markerIndex + marker.length)
  if (objectStart < 0) {
    throw new Error('MyShop _pageData object not found')
  }

  let depth = 0
  let inString = false
  let escape = false

  for (let index = objectStart; index < html.length; index += 1) {
    const char = html[index]

    if (inString) {
      if (escape) {
        escape = false
      } else if (char === '\\') {
        escape = true
      } else if (char === '"') {
        inString = false
      }
      continue
    }

    if (char === '"') {
      inString = true
    } else if (char === '{') {
      depth += 1
    } else if (char === '}') {
      depth -= 1
      if (depth === 0) {
        return JSON.parse(html.slice(objectStart, index + 1)) as MyShopPageData
      }
    }
  }

  throw new Error('MyShop _pageData object is incomplete')
}

function normalizeProduct(
  product: MyShopProduct,
  listTitle?: string,
): ProductCardData {
  const name = product.ProductName || ''
  const mark = product.ProductMark || ''

  return {
    _id: `myshop-live-${product.AllProductID || stableSlug(product.Url || name)}`,
    name,
    slug: stableSlug(product.Url || name),
    mainImageUrl: buildImageUrl(product.MediaFile),
    externalUrl: product.Url || MY_SHOP_HOME_URL,
    productType: inferProductType(`${name} ${mark} ${listTitle || ''}`),
    origin: '商城現貨',
    priceLabel: formatPrice(product.PriceSpecial, product.PriceBase, product.PriceShow),
    shortDescription: mark || listTitle || '香董商城現貨',
    isCollectible: isCollectibleProduct(name, product.PriceSpecial, listTitle),
  }
}

function buildImageUrl(media?: MyShopMediaFile): string | undefined {
  if (!media?.URL) return undefined

  const url = media.URL.replace(/\\\//g, '/')
  if (/\.(avif|gif|jpe?g|png|webp)(\?.*)?$/i.test(url)) {
    return url
  }

  const extension = media.Extension || 'jpg'
  return `${url.endsWith('/') ? url : `${url}/`}600x.${extension}`
}

function formatPrice(
  special?: number,
  base?: number,
  priceShow?: number,
): string | undefined {
  if (!special && !base) return undefined
  if (priceShow === 1 && special && base && special !== base) {
    const min = Math.min(special, base)
    const max = Math.max(special, base)
    return `${formatCurrency(min)} - ${formatCurrency(max).replace('NT$', '')}`
  }

  return formatCurrency(special || base || 0)
}

function formatCurrency(value: number): string {
  return `NT$${new Intl.NumberFormat('zh-TW').format(value)}`
}

function inferProductType(text: string): ProductCardData['productType'] {
  if (/手串|念珠|佛珠|吊墜|墜|珠/.test(text)) return 'beads'
  if (/粉|香粉|檀粉|沉粉|抽油/.test(text)) return 'raw-material'
  if (/線香|立香|臥香|盤香|無黏香|試香|香組/.test(text)) return 'incense-stick'
  if (/噴霧|乳液|皂|精油/.test(text)) return 'other'
  return 'other'
}

function isCollectibleProduct(
  name: string,
  price?: number,
  listTitle?: string,
): boolean {
  return /收藏|藏品|念珠|手串|吊墜|九分|棋楠/.test(
    `${name} ${listTitle || ''}`,
  ) || Boolean(price && price >= 1000)
}

function stableSlug(value: string): string {
  const tail = decodeURIComponent(value).split('/').filter(Boolean).pop() || value
  return tail
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
