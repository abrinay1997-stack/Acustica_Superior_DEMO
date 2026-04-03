# CLAUDE.md — Acústica Superior Web
> Proyecto: Sitio web moderno para Acústica Superior, Panamá
> Stack: Astro 5 · Tailwind CSS v4 · GSAP 3 + ScrollTrigger · @astrojs/sitemap
> Última actualización: 2026-04-02

---

## DESCRIPCIÓN DEL PROYECTO

Rediseño completo del sitio web de Acústica Superior (empresa de tratamiento acústico en Panamá).
Estilo Dark Glass Premium con glassmorphism, paleta negro/#FDE817/blanco, animaciones cinematográficas.

**Repositorio:** https://github.com/abrinay1997-stack/Acustica_Superior_DEMO.git
**Deploy producción:** Netlify (auto-deploy desde main)
**Preview:** GitHub Pages via GitHub Actions

---

## STACK Y COMANDOS

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev          # http://localhost:4321

# Build de producción
npm run build

# Preview del build
npm run preview

# Build para GitHub Pages (con base path)
GITHUB_PAGES=true npm run build
```

**Dependencias principales:**
- `astro` v5.x
- `@astrojs/tailwind` + `tailwindcss` v4
- `gsap` v3.x (ScrollTrigger incluido)
- `@astrojs/sitemap`

---

## ESTRUCTURA DEL PROYECTO

```
src/
├── pages/           # Rutas del sitio (index, quienes-somos, servicios, proyectos, contacto)
├── components/      # Componentes reutilizables
├── layouts/         # Layout.astro — base HTML, SEO, fuentes, GSAP init
└── styles/
    └── global.css   # Tokens CSS, clases glass, utilidades globales

public/
├── Logo/LOGO.webp
└── images/          # Servicios WebP + Studio1-12.webp
```

---

## TOKENS DE DISEÑO (global.css)

```css
--color-bg:            #080808
--color-surface:       rgba(255,255,255,0.03)
--color-border:        rgba(255,255,255,0.08)
--color-border-accent: rgba(253,232,23,0.25)
--color-accent:        #FDE817
--color-text:          #FFFFFF
--color-muted:         rgba(255,255,255,0.45)
```

Clase `.glass`: `background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(10px); border-radius: 12px;`

---

## CONTACTO Y REDES (para Footer y Contacto)

```
WhatsApp:  +507 6139 9247  →  https://wa.me/50761399247
Instagram: https://www.instagram.com/acusticasuperior/
Facebook:  https://www.facebook.com/acusticasuperior
```

---

## AGENTES DEL PROYECTO

Este proyecto usa el protocolo multi-agente definido en el CLAUDE.md global.
Agentes especializados para este proyecto:

| Agente | Rol | Archivos |
|--------|-----|---------|
| **Pixel** | Frontend/UI — componentes Astro, Tailwind, layouts | `src/components/`, `src/pages/`, `src/styles/` |
| **Motion** | Animaciones — GSAP, ScrollTrigger, Canvas, Lightbox | `src/components/ParticlesCanvas.astro`, `CursorCustom.astro`, `Lightbox.astro` |
| **Atlas** | QA — build, Lighthouse, responsive, accesibilidad | `astro.config.mjs`, `.github/workflows/` |

**Flujo antes de cambios no triviales:**
1. Leer archivos relevantes
2. Debate entre especialistas (si afecta >3 archivos)
3. Plan → Ejecución → Validación (`npm run build`)
4. Reporte con archivos:líneas exactas

---

## SPEC DE DISEÑO

El documento completo de diseño aprobado está en:
`docs/superpowers/specs/2026-04-02-acustica-superior-web-design.md`

Leerlo antes de cualquier cambio arquitectónico.

---

## BITÁCORA AGENTICA — SISTEMA DE APRENDIZAJE

### ¿Qué es esto?

Cada vez que se encuentre y resuelva un error, bug, fallo de build, o comportamiento inesperado
**durante el desarrollo de este proyecto**, se registra automáticamente en:

`.claude/errors-learned.md`

### Cuándo registrar

- Al corregir un bug que requirió investigación (no typos triviales)
- Al resolver un fallo de build o TypeScript/Astro
- Al arreglar comportamiento inesperado de GSAP, Tailwind v4, o Astro 5
- Al resolver conflictos de deploy (Netlify vs GitHub Pages)
- Al corregir problemas de responsive o animaciones

### Formato de entrada

```markdown
## [YYYY-MM-DD] — Título breve del error

**Contexto:** Qué se estaba construyendo o modificando.
**Error:** Mensaje exacto o descripción del síntoma.
**Causa raíz:** Por qué ocurrió.
**Fix aplicado:** Qué cambio exacto resolvió el problema.
**Prevención:** Regla o patrón a seguir en el futuro.
**Archivos:** `ruta/archivo.ts:L42`
```

### Reglas de la bitácora

- NUNCA sobreescribir entradas existentes — solo AÑADIR al final
- Una entrada por error distinto (no duplicar)
- El archivo `.claude/errors-learned.md` debe existir desde el inicio del proyecto
- Al comenzar una sesión, leer la bitácora para no repetir errores pasados

---

## PATRONES CONOCIDOS — ASTRO 5 + GSAP

### ParticlesCanvas — SIEMPRE usar `client:only`
Los componentes con Canvas/GSAP/window deben tener `client:only="svelte"` o ser scripts
inline con `<script>` en Astro. Astro renderiza en el servidor — `window` no existe en SSR.

### Tailwind v4 — Sin `tailwind.config.js`
Tailwind v4 usa `@import "tailwindcss"` en CSS, no archivo de config JS.
Los tokens custom van en `@theme {}` dentro del CSS.

### Base path dual (Netlify/GitHub Pages)
El `base` en `astro.config.mjs` es condicional según `process.env.GITHUB_PAGES`.
Todos los links internos deben usar el helper `import.meta.env.BASE_URL` de Astro.

### Netlify Forms
El formulario debe tener `data-netlify="true"` y un campo hidden `<input type="hidden" name="form-name">`.
Sin esto, Netlify no detecta el formulario en el build estático.

---

## CHECKLIST DE BUILD

Antes de considerar cualquier tarea completa:

- [ ] `npm run build` sin errores
- [ ] No hay warnings de TypeScript/Astro
- [ ] Responsive verificado en 375px, 768px, 1280px
- [ ] Animaciones GSAP no bloquean LCP (Largest Contentful Paint)
- [ ] Formulario de contacto funciona en preview de Netlify
- [ ] WhatsApp button visible y funcional en mobile
