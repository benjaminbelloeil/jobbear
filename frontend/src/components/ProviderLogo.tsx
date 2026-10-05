import { useId } from 'react'
import { siClaude, siGooglegemini, siOllama } from 'simple-icons'

import { grokLogo, openaiLogo, type LogoPath } from './landing/providerLogos'

// Same marks as the landing page (see providerLogos.ts for sources and licences). Claude and
// Gemini keep their brand colours; the monochrome marks take the current text colour.
const LOGOS: Record<string, { logo: LogoPath; brand?: string | string[] }> = {
  anthropic: { logo: siClaude, brand: `#${siClaude.hex}` },
  openai: { logo: openaiLogo },
  google: { logo: siGooglegemini, brand: ['#4796E3', '#9177C7', '#CA6673'] },
  xai: { logo: grokLogo },
  ollama: { logo: siOllama },
}

/** An AI provider's mark by provider id. Decorative: always pair it with the name. */
export default function ProviderLogo({ id, size = 22 }: { id: string; size?: number }) {
  const gradientId = useId()
  const entry = LOGOS[id]
  if (!entry) return null
  const { logo, brand } = entry
  const fill = Array.isArray(brand) ? `url(#${gradientId})` : brand
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden className="fill-current">
      {Array.isArray(brand) && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            {brand.map((stop, index) => (
              <stop key={stop} offset={index / (brand.length - 1)} stopColor={stop} />
            ))}
          </linearGradient>
        </defs>
      )}
      <path d={logo.path} fill={fill} fillRule={logo.evenOdd ? 'evenodd' : undefined} />
    </svg>
  )
}
