import { groq } from 'next-sanity'

/** 全站設定（singleton） */
export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]{
  siteTitle,
  siteDescription,
  defaultOgImage,
  livestreamTitle,
  livestreamSchedule,
  livestreamContent,
  homepageFaq[]{ question, answer },
  ctas[]{ type, title, description, url },
  floatingButton,
  gaId,
  metaPixelId,
  searchConsoleVerification
}`

/** 首頁：最新 6 篇文章 */
export const HOME_ARTICLES_QUERY = groq`*[_type == "article" && defined(publishedAt)] | order(publishedAt desc) [0...6]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  "category": category->{name, "slug": slug.current},
  publishedAt,
  body
}`

/** 首頁：精選商品 4 件 */
export const HOME_PRODUCTS_QUERY = groq`*[_type == "product"] | order(isCollectible desc, _createdAt desc) [0...4]{
  _id,
  name,
  "slug": slug.current,
  mainImage,
  shortDescription,
  externalUrl,
  isCollectible,
  productType,
  aromaProfile,
  targetAudience,
  origin
}`

/** 文章列表（含分頁） */
export const ARTICLES_LIST_QUERY = groq`{
  "items": *[_type == "article" && defined(publishedAt)] | order(publishedAt desc) [$start...$end]{
    _id, title, "slug": slug.current, excerpt, coverImage,
    "category": category->{name, "slug": slug.current},
    publishedAt, body
  },
  "total": count(*[_type == "article" && defined(publishedAt)])
}`

/** 單篇文章 */
export const ARTICLE_BY_SLUG_QUERY = groq`*[_type == "article" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  body,
  "category": category->{name, "slug": slug.current, "_id": _id},
  tags,
  publishedAt,
  ctaOverride,
  faq,
  "relatedProducts": relatedProducts[]->{
    _id, name, "slug": slug.current, mainImage, shortDescription, externalUrl,
    isCollectible, productType, aromaProfile, targetAudience, origin
  },
  "manualRelatedArticles": relatedArticles[]->{
    _id, title, "slug": slug.current, excerpt, coverImage,
    "category": category->{name, "slug": slug.current},
    publishedAt, body
  },
  seoTitle,
  seoDescription,
  ogImage
}`

/** 相關文章 fallback */
export const FALLBACK_RELATED_ARTICLES_QUERY = groq`*[
  _type == "article"
  && defined(publishedAt)
  && _id != $currentId
  && category._ref == $categoryId
] | order(publishedAt desc) [0...3]{
  _id, title, "slug": slug.current, excerpt, coverImage,
  "category": category->{name, "slug": slug.current},
  publishedAt, body
}`

/** 所有文章 slug */
export const ALL_ARTICLE_SLUGS_QUERY = groq`*[_type == "article" && defined(publishedAt) && defined(slug.current)]{
  "slug": slug.current,
  publishedAt,
  _updatedAt
}`

/** 所有分類 */
export const ALL_CATEGORIES_QUERY = groq`*[_type == "category"] | order(order asc){
  _id, name, "slug": slug.current, description, order
}`

/** 所有商品 */
export const ALL_PRODUCTS_QUERY = groq`*[_type == "product"] | order(isCollectible desc, _createdAt desc){
  _id, name, "slug": slug.current, mainImage, shortDescription, externalUrl,
  isCollectible, productType, aromaProfile, targetAudience, origin
}`
