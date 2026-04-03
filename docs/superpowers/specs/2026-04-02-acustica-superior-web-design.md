# Spec: Acústica Superior — Nuevo Sitio Web
**Fecha:** 2026-04-02  
**Estado:** Aprobado  
**Stack:** Astro 5 · Tailwind CSS v4 · GSAP 3 + ScrollTrigger · @astrojs/sitemap  
**Deploy:** Netlify (producción) + GitHub Pages (preview via Actions)

---

## 1. Contexto y Objetivo

Rediseño completo del sitio web de **Acústica Superior** (https://acusticasuperior.com/), empresa panameña de tratamiento acústico. El objetivo es reemplazar el sitio WordPress actual por uno moderno, veloz y visualmente premium que refleje la calidad técnica del negocio.

**Repositorio:** https://github.com/abrinay1997-stack/Acustica_Superior_DEMO.git

---

## 2. Assets Disponibles

```
public/
├── Logo/LOGO.webp
└── images/
    ├── Adecuación_acustica.webp
    ├── Aislamiento_y_bloqueo_acustico.webp
    ├── Balance_frecuencial.webp
    ├── Control_de_Ruido_Industrial.webp
    ├── Medición_y_diseño_acústico.webp
    └── Studio1.webp … Studio12.webp
```

---

## 3. Sistema Visual

### Paleta de Color
| Token | Valor | Uso |
|---|---|---|
| `--color-bg` | `#080808` | Fondo base |
| `--color-surface` | `rgba(255,255,255,0.03)` | Cards glassmorphism |
| `--color-border` | `rgba(255,255,255,0.08)` | Bordes glass por defecto |
| `--color-border-accent` | `rgba(253,232,23,0.25)` | Bordes hover |
| `--color-accent` | `#FDE817` | Amarillo principal |
| `--color-text` | `#FFFFFF` | Texto principal |
| `--color-muted` | `rgba(255,255,255,0.45)` | Texto secundario |

### Glassmorphism — Clase `.glass`
```css
background: rgba(255,255,255,0.03);
border: 1px solid rgba(255,255,255,0.08);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
border-radius: 12px;
```

### Tipografía
- **Títulos:** Plus Jakarta Sans (700, 800, 900)
- **Cuerpo:** Inter (400, 500, 600)
- Carga via Google Fonts con `font-display: swap`

---

## 4. Estructura de Archivos

```
src/
├── pages/
│   ├── index.astro
│   ├── quienes-somos.astro
│   ├── servicios.astro
│   ├── proyectos.astro
│   └── contacto.astro
├── components/
│   ├── NavBar.astro
│   ├── Hero.astro
│   ├── HeroInterno.astro
│   ├── ServiciosGrid.astro
│   ├── ProyectosMasonry.astro
│   ├── Lightbox.astro
│   ├── ContactoForm.astro
│   ├── WhatsAppButton.astro
│   ├── CursorCustom.astro
│   ├── StatsStrip.astro
│   ├── CTABanner.astro
│   ├── Footer.astro
│   └── ParticlesCanvas.astro       # client:only — script Canvas 2D
├── layouts/
│   └── Layout.astro
└── styles/
    └── global.css
public/
├── Logo/
└── images/
.github/
└── workflows/
    ├── preview.yml      # GitHub Pages
    └── netlify.yml      # Netlify (opcional, Netlify detecta automático)
```

---

## 5. Páginas y Contenido

### `/` — Inicio
1. **NavBar** — glassmorphism sticky, logo + links + botón CTA amarillo
2. **Hero Split** — izq: titular grande + subtítulo + 2 CTAs | der: foto Studio con parallax | fondo: partículas Canvas animadas
3. **StatsStrip** — `12+ Proyectos · 5 Servicios Especializados · Panamá`
4. **Preview Servicios** — 3 cards glass con link a `/servicios`
5. **Preview Proyectos** — 4 fotos masonry con link a `/proyectos`
6. **CTABanner** — fondo oscuro con acento amarillo, botón "Solicitar Cotización" → WhatsApp
7. **Footer**

### `/quienes-somos`
1. HeroInterno con título + imagen de fondo
2. Texto de empresa: quiénes son, misión, enfoque
3. 3 cards glass de valores: Precisión · Estética · Funcionalidad
4. CTA → Contacto

### `/servicios`
1. HeroInterno
2. **ServiciosGrid** — grid 3+2 con imagen WebP real, título, descripción y flecha
3. Hover: borde `#FDE817` + leve lift con `transform: translateY(-4px)`
4. CTA → WhatsApp

### `/proyectos`
1. HeroInterno
2. **ProyectosMasonry** — 12 fotos en masonry CSS (3 cols desktop, 2 tablet, 1 mobile)
3. **Lightbox** — overlay fullscreen negro, navegación ← → , cerrar con Escape
4. CTA → Contacto

### `/contacto`
1. HeroInterno
2. Split layout:
   - Izq: formulario (nombre, email, mensaje, botón enviar) via Netlify Forms
   - Der: datos de contacto (WhatsApp, Instagram, Facebook)
3. WhatsAppButton flotante (fijo, esquina inferior derecha, todas las páginas)

---

## 6. Animaciones GSAP

| Animación | Implementación |
|---|---|
| **Partículas hero** | `ParticlesCanvas.astro` — Canvas 2D, ~60 puntos, conexiones con líneas finas |
| **Parallax hero** | ScrollTrigger: imagen der. `y: 0 → -80px` al scroll |
| **Stagger cards** | `gsap.from('.service-card', { y:40, opacity:0, stagger:0.1 })` en viewport |
| **Stagger masonry** | Igual pero con delay por fila |
| **Cursor custom** | `CursorCustom.astro` — div circular `12px` blanco, sigue mouse con `lerp`, escala a `40px` en links/botones |
| **NavBar blur** | ScrollTrigger: `background: transparent → rgba(8,8,8,0.85) + backdrop-blur` |
| **Lightbox** | `gsap.fromTo` scale `0.9→1` + opacity `0→1`, 300ms ease-out |

---

## 7. Contacto y Redes Sociales

| Canal | Valor |
|---|---|
| WhatsApp | `+507 6139 9247` → `https://wa.me/50761399247` |
| Instagram | `https://www.instagram.com/acusticasuperior/` |
| Facebook | `https://www.facebook.com/acusticasuperior` |
| Web actual | `https://acusticasuperior.com/` |

---

## 8. CI/CD y Deploy

### GitHub Actions — Preview (GitHub Pages)
```yaml
name: Deploy Preview
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build
        env:
          GITHUB_PAGES: true
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Netlify — Producción
- Auto-detect desde repo GitHub
- Build command: `npm run build`
- Publish dir: `dist`
- Netlify Forms: activado automáticamente con atributo `data-netlify="true"`

### `astro.config.mjs`
```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// base condicional: vacío en Netlify, /Acustica_Superior_DEMO en GitHub Pages
const base = process.env.GITHUB_PAGES ? '/Acustica_Superior_DEMO' : '';
const site = process.env.GITHUB_PAGES
  ? 'https://abrinay1997-stack.github.io/Acustica_Superior_DEMO'
  : 'https://acusticasuperior.netlify.app';

export default defineConfig({
  output: 'static',
  base,
  site,
  integrations: [tailwind(), sitemap()]
});
```

---

## 9. SEO

- `<title>` y `<meta name="description">` únicos por página
- Schema.org `LocalBusiness` en JSON-LD en `Layout.astro`
- `<meta property="og:image">` apuntando a `LOGO.webp`
- `sitemap.xml` generado con `@astrojs/sitemap`
- `robots.txt` estándar

---

## 10. Responsividad

| Breakpoint | Comportamiento |
|---|---|
| Mobile `< 768px` | Hero apilado vertical, servicios 1 col, masonry 1 col, nav hamburger |
| Tablet `768–1024px` | Hero split, servicios 2 col, masonry 2 col |
| Desktop `> 1024px` | Diseño completo: servicios 3+2, masonry 3 col, hero split |

---

## 11. CLAUDE.md — Bitácora Agentica

Se creará `CLAUDE.md` en la raíz del proyecto con:
- Instrucciones del stack y comandos frecuentes
- Sistema de bitácora agentica en `.claude/errors-learned.md`
- Protocolo multi-agente para cambios no triviales
