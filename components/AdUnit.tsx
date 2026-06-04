'use client';
import { useEffect } from 'react';

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
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error', error);
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className || ''}`}
      style={style || { display: 'block' }}
      data-ad-client="ca-pub-1784471620247875"
      data-ad-slot={slot}
      {...(format ? { 'data-ad-format': format } : {})}
      {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
    />
  );
}
