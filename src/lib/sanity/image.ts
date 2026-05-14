import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'
import { projectId, dataset } from './client'

const builder = createImageUrlBuilder({ projectId, dataset })

export function urlForImage(source: Image | undefined | null) {
  if (!source) return null
  return builder.image(source).auto('format').fit('max')
}
