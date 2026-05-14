import { ProductCard, type ProductCardData } from './ProductCard'

export function RelatedProducts({ products }: { products: ProductCardData[] }) {
  if (!products || products.length === 0) return null
  return (
    <section className="mt-12 pt-10 border-t border-gold/30">
      <p className="text-xs tracking-[3px] text-gold uppercase mb-2">
        Related Products
      </p>
      <h2 className="font-serif text-2xl text-navy mb-6">文章提到的商品</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
      <p className="text-xs text-woodLight mt-4 text-center">
        點商品 → 跳轉就醬播商城選購
      </p>
    </section>
  )
}
