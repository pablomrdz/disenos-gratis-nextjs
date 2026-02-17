import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
