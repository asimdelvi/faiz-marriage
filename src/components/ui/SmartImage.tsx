import { useState } from 'react';
import GeneratedArt from './GeneratedArt';
import { resolveImage } from '../../lib/media';
import type { PromptKey } from '../../lib/prompts';
import type { ImageRef } from '../../types';

type Props = {
  image?: ImageRef | string;
  fallbackKey: PromptKey;
  alt: string;
  /** e.g. '4 / 5' — reserved up-front so images never shift the layout. */
  ratio?: string;
  className?: string;
  imgClassName?: string;
  /** The hero image is the LCP element; everything else stays lazy. */
  priority?: boolean;
  label?: string;
  sizes?: string;
  /** 'hero' switches the generated fallback to a wide cinematic backdrop. */
  artVariant?: 'panel' | 'hero';
};

/**
 * One image primitive for the whole site: reserves its box, lazy-loads,
 * zooms on hover, and quietly swaps in generated artwork when the asset is
 * missing or fails to load.
 */
export function SmartImage({
  image,
  fallbackKey,
  alt,
  ratio = '4 / 5',
  className = '',
  imgClassName = '',
  priority = false,
  label,
  sizes,
  artVariant = 'panel',
}: Props) {
  const resolved = resolveImage(image, fallbackKey, alt);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const showArt = !resolved.src || failed;

  return (
    <div
      className={`relative overflow-hidden bg-cream ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {showArt ? (
        <GeneratedArt
          prompt={resolved.prompt}
          label={label ?? alt}
          variant={artVariant}
          seed={label || alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <img
          src={resolved.src}
          alt={resolved.alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] will-change-transform ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}
    </div>
  );
}

export default SmartImage;
