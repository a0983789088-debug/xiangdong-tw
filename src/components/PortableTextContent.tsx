import Image from 'next/image'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { urlForImage } from '@/lib/sanity/image'
import Link from 'next/link'

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const url = urlForImage(value)?.width(1200).url()
      if (!url) return null
      return (
        <figure className="my-8">
          <Image
            src={url}
            alt={value.alt || ''}
            width={1200}
            height={800}
            className="rounded-lg w-full h-auto"
          />
          {value.caption && (
            <figcaption className="text-xs text-woodLight text-center mt-2 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children, value }) => (
      <h2 id={blockId(value)} className="scroll-mt-24">
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={blockId(value)} className="scroll-mt-24">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <u>{children}</u>,
    link: ({ value, children }) => {
      const href = value?.href || '#'
      const isExternal = /^https?:\/\//.test(href)
      if (isExternal) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        )
      }
      return <Link href={href}>{children}</Link>
    },
  },
}

function blockId(block: any) {
  if (!block?._key) return undefined
  return `h-${block._key}`
}

export function PortableTextContent({ value }: { value: any }) {
  if (!value) return null
  return (
    <div className="prose-xd max-w-prose">
      <PortableText value={value} components={components} />
    </div>
  )
}

/** 提取 H2/H3 標題用於 TOC */
export function extractToc(blocks: any[]): Array<{
  id: string
  text: string
  level: 2 | 3
}> {
  if (!Array.isArray(blocks)) return []
  const toc: Array<{ id: string; text: string; level: 2 | 3 }> = []
  for (const block of blocks) {
    if (block?._type !== 'block') continue
    const style = block.style
    if (style !== 'h2' && style !== 'h3') continue
    const text = (block.children || [])
      .map((c: any) => c.text || '')
      .join('')
    if (!text) continue
    toc.push({
      id: blockId(block) || '',
      text,
      level: style === 'h2' ? 2 : 3,
    })
  }
  return toc
}
