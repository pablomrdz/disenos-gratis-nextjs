import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import React from 'react'
import {
  Printer,
  Scissors,
  Type,
  Box,
  Palette,
  Layout,
  Video,
  Zap,
  FolderOpen,
  Image as ImageIcon
} from 'lucide-react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function slugify(text: string): string {
  if (!text) return '';
  return normalizeText(text)
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric chars (keep spaces/hyphens)
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-');         // Remove duplicate hyphens
}

export function decodeHtml(html: string) {
  if (!html) return '';
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

export const getCategoryIcon = (slug: string, className = "h-8 w-8") => {
  const s = normalizeText(slug)
  if (s.includes('dtf') || s.includes('impresion')) return React.createElement(Printer, { className: `${className} text-blue-500` })
  if (s.includes('vinil') || s.includes('corte')) return React.createElement(Scissors, { className: `${className} text-purple-500` })
  if (s.includes('tipografia') || s.includes('fuente')) return React.createElement(Type, { className: `${className} text-amber-500` })
  if (s.includes('3d')) return React.createElement(Box, { className: `${className} text-indigo-500` })
  if (s.includes('recurso') || s.includes('vector')) return React.createElement(Palette, { className: `${className} text-pink-500` })
  if (s.includes('plantilla')) return React.createElement(Layout, { className: `${className} text-emerald-500` })
  if (s.includes('blog') || s.includes('tutorial')) return React.createElement(Video, { className: `${className} text-red-500` })
  if (s.includes('sublimacion')) return React.createElement(Zap, { className: `${className} text-orange-500` })
  if (s.includes('fondo') || s.includes('textura')) return React.createElement(ImageIcon, { className: `${className} text-cyan-500` })
  return React.createElement(FolderOpen, { className: `${className} text-primary` })
}

export const getCategoryColor = (slug: string) => {
  const s = normalizeText(slug)
  if (s.includes('dtf')) return 'bg-blue-500/10'
  if (s.includes('vinil')) return 'bg-purple-500/10'
  if (s.includes('tipografia') || s.includes('fuente')) return 'bg-amber-500/10'
  if (s.includes('3d')) return 'bg-indigo-500/10'
  if (s.includes('recurso')) return 'bg-pink-500/10'
  if (s.includes('plantilla')) return 'bg-emerald-500/10'
  if (s.includes('blog')) return 'bg-red-500/10'
  if (s.includes('sublimacion')) return 'bg-orange-500/10'
  if (s.includes('fondo') || s.includes('textura')) return 'bg-cyan-500/10'
  return 'bg-primary/10'
}
