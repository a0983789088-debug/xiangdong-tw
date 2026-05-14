import Image from 'next/image'
import { urlForImage } from '@/lib/sanity/image'

export type ProductCardData = {
  _id: string
  name: string
  slug: string
  mainImage?: any
  shortDescription?: string
  externalUrl: string
  isCollectible?: boolean
  // 知識型欄位
  productType?: string
  aromaProfile?: string
  targetAudience?: string
  origin?: string
}

const PRODUCT_TYPE_LABEL: Record<string, string> = {
  'agarwood': '沉香',
  'incense-stick': '線香',
  'beads': '佛珠',
  'carving': '雕件',
  'raw-material': '原料',
  'other': '香品',
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const imageUrl = product.mainImage
    ? urlForImage(product.mainImage)?.width(700).height(700).url()
    : null
  const typeLabel = product.productType
    ? PRODUCT_TYPE_LABEL[product.productType] || product.productType
    : null

  return (
    <a
      href={product.externalUrl}
      target="_blank"
      rel="noopener"
      className={`group block rounded-lg overflow-hidden bg-white transition-colors ${
        product.isCollectible
          ? 'border-2 border-gold shadow-[0_0_0_3px_rgba(201,169,97,0.08)]'
          : 'border border-gold/20 hover:border-gold/50'
      } relative`}
    >
      {product.isCollectible && (
        <span className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 bg-gold text-navy text-[10.5px] font-medium px-2 py-0.5 rounded-full tracking-wider">
          <span>◆</span> 藏品級
        </span>
      )}

      <div
        className={`aspect-square overflow-hidden relative ${
          product.isCollectible ? 'bg-wood' : 'bg-cream'
        }`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            width={700}
            height={700}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gold/40 text-sm">
            （商品照片）
          </div>
        )}
        {typeLabel && (
          <span className="absolute bottom-2 left-2 bg-white/90 text-navy text-[10.5px] px-2 py-0.5 rounded">
            {typeLabel}
          </span>
        )}
      </div>

      <div className="p-3.5 md:p-4">
        <p className="text-[15px] text-navy font-medium mb-1 group-hover:text-goldDark transition-colors leading-tight">
          {product.name}
        </p>
        {product.origin && (
          <p className="text-[10.5px] text-gold tracking-wider mb-2">
            {product.origin}
          </p>
        )}
        {/* 知識型資訊：香韻 + 適合誰 */}
        {(product.aromaProfile || product.targetAudience) && (
          <div className="space-y-0.5 mb-3 text-[11.5px] text-woodLight leading-relaxed">
            {product.aromaProfile && (
              <p>
                <span className="text-gold mr-1">香韻</span>
                {product.aromaProfile}
              </p>
            )}
            {product.targetAudience && (
              <p>
                <span className="text-gold mr-1">適合</span>
                {product.targetAudience}
              </p>
            )}
          </div>
        )}
        {product.shortDescription && !product.aromaProfile && (
          <p className="text-xs text-woodLight line-clamp-2 leading-relaxed mb-3">
            {product.shortDescription}
          </p>
        )}
        <p className="text-xs text-gold inline-flex items-center gap-1">
          <span>{product.isCollectible ? '到就醬播洽詢' : '到就醬播選購'}</span>
          <span>→</span>
        </p>
      </div>
    </a>
  )
}
