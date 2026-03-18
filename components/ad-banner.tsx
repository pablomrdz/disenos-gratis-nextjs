"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function AdBanner({ slot, responsive = true, width, height, className }: any) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const timer = setTimeout(() => {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (e) {
          console.error('AdSense Error:', e);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  // Durante el SSR o antes de montar, devolvemos un div vacío del mismo tamaño 
  // para evitar el Error #425 de hidratación y prevenir Layout Shift.
  if (!isMounted) {
    return <div className={`w-full min-h-[100px] bg-transparent ${className || ''}`} />;
  }

  return (
    <div className={cn("overflow-hidden flex justify-center w-full", className)}>
      <ins
        className="adsbygoogle"
        style={{
          display: responsive ? 'block' : 'inline-block',
          width: width || 'auto',
          height: height || 'auto'
        }}
        data-ad-client="ca-pub-1784471620247875"
        data-ad-slot={slot}
        data-ad-format={responsive ? "auto" : undefined}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  )
}
