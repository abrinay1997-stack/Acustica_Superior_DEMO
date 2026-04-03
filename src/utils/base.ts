/**
 * Normaliza el BASE_URL de Astro para construir paths correctos.
 * BASE_URL puede ser "/" (Netlify) o "/Acustica_Superior_DEMO" (GitHub Pages).
 * Siempre devuelve el prefijo sin slash final para usar como `${b}/images/X`.
 */
export const b = import.meta.env.BASE_URL.replace(/\/$/, '');
