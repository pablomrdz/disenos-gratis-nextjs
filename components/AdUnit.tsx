'use client';
import { useEffect, useRef } from 'react';

interface AdUnitProps {
  slot: string;
  format?: string;
  layoutKey?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function AdUnit({
  slot,
  format,
  layoutKey,
  style,
  className,
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    let retries = 0;
    const MAX_RETRIES = 20; // 20 × 500ms = 10s max
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const checkSizeAndPush = () => {
      const element = adRef.current;
      // Verificamos si existe y tiene dimensiones reales
      if (element && element.offsetWidth > 0) {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error('AdSense Error:', e);
        }
      } else if (retries < MAX_RETRIES) {
        // Si mide 0, reintenta en 500ms hasta que el layout se calcule
        retries++;
        timeoutId = setTimeout(checkSizeAndPush, 500);
      }
    };

    checkSizeAndPush();

    // Cleanup: cancel pending retry on unmount
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className || ''}`}
      style={style || { display: 'block', minHeight: '250px' }}
      data-ad-client="ca-pub-1784471620247875"
      data-ad-slot={slot}
      {...(format ? { 'data-ad-format': format } : {})}
      {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
    />
  );
}
