import { article } from './article'
import { product } from './product'
import { category } from './category'
import { siteSettings } from './siteSettings'
import { blockContent } from './blockContent'

export const schemaTypes = [
  // Documents
  article,
  product,
  category,
  siteSettings,
  // Object types
  blockContent,
]
