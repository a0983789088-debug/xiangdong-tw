import { article } from './article'
import { product } from './product'
import { category } from './category'
import { siteSettings } from './siteSettings'
import { blockContent } from './blockContent'
import { starterPage } from './starterPage'

export const schemaTypes = [
  // Documents
  article,
  product,
  category,
  siteSettings,
  starterPage,
  // Object types
  blockContent,
]
