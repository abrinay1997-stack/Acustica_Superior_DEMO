# Acústica Superior — Plan de Implementación Web

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el sitio web completo de Acústica Superior con Astro 5, Tailwind CSS v4, GSAP 3, glassmorphism dark, deploy dual Netlify + GitHub Pages.

**Architecture:** Sitio estático multi-página (SSG) con 5 rutas. Los componentes Astro son Server-Side por defecto; Canvas/GSAP/DOM usan `<script>` inline o `client:only`. Layout base compartido inyecta fuentes, tokens CSS, Schema.org y componentes globales (NavBar, Footer, WhatsApp, Cursor).

**Tech Stack:** Astro 5 · @astrojs/tailwind · Tailwind CSS v4 · GSAP 3 + ScrollTrigger · @astrojs/sitemap · Netlify Forms · GitHub Actions

---

## Mapa de Archivos

| Archivo | Responsabilidad |
|---------|----------------|
| `astro.config.mjs` | Config central: base path dual, integraciones |
| `src/layouts/Layout.astro` | HTML base, SEO, fuentes, Schema.org, componentes globales |
| `src/styles/global.css` | Tokens CSS, clase `.glass`, reset, utilidades |
| `src/components/NavBar.astro` | Navegación sticky glassmorphism + hamburger mobile |
| `src/components/Footer.astro` | Logo, links, redes sociales |
| `src/components/WhatsAppButton.astro` | Botón flotante fijo esquina inferior derecha |
| `src/components/CursorCustom.astro` | Cursor circular custom (solo desktop) |
| `src/components/Hero.astro` | Hero split: texto izq + imagen + partículas |
| `src/components/ParticlesCanvas.astro` | Canvas 2D con partículas animadas (client:only script) |
| `src/components/StatsStrip.astro` | Franja de estadísticas (12+ proyectos, etc.) |
| `src/components/ServiciosGrid.astro` | Grid 3+2 de cards glassmorphism con imágenes reales |
| `src/components/HeroInterno.astro` | Hero compacto para páginas internas |
| `src/components/ProyectosMasonry.astro` | CSS masonry 3/2/1 col con 12 fotos |
| `src/components/Lightbox.astro` | Overlay fullscreen con nav ← → y cierre Escape |
| `src/components/ContactoForm.astro` | Formulario Netlify Forms |
| `src/components/CTABanner.astro` | Banner CTA oscuro con botón WhatsApp |
| `src/pages/index.astro` | Inicio: Hero + Stats + Preview Servicios + Preview Proyectos + CTA |
| `src/pages/quienes-somos.astro` | Quiénes Somos: texto + 3 valores cards |
| `src/pages/servicios.astro` | Servicios: grid completo 3+2 |
| `src/pages/proyectos.astro` | Proyectos: masonry completo 12 fotos + lightbox |
| `src/pages/contacto.astro` | Contacto: formulario + datos split |
| `.github/workflows/preview.yml` | CI: build + deploy a GitHub Pages en push |
| `netlify.toml` | Config Netlify: build command, publish dir |
| `public/robots.txt` | SEO: permitir todo |

---

## Task 1: Scaffolding del Proyecto

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `netlify.toml`

- [ ] **Step 1: Inicializar proyecto Astro en el directorio actual**

```bash
cd "C:/Users/MIPC/Desktop/DESARROLLOS/ACUSTICA SUPERIOR"
npm create astro@latest . -- --template minimal --no-git --install --typescript strict
```
Responder: `Yes` a instalar dependencias, `No` a inicializar git (ya existe).

- [ ] **Step 2: Instalar dependencias adicionales**

```bash
npm install @astrojs/tailwind tailwindcss@next gsap @astrojs/sitemap
```

- [ ] **Step 3: Reemplazar `astro.config.mjs` con config del proyecto**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const base = isGitHubPages ? '/Acustica_Superior_DEMO' : '';
const site = isGitHubPages
  ? 'https://abrinay1997-stack.github.io/Acustica_Superior_DEMO'
  : 'https://acusticasuperior.netlify.app';

export default defineConfig({
  output: 'static',
  base,
  site,
  integrations: [tailwind(), sitemap()],
});
```

- [ ] **Step 4: Crear `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

- [ ] **Step 5: Actualizar `.gitignore`**

Asegurarse de que contenga:
```
dist/
.astro/
node_modules/
.env
.env.*
.superpowers/
```

- [ ] **Step 6: Verificar que Astro arranca**

```bash
npm run dev
```
Esperado: servidor en `http://localhost:4321` sin errores.

- [ ] **Step 7: Commit inicial**

```bash
git add astro.config.mjs package.json netlify.toml tsconfig.json .gitignore
git commit -m "feat: scaffolding Astro 5 + Tailwind v4 + GSAP + sitemap"
```

---

## Task 2: Tokens CSS y Layout Base

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/Layout.astro`
- Create: `public/robots.txt` (URL genérica del sitemap)

- [ ] **Step 1: Crear `src/styles/global.css`**

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-bg: #080808;
  --color-surface: rgba(255, 255, 255, 0.03);
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-accent: rgba(253, 232, 23, 0.25);
  --color-accent: #FDE817;
  --color-text: #FFFFFF;
  --color-muted: rgba(255, 255, 255, 0.45);

  --font-sans: 'Inter', sans-serif;
  --font-display: 'Plus Jakarta Sans', sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  cursor: none; /* ocultar cursor nativo — se reemplaza con CursorCustom */
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* Glassmorphism base */
.glass {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
}

.glass-hover {
  transition: border-color 0.3s ease, transform 0.3s ease;
}

.glass-hover:hover {
  border-color: var(--color-border-accent);
  transform: translateY(-4px);
}

/* Scroll — ocultar en desktop, visible en mobile */
@media (pointer: coarse) {
  html { cursor: auto; }
}
```

- [ ] **Step 2: Crear `src/layouts/Layout.astro`**

```astro
---
// src/layouts/Layout.astro
interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}

const {
  title,
  description = 'Soluciones acústicas profesionales en Panamá. Paneles acústicos, tratamiento, aislamiento y diseño acústico para estudios y espacios corporativos.',
  ogImage = '/Logo/LOGO.webp',
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);

const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Acústica Superior",
  "description": description,
  "url": "https://acusticasuperior.com",
  "telephone": "+50761399247",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "PA",
    "addressLocality": "Panamá"
  },
  "sameAs": [
    "https://www.instagram.com/acusticasuperior/",
    "https://www.facebook.com/acusticasuperior"
  ]
};
---
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    <title>{title} | Acústica Superior</title>

    <!-- Open Graph -->
    <meta property="og:title" content={`${title} | Acústica Superior`} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:type" content="website" />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap"
      rel="stylesheet"
    />

    <!-- Schema.org -->
    <script type="application/ld+json" set:html={JSON.stringify(schema)} />

    <!-- Styles -->
    <link rel="stylesheet" href="/src/styles/global.css" />
  </head>
  <body>
    <slot />
    <!-- Componentes globales se agregan en Task 3 -->
  </body>
</html>
```

- [ ] **Step 3: Crear `public/robots.txt`**

```
User-agent: *
Allow: /

# Actualizar esta URL con el dominio de producción final
Sitemap: https://acusticasuperior.netlify.app/sitemap-index.xml
```

- [ ] **Step 4: Verificar build**

```bash
npm run build
```
Esperado: sin errores de TypeScript ni Astro.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/layouts/Layout.astro public/robots.txt
git commit -m "feat: tokens CSS globales, Layout base con SEO y Schema.org"
```

---

## Task 3: NavBar + Footer + WhatsAppButton + CursorCustom

**Files:**
- Create: `src/components/NavBar.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/WhatsAppButton.astro`
- Create: `src/components/CursorCustom.astro`
- Modify: `src/layouts/Layout.astro` — importar y usar los 4 componentes

- [ ] **Step 1: Crear `src/components/NavBar.astro`**

```astro
---
// src/components/NavBar.astro
const links = [
  { href: '/', label: 'Inicio' },
  { href: '/quienes-somos', label: 'Quiénes Somos' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/contacto', label: 'Contacto' },
];
---
<header id="navbar" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
  <nav class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2">
      <img src="/Logo/LOGO.webp" alt="Acústica Superior" class="h-8 w-auto" />
    </a>

    <!-- Links desktop -->
    <ul class="hidden md:flex items-center gap-8">
      {links.map(link => (
        <li>
          <a
            href={link.href}
            class="text-sm text-[var(--color-muted)] hover:text-white transition-colors duration-200"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>

    <!-- CTA desktop -->
    <a
      href="https://wa.me/50761399247"
      target="_blank"
      rel="noopener"
      class="hidden md:inline-flex items-center gap-2 bg-[var(--color-accent)] text-black text-sm font-bold px-5 py-2 rounded hover:brightness-110 transition-all"
    >
      Cotizar
    </a>

    <!-- Hamburger mobile -->
    <button
      id="menu-toggle"
      class="md:hidden flex flex-col gap-1.5 p-2"
      aria-label="Abrir menú"
    >
      <span class="w-6 h-0.5 bg-white block transition-all" id="ham-1"></span>
      <span class="w-6 h-0.5 bg-white block transition-all" id="ham-2"></span>
      <span class="w-6 h-0.5 bg-white block transition-all" id="ham-3"></span>
    </button>
  </nav>

  <!-- Mobile menu -->
  <div id="mobile-menu" class="hidden md:hidden glass mx-4 mb-4 p-6">
    <ul class="flex flex-col gap-4">
      {links.map(link => (
        <li>
          <a href={link.href} class="text-white text-base font-medium block">
            {link.label}
          </a>
        </li>
      ))}
      <li>
        <a
          href="https://wa.me/50761399247"
          target="_blank"
          class="inline-flex bg-[var(--color-accent)] text-black font-bold px-5 py-2 rounded text-sm"
        >
          Cotizar por WhatsApp
        </a>
      </li>
    </ul>
  </div>
</header>

<script>
  // NavBar blur al hacer scroll
  const navbar = document.getElementById('navbar')!;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.style.background = 'rgba(8,8,8,0.85)';
      navbar.style.backdropFilter = 'blur(12px)';
      navbar.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
    } else {
      navbar.style.background = 'transparent';
      navbar.style.backdropFilter = 'none';
      navbar.style.borderBottom = 'none';
    }
  });

  // Hamburger toggle
  const toggle = document.getElementById('menu-toggle')!;
  const mobileMenu = document.getElementById('mobile-menu')!;
  toggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
</script>
```

- [ ] **Step 2: Crear `src/components/Footer.astro`**

```astro
---
// src/components/Footer.astro
---
<footer class="border-t border-[var(--color-border)] mt-20">
  <div class="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
    <!-- Logo y descripción -->
    <div>
      <img src="/Logo/LOGO.webp" alt="Acústica Superior" class="h-10 w-auto mb-4" />
      <p class="text-[var(--color-muted)] text-sm leading-relaxed">
        Soluciones acústicas profesionales para estudios, oficinas y espacios industriales en Panamá.
      </p>
    </div>

    <!-- Links -->
    <div>
      <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Páginas</h3>
      <ul class="flex flex-col gap-2 text-[var(--color-muted)] text-sm">
        <li><a href="/quienes-somos" class="hover:text-white transition-colors">Quiénes Somos</a></li>
        <li><a href="/servicios" class="hover:text-white transition-colors">Servicios</a></li>
        <li><a href="/proyectos" class="hover:text-white transition-colors">Proyectos</a></li>
        <li><a href="/contacto" class="hover:text-white transition-colors">Contacto</a></li>
      </ul>
    </div>

    <!-- Redes sociales -->
    <div>
      <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Contacto</h3>
      <ul class="flex flex-col gap-3 text-sm">
        <li>
          <a
            href="https://wa.me/50761399247"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
          >
            WhatsApp: +507 6139 9247
          </a>
        </li>
        <li>
          <a
            href="https://www.instagram.com/acusticasuperior/"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
          >
            @acusticasuperior
          </a>
        </li>
        <li>
          <a
            href="https://www.facebook.com/acusticasuperior"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
          >
            Facebook
          </a>
        </li>
      </ul>
    </div>
  </div>

  <div class="border-t border-[var(--color-border)] px-6 py-4 text-center text-xs text-[var(--color-muted)]">
    © {new Date().getFullYear()} Acústica Superior. Todos los derechos reservados.
  </div>
</footer>
```

- [ ] **Step 3: Crear `src/components/WhatsAppButton.astro`**

```astro
---
// src/components/WhatsAppButton.astro
---
<a
  href="https://wa.me/50761399247?text=Hola,%20me%20gustaría%20solicitar%20una%20cotización"
  target="_blank"
  rel="noopener"
  aria-label="Contactar por WhatsApp"
  class="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
>
  <!-- WhatsApp SVG icon -->
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.818.487 3.52 1.338 4.992L2 22l5.15-1.322A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.051-1.107l-.29-.172-3.057.784.813-2.981-.188-.306A7.944 7.944 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
  </svg>
</a>
```

- [ ] **Step 4: Crear `src/components/CursorCustom.astro`**

```astro
---
// src/components/CursorCustom.astro
// Solo visible en dispositivos con puntero fino (desktop)
---
<div
  id="cursor-dot"
  class="pointer-events-none fixed top-0 left-0 z-[9999] w-3 h-3 rounded-full bg-white mix-blend-difference transition-transform duration-100"
  style="transform: translate(-50%, -50%)"
></div>
<div
  id="cursor-ring"
  class="pointer-events-none fixed top-0 left-0 z-[9998] w-8 h-8 rounded-full border border-white/40 mix-blend-difference"
  style="transform: translate(-50%, -50%)"
></div>

<script>
  // Solo activar en dispositivos con puntero fino (no touch)
  if (window.matchMedia('(pointer: fine)').matches) {
    const dot = document.getElementById('cursor-dot')!;
    const ring = document.getElementById('cursor-ring')!;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    // Ring sigue con lerp (suavizado)
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Expandir ring sobre elementos interactivos
    const interactives = document.querySelectorAll('a, button, [role="button"]');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width = '40px';
        ring.style.height = '40px';
        ring.style.borderColor = '#FDE817';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width = '32px';
        ring.style.height = '32px';
        ring.style.borderColor = 'rgba(255,255,255,0.4)';
      });
    });
  } else {
    // En touch: ocultar elementos del cursor
    document.getElementById('cursor-dot')?.remove();
    document.getElementById('cursor-ring')?.remove();
  }
</script>
```

- [ ] **Step 5: Agregar componentes globales en `Layout.astro`**

En el `<body>` de `src/layouts/Layout.astro`, agregar antes del `</body>`:
```astro
---
import NavBar from '../components/NavBar.astro';
import Footer from '../components/Footer.astro';
import WhatsAppButton from '../components/WhatsAppButton.astro';
import CursorCustom from '../components/CursorCustom.astro';
---
<!-- En el body: -->
<NavBar />
<main>
  <slot />
</main>
<Footer />
<WhatsAppButton />
<CursorCustom />
```

- [ ] **Step 6: Crear página de prueba temporal y verificar**

```bash
npm run dev
```
Verificar en `http://localhost:4321`: NavBar visible, Footer, botón verde WhatsApp, cursor custom en desktop.

- [ ] **Step 7: Commit**

```bash
git add src/components/NavBar.astro src/components/Footer.astro src/components/WhatsAppButton.astro src/components/CursorCustom.astro src/layouts/Layout.astro
git commit -m "feat: NavBar glassmorphism, Footer, WhatsApp flotante, cursor custom"
```

---

## Task 4: ParticlesCanvas + Hero Split + StatsStrip

**Files:**
- Create: `src/components/ParticlesCanvas.astro`
- Create: `src/components/Hero.astro`
- Create: `src/components/StatsStrip.astro`

- [ ] **Step 1: Crear `src/components/ParticlesCanvas.astro`**

```astro
---
// src/components/ParticlesCanvas.astro
// IMPORTANTE: Este componente usa window/canvas — solo funciona en cliente.
// Incluir con <ParticlesCanvas /> dentro de una sección con position:relative
---
<canvas
  id="particles-canvas"
  class="absolute inset-0 w-full h-full pointer-events-none"
  aria-hidden="true"
></canvas>

<script>
  const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
  const PARTICLE_COUNT = 60;
  const CONNECTION_DISTANCE = 120;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar conexiones
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DISTANCE) {
          const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(253, 232, 23, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Dibujar partículas
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(253, 232, 23, 0.4)';
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  resize();
  initParticles();
  draw();
  window.addEventListener('resize', () => { resize(); initParticles(); });
</script>
```

- [ ] **Step 2: Crear `src/components/Hero.astro`**

```astro
---
// src/components/Hero.astro
import ParticlesCanvas from './ParticlesCanvas.astro';
---
<section
  id="hero"
  class="relative min-h-screen flex items-center overflow-hidden pt-16"
>
  <!-- Partículas de fondo: el <script> dentro de ParticlesCanvas corre client-side
       automáticamente en Astro. No requiere client:only porque usa <canvas> nativo,
       no un framework JS. El script accede a window SOLO después del paint. -->
  <ParticlesCanvas />

  <!-- Gradiente radial de fondo -->
  <div
    class="absolute inset-0 pointer-events-none"
    style="background: radial-gradient(ellipse 80% 60% at 60% 50%, rgba(253,232,23,0.04) 0%, transparent 70%)"
  ></div>

  <div class="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">

    <!-- Columna izquierda: texto -->
    <div class="hero-content">
      <span
        class="inline-block text-xs font-semibold tracking-[0.2em] text-[var(--color-accent)] uppercase mb-6 px-3 py-1 rounded-full border border-[var(--color-border-accent)]"
      >
        Tratamiento Acústico Profesional · Panamá
      </span>

      <h1
        class="font-display text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] mb-6"
        style="font-family: 'Plus Jakarta Sans', sans-serif"
      >
        Transformamos
        <span class="block text-[var(--color-accent)]">Espacios en</span>
        Sonido.
      </h1>

      <p class="text-[var(--color-muted)] text-lg leading-relaxed mb-8 max-w-lg">
        Diseño acústico personalizado para estudios de grabación, salas de reunión y espacios corporativos. Precisión técnica con estética superior.
      </p>

      <div class="flex flex-wrap gap-4">
        <a
          href="https://wa.me/50761399247?text=Hola,%20quiero%20una%20cotización"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 bg-[var(--color-accent)] text-black font-bold px-7 py-3.5 rounded hover:brightness-110 transition-all"
        >
          Solicitar Cotización
        </a>
        <a
          href="/proyectos"
          class="inline-flex items-center gap-2 text-white border border-[var(--color-border)] px-7 py-3.5 rounded hover:border-[var(--color-border-accent)] transition-all"
        >
          Ver Proyectos ↓
        </a>
      </div>
    </div>

    <!-- Columna derecha: imagen con parallax -->
    <div
      id="hero-image"
      class="hidden lg:block relative h-[520px] rounded-2xl overflow-hidden border border-[var(--color-border)]"
    >
      <img
        src="/images/Studio1.webp"
        alt="Proyecto acústico — estudio profesional"
        class="w-full h-full object-cover"
        loading="eager"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#080808]/60 via-transparent to-transparent"></div>
    </div>

  </div>
</section>

<script>
  // Parallax hero image con GSAP ScrollTrigger
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('#hero-image', {
    y: -80,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

  // Entrada del contenido
  gsap.from('.hero-content > *', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    delay: 0.3,
  });
</script>
```

- [ ] **Step 3: Crear `src/components/StatsStrip.astro`**

```astro
---
// src/components/StatsStrip.astro
const stats = [
  { value: '12+', label: 'Proyectos Completados' },
  { value: '5',   label: 'Servicios Especializados' },
  { value: '100%', label: 'Soluciones Personalizadas' },
  { value: 'PTY', label: 'Panamá' },
];
---
<section class="border-y border-[var(--color-border)] py-8 bg-[var(--color-surface)]">
  <div class="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    {stats.map(stat => (
      <div class="stats-item">
        <div
          class="text-3xl font-black text-[var(--color-accent)] mb-1"
          style="font-family: 'Plus Jakarta Sans', sans-serif"
        >
          {stat.value}
        </div>
        <div class="text-sm text-[var(--color-muted)]">{stat.label}</div>
      </div>
    ))}
  </div>
</section>

<script>
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.stats-item', {
    y: 20,
    opacity: 0,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.stats-item',
      start: 'top 85%',
    }
  });
</script>
```

- [ ] **Step 4: Verificar en `npm run dev`**

Crear `src/pages/index.astro` temporal:
```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import StatsStrip from '../components/StatsStrip.astro';
---
<Layout title="Inicio">
  <Hero />
  <StatsStrip />
</Layout>
```
Verificar: hero split visible, partículas animadas, stats strip visible.

- [ ] **Step 5: Commit**

```bash
git add src/components/ParticlesCanvas.astro src/components/Hero.astro src/components/StatsStrip.astro src/pages/index.astro
git commit -m "feat: Hero split con partículas Canvas, parallax GSAP, StatsStrip"
```

---

## Task 5: ServiciosGrid + Página Servicios

**Files:**
- Create: `src/components/ServiciosGrid.astro`
- Create: `src/components/CTABanner.astro`
- Create: `src/pages/servicios.astro`

- [ ] **Step 1: Crear `src/components/ServiciosGrid.astro`**

```astro
---
// src/components/ServiciosGrid.astro
interface Props {
  preview?: boolean; // true = mostrar solo 3 cards para el home
}
const { preview = false } = Astro.props;

const servicios = [
  {
    imagen: '/images/Adecuación_acustica.webp',
    titulo: 'Adecuación Acústica',
    descripcion: 'Optimizamos el comportamiento sonoro de tu espacio interior mediante análisis y tratamiento personalizado.',
    href: '/servicios#adecuacion',
  },
  {
    imagen: '/images/Aislamiento_y_bloqueo_acustico.webp',
    titulo: 'Aislamiento y Bloqueo Acústico',
    descripcion: 'Barreras técnicas que controlan la transmisión de sonido entre ambientes para máxima privacidad.',
    href: '/servicios#aislamiento',
  },
  {
    imagen: '/images/Balance_frecuencial.webp',
    titulo: 'Balance Frecuencial',
    descripcion: 'Corrección de frecuencias para lograr una respuesta plana y fiel en estudios de grabación y mezcla.',
    href: '/servicios#balance',
  },
  {
    imagen: '/images/Control_de_Ruido_Industrial.webp',
    titulo: 'Control de Ruido Industrial',
    descripcion: 'Soluciones de ingeniería acústica para entornos industriales, cumpliendo normativas de seguridad laboral.',
    href: '/servicios#ruido',
  },
  {
    imagen: '/images/Medición_y_diseño_acústico.webp',
    titulo: 'Medición y Diseño Acústico',
    descripcion: 'Diagnóstico profesional con equipos de medición calibrados y diseño de soluciones a medida.',
    href: '/servicios#medicion',
  },
];

const items = preview ? servicios.slice(0, 3) : servicios;
---
<div class="servicios-grid-wrapper max-w-7xl mx-auto px-6">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map((s, i) => (
      <a
        href={s.href}
        class:list={[
          'service-card glass glass-hover block overflow-hidden group',
          // El 4to y 5to card en desktop se centran (grid 3+2)
          !preview && i === 3 ? 'lg:col-start-1 lg:col-end-2' : '',
          !preview && i === 4 ? 'lg:col-start-2 lg:col-end-3' : '',
        ]}
        style={!preview && i >= 3 ? 'margin: 0 auto; width: 100%' : ''}
      >
        <div class="relative h-48 overflow-hidden">
          <img
            src={s.imagen}
            alt={s.titulo}
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#080808]/80 via-transparent to-transparent"></div>
        </div>
        <div class="p-6">
          <div class="w-8 h-0.5 bg-[var(--color-accent)] mb-3"></div>
          <h3
            class="text-white font-bold text-lg mb-2 group-hover:text-[var(--color-accent)] transition-colors"
            style="font-family: 'Plus Jakarta Sans', sans-serif"
          >
            {s.titulo}
          </h3>
          <p class="text-[var(--color-muted)] text-sm leading-relaxed">{s.descripcion}</p>
          <div class="mt-4 text-[var(--color-accent)] text-sm font-semibold flex items-center gap-1">
            Ver más <span class="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </div>
        </div>
      </a>
    ))}
  </div>
</div>

<script>
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.service-card', {
    y: 40,
    opacity: 0,
    stagger: 0.1,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.service-card',
      start: 'top 85%',
    }
  });
</script>
```

- [ ] **Step 2: Crear `src/components/CTABanner.astro`**

```astro
---
// src/components/CTABanner.astro
---
<section class="py-20 relative overflow-hidden">
  <div
    class="absolute inset-0"
    style="background: linear-gradient(135deg, rgba(253,232,23,0.04) 0%, transparent 60%)"
  ></div>
  <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
    <p class="text-[var(--color-accent)] text-sm font-semibold tracking-widest uppercase mb-4">
      ¿Listo para transformar tu espacio?
    </p>
    <h2
      class="text-4xl md:text-5xl font-black text-white mb-6"
      style="font-family: 'Plus Jakarta Sans', sans-serif"
    >
      El sonido perfecto está<br />a un mensaje de distancia.
    </h2>
    <p class="text-[var(--color-muted)] text-lg mb-10">
      Contáctanos por WhatsApp para una consulta inicial sin costo.
    </p>
    <a
      href="https://wa.me/50761399247?text=Hola,%20me%20gustaría%20solicitar%20una%20cotización"
      target="_blank"
      rel="noopener"
      class="inline-flex items-center gap-3 bg-[var(--color-accent)] text-black font-bold text-lg px-10 py-4 rounded hover:brightness-110 hover:scale-105 transition-all"
    >
      Solicitar Cotización →
    </a>
  </div>
</section>
```

- [ ] **Step 3: Crear `src/pages/servicios.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import HeroInterno from '../components/HeroInterno.astro';
import ServiciosGrid from '../components/ServiciosGrid.astro';
import CTABanner from '../components/CTABanner.astro';
---
<Layout
  title="Servicios"
  description="Servicios de tratamiento acústico profesional en Panamá: adecuación acústica, aislamiento, balance frecuencial, control de ruido y medición acústica."
>
  <HeroInterno
    titulo="Nuestros Servicios"
    subtitulo="Soluciones acústicas diseñadas con precisión técnica para cada tipo de espacio."
  />
  <section class="py-20">
    <ServiciosGrid />
  </section>
  <CTABanner />
</Layout>
```

> **⚠️ Dependencia:** `HeroInterno` se crea en Task 7. Las páginas que lo usan (`servicios`, `proyectos`, `quienes-somos`, `contacto`) solo pueden probarse completamente después de completar Task 7. Para pruebas tempranas, sustituir `<HeroInterno ... />` con `<div class="h-40 pt-20 px-6"><h1 class="text-white text-4xl font-black">Servicios</h1></div>`.

- [ ] **Step 4: Verificar en `npm run dev`**

Navegar a `http://localhost:4321/servicios`. Verificar cards con imágenes reales, hover con borde amarillo.

- [ ] **Step 5: Commit**

```bash
git add src/components/ServiciosGrid.astro src/components/CTABanner.astro src/pages/servicios.astro
git commit -m "feat: ServiciosGrid glass 3+2 con stagger GSAP, página servicios"
```

---

## Task 6: ProyectosMasonry + Lightbox + Página Proyectos

**Files:**
- Create: `src/components/ProyectosMasonry.astro`
- Create: `src/components/Lightbox.astro`
- Create: `src/pages/proyectos.astro`

- [ ] **Step 1: Crear `src/components/Lightbox.astro`**

```astro
---
// src/components/Lightbox.astro
---
<!-- Overlay del lightbox -->
<div
  id="lightbox"
  class="fixed inset-0 z-[100] bg-black/95 hidden items-center justify-center"
  role="dialog"
  aria-modal="true"
  aria-label="Visor de imagen"
>
  <button
    id="lightbox-close"
    class="absolute top-6 right-6 text-white/60 hover:text-white text-3xl leading-none"
    aria-label="Cerrar"
  >
    ×
  </button>

  <button
    id="lightbox-prev"
    class="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 text-white flex items-center justify-center hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
    aria-label="Anterior"
  >
    ←
  </button>

  <img
    id="lightbox-img"
    src=""
    alt=""
    class="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
  />

  <button
    id="lightbox-next"
    class="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 text-white flex items-center justify-center hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
    aria-label="Siguiente"
  >
    →
  </button>

  <div
    id="lightbox-counter"
    class="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/50"
  ></div>
</div>

<script>
  import gsap from 'gsap';

  const lightbox = document.getElementById('lightbox')!;
  const img = document.getElementById('lightbox-img') as HTMLImageElement;
  const counter = document.getElementById('lightbox-counter')!;

  let images: { src: string; alt: string }[] = [];
  let current = 0;

  function open(index: number) {
    current = index;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    updateImage();
    gsap.fromTo(img, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
    document.body.style.overflow = 'hidden';
  }

  function close() {
    gsap.to(lightbox, {
      opacity: 0, duration: 0.2, onComplete: () => {
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
        lightbox.style.opacity = '1';
        document.body.style.overflow = '';
      }
    });
  }

  function updateImage() {
    img.src = images[current].src;
    img.alt = images[current].alt;
    counter.textContent = `${current + 1} / ${images.length}`;
  }

  document.getElementById('lightbox-close')!.addEventListener('click', close);
  document.getElementById('lightbox-prev')!.addEventListener('click', () => {
    current = (current - 1 + images.length) % images.length;
    gsap.fromTo(img, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.25 });
    updateImage();
  });
  document.getElementById('lightbox-next')!.addEventListener('click', () => {
    current = (current + 1) % images.length;
    gsap.fromTo(img, { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.25 });
    updateImage();
  });

  // Teclado
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') document.getElementById('lightbox-prev')!.click();
    if (e.key === 'ArrowRight') document.getElementById('lightbox-next')!.click();
  });

  // Clic fuera de la imagen cierra
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // API pública para ProyectosMasonry
  (window as any).openLightbox = (index: number, imgs: { src: string; alt: string }[]) => {
    images = imgs;
    open(index);
  };
</script>
```

- [ ] **Step 2: Crear `src/components/ProyectosMasonry.astro`**

```astro
---
// src/components/ProyectosMasonry.astro
import Lightbox from './Lightbox.astro';

const proyectos = Array.from({ length: 12 }, (_, i) => ({
  src: `/images/Studio${i + 1}.webp`,
  alt: `Studio ${i + 1} — Proyecto acústico Acústica Superior`,
  label: `Studio ${i + 1}`,
}));
---
<Lightbox />

<section class="py-20">
  <div class="max-w-7xl mx-auto px-6">
    <!-- CSS Masonry con columns -->
    <div
      class="masonry-grid"
      style="column-count: 3; column-gap: 16px;"
    >
      {proyectos.map((p, i) => (
        <button
          class="proyecto-item w-full mb-4 block overflow-hidden rounded-xl border border-[var(--color-border)] cursor-pointer group relative"
          onclick={`window.openLightbox(${i}, window.__proyectos)`}
          aria-label={`Ver ${p.label}`}
        >
          <img
            src={p.src}
            alt={p.alt}
            class="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <span class="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-semibold">
              {p.label} ↗
            </span>
          </div>
        </button>
      ))}
    </div>
  </div>
</section>

<style>
  @media (max-width: 767px) {
    .masonry-grid { column-count: 1 !important; }
  }
  @media (min-width: 768px) and (max-width: 1023px) {
    .masonry-grid { column-count: 2 !important; }
  }
</style>

<script define:vars={{ proyectos }}>
  // Pasar datos al lightbox
  window.__proyectos = proyectos;

  // Stagger de entrada GSAP
  import('gsap').then(({ default: gsap }) => {
    import('gsap/ScrollTrigger').then(({ default: ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from('.proyecto-item', {
        y: 30,
        opacity: 0,
        stagger: 0.06,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.masonry-grid',
          start: 'top 85%',
        }
      });
    });
  });
</script>
```

- [ ] **Step 3: Crear `src/pages/proyectos.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import HeroInterno from '../components/HeroInterno.astro';
import ProyectosMasonry from '../components/ProyectosMasonry.astro';
import CTABanner from '../components/CTABanner.astro';
---
<Layout
  title="Proyectos"
  description="Proyectos de tratamiento acústico realizados por Acústica Superior en Panamá: estudios de grabación, salas corporativas y espacios industriales."
>
  <HeroInterno
    titulo="Nuestros Proyectos"
    subtitulo="Cada espacio tiene su propia acústica. Aquí están algunas de nuestras transformaciones."
  />
  <ProyectosMasonry />
  <CTABanner />
</Layout>
```

- [ ] **Step 4: Verificar en `npm run dev`**

Ir a `http://localhost:4321/proyectos`. Verificar: masonry 3 cols, clic abre lightbox, Escape cierra, flechas navegan.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProyectosMasonry.astro src/components/Lightbox.astro src/pages/proyectos.astro
git commit -m "feat: Masonry CSS 3/2/1 cols, Lightbox GSAP con teclado y navegación"
```

---

## Task 7: HeroInterno + Páginas Quiénes Somos y Contacto

**Files:**
- Create: `src/components/HeroInterno.astro`
- Create: `src/components/ContactoForm.astro`
- Create: `src/pages/quienes-somos.astro`
- Create: `src/pages/contacto.astro`

- [ ] **Step 1: Crear `src/components/HeroInterno.astro`**

```astro
---
// src/components/HeroInterno.astro
interface Props {
  titulo: string;
  subtitulo?: string;
  imagen?: string;
}
const {
  titulo,
  subtitulo,
  imagen = '/images/Studio3.webp',
} = Astro.props;
---
<section class="relative h-64 md:h-80 flex items-end pb-12 overflow-hidden">
  <div class="absolute inset-0">
    <img
      src={imagen}
      alt=""
      class="w-full h-full object-cover"
      loading="eager"
    />
    <div
      class="absolute inset-0"
      style="background: linear-gradient(to top, #080808 20%, rgba(8,8,8,0.7) 60%, rgba(8,8,8,0.4) 100%)"
    ></div>
  </div>
  <div class="relative z-10 max-w-7xl mx-auto px-6 w-full">
    <div class="w-12 h-0.5 bg-[var(--color-accent)] mb-4"></div>
    <h1
      class="text-4xl md:text-5xl font-black text-white"
      style="font-family: 'Plus Jakarta Sans', sans-serif"
    >
      {titulo}
    </h1>
    {subtitulo && (
      <p class="text-[var(--color-muted)] mt-3 text-lg max-w-2xl">{subtitulo}</p>
    )}
  </div>
</section>
```

- [ ] **Step 2: Crear `src/components/ContactoForm.astro`**

```astro
---
// src/components/ContactoForm.astro
// IMPORTANTE: data-netlify="true" es requerido para Netlify Forms
---
<form
  name="contacto"
  method="POST"
  data-netlify="true"
  netlify-honeypot="bot-field"
  class="space-y-6"
>
  <!-- Honeypot anti-spam -->
  <input type="hidden" name="form-name" value="contacto" />
  <p class="hidden">
    <label>No llenar: <input name="bot-field" /></label>
  </p>

  <div>
    <label for="nombre" class="block text-sm font-medium text-[var(--color-muted)] mb-2">
      Nombre completo *
    </label>
    <input
      type="text"
      id="nombre"
      name="nombre"
      required
      class="w-full glass px-4 py-3 text-white placeholder-[var(--color-muted)] outline-none focus:border-[var(--color-border-accent)] transition-colors"
      placeholder="Tu nombre"
    />
  </div>

  <div>
    <label for="email" class="block text-sm font-medium text-[var(--color-muted)] mb-2">
      Correo electrónico *
    </label>
    <input
      type="email"
      id="email"
      name="email"
      required
      class="w-full glass px-4 py-3 text-white placeholder-[var(--color-muted)] outline-none focus:border-[var(--color-border-accent)] transition-colors"
      placeholder="tucorreo@email.com"
    />
  </div>

  <div>
    <label for="mensaje" class="block text-sm font-medium text-[var(--color-muted)] mb-2">
      Mensaje *
    </label>
    <textarea
      id="mensaje"
      name="mensaje"
      required
      rows="5"
      class="w-full glass px-4 py-3 text-white placeholder-[var(--color-muted)] outline-none focus:border-[var(--color-border-accent)] transition-colors resize-none"
      placeholder="Cuéntanos sobre tu proyecto..."
    ></textarea>
  </div>

  <button
    type="submit"
    class="w-full bg-[var(--color-accent)] text-black font-bold py-4 rounded hover:brightness-110 transition-all text-lg"
  >
    Enviar Mensaje
  </button>
</form>
```

- [ ] **Step 3: Crear `src/pages/quienes-somos.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import HeroInterno from '../components/HeroInterno.astro';
import CTABanner from '../components/CTABanner.astro';

const valores = [
  {
    icon: '◈',
    titulo: 'Precisión Técnica',
    descripcion: 'Utilizamos metodologías de medición acústica calibradas para garantizar resultados verificables y reproducibles.',
  },
  {
    icon: '◇',
    titulo: 'Estética Superior',
    descripcion: 'Diseñamos soluciones que integran la técnica con la estética, mejorando la apariencia de cada espacio.',
  },
  {
    icon: '◆',
    titulo: 'Funcionalidad Total',
    descripcion: 'Cada solución está diseñada para el uso real del espacio, priorizando la funcionalidad a largo plazo.',
  },
];
---
<Layout
  title="Quiénes Somos"
  description="Acústica Superior: empresa panameña especializada en soluciones acústicas profesionales, tratamiento de espacios y diseño acústico personalizado."
>
  <HeroInterno
    titulo="Quiénes Somos"
    subtitulo="Diseñamos el sonido de tu espacio con precisión técnica y estética superior."
    imagen="/images/Studio5.webp"
  />

  <section class="py-20">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        <p class="text-[var(--color-accent)] text-sm font-semibold tracking-widest uppercase mb-4">Nuestra Historia</p>
        <h2
          class="text-3xl md:text-4xl font-black text-white mb-6"
          style="font-family: 'Plus Jakarta Sans', sans-serif"
        >
          Especialistas en acústica<br />con sede en Panamá.
        </h2>
        <div class="space-y-4 text-[var(--color-muted)] leading-relaxed">
          <p>
            Acústica Superior nació con la misión de ofrecer soluciones acústicas personalizadas de nivel internacional en el mercado panameño. Combinamos ingeniería de precisión con diseño de interiores para transformar cualquier espacio.
          </p>
          <p>
            Trabajamos con estudios de grabación profesionales, salas de reunión corporativas, espacios de podcasting, y entornos industriales que requieren control de ruido técnico.
          </p>
          <p>
            Cada proyecto comienza con una medición diagnóstica y termina con una solución completamente instalada y verificada, garantizando los resultados prometidos.
          </p>
        </div>
      </div>

      <div class="relative h-80 lg:h-full min-h-[300px] rounded-2xl overflow-hidden border border-[var(--color-border)]">
        <img
          src="/images/Studio7.webp"
          alt="Equipo Acústica Superior trabajando en proyecto"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  </section>

  <!-- Valores -->
  <section class="py-20 border-t border-[var(--color-border)]">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-12">
        <p class="text-[var(--color-accent)] text-sm font-semibold tracking-widest uppercase mb-3">Nuestros Valores</p>
        <h2
          class="text-3xl md:text-4xl font-black text-white"
          style="font-family: 'Plus Jakarta Sans', sans-serif"
        >
          Lo que nos define
        </h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {valores.map(v => (
          <div class="valor-card glass glass-hover p-8 text-center">
            <div class="text-4xl text-[var(--color-accent)] mb-4">{v.icon}</div>
            <h3
              class="text-white font-bold text-xl mb-3"
              style="font-family: 'Plus Jakarta Sans', sans-serif"
            >
              {v.titulo}
            </h3>
            <p class="text-[var(--color-muted)] text-sm leading-relaxed">{v.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <CTABanner />
</Layout>

<script>
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.valor-card', {
    y: 40, opacity: 0, stagger: 0.15, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: '.valor-card', start: 'top 85%' }
  });
</script>
```

- [ ] **Step 4: Crear `src/pages/contacto.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import HeroInterno from '../components/HeroInterno.astro';
import ContactoForm from '../components/ContactoForm.astro';
---
<Layout
  title="Contacto"
  description="Contacta a Acústica Superior para solicitar una cotización de tratamiento acústico en Panamá. WhatsApp, Instagram y formulario de contacto."
>
  <HeroInterno
    titulo="Contáctanos"
    subtitulo="Cuéntanos sobre tu proyecto y te respondemos en menos de 24 horas."
    imagen="/images/Studio9.webp"
  />

  <section class="py-20">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
      <!-- Formulario -->
      <div>
        <h2
          class="text-2xl font-black text-white mb-8"
          style="font-family: 'Plus Jakarta Sans', sans-serif"
        >
          Envíanos un mensaje
        </h2>
        <ContactoForm />
      </div>

      <!-- Datos de contacto -->
      <div>
        <h2
          class="text-2xl font-black text-white mb-8"
          style="font-family: 'Plus Jakarta Sans', sans-serif"
        >
          O encuéntranos aquí
        </h2>
        <div class="space-y-6">
          <a
            href="https://wa.me/50761399247"
            target="_blank"
            rel="noopener"
            class="flex items-start gap-4 glass glass-hover p-5 group"
          >
            <div class="w-10 h-10 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center flex-shrink-0 text-lg">
              📱
            </div>
            <div>
              <div class="text-white font-semibold mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                WhatsApp
              </div>
              <div class="text-[var(--color-muted)] text-sm">+507 6139 9247</div>
              <div class="text-[var(--color-muted)] text-xs mt-1">Respuesta rápida · Lunes a Sábado</div>
            </div>
          </a>

          <a
            href="https://www.instagram.com/acusticasuperior/"
            target="_blank"
            rel="noopener"
            class="flex items-start gap-4 glass glass-hover p-5 group"
          >
            <div class="w-10 h-10 rounded-lg bg-[var(--color-border-accent)] flex items-center justify-center flex-shrink-0 text-lg">
              📷
            </div>
            <div>
              <div class="text-white font-semibold mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                Instagram
              </div>
              <div class="text-[var(--color-muted)] text-sm">@acusticasuperior</div>
            </div>
          </a>

          <a
            href="https://www.facebook.com/acusticasuperior"
            target="_blank"
            rel="noopener"
            class="flex items-start gap-4 glass glass-hover p-5 group"
          >
            <div class="w-10 h-10 rounded-lg bg-[var(--color-border)] flex items-center justify-center flex-shrink-0 text-lg">
              💬
            </div>
            <div>
              <div class="text-white font-semibold mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                Facebook
              </div>
              <div class="text-[var(--color-muted)] text-sm">Acústica Superior</div>
            </div>
          </a>

          <div class="glass p-5">
            <div class="text-[var(--color-accent)] text-sm font-semibold mb-2">📍 Ubicación</div>
            <div class="text-[var(--color-muted)] text-sm">Panamá, República de Panamá</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</Layout>
```

- [ ] **Step 5: Verificar todas las páginas en `npm run dev`**

Navegar a `/quienes-somos` y `/contacto`. Verificar formulario, cards de valores, datos de contacto.

- [ ] **Step 6: Commit**

```bash
git add src/components/HeroInterno.astro src/components/ContactoForm.astro src/pages/quienes-somos.astro src/pages/contacto.astro
git commit -m "feat: HeroInterno, página Quiénes Somos, página Contacto con Netlify Forms"
```

---

## Task 8: Página de Inicio Completa

**Files:**
- Modify: `src/pages/index.astro` — ensamblado final

- [ ] **Step 1: Reemplazar `src/pages/index.astro` con versión completa**

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import StatsStrip from '../components/StatsStrip.astro';
import ServiciosGrid from '../components/ServiciosGrid.astro';
import ProyectosMasonry from '../components/ProyectosMasonry.astro';
import CTABanner from '../components/CTABanner.astro';
---
<Layout
  title="Inicio"
  description="Acústica Superior: soluciones de tratamiento acústico profesional en Panamá. Paneles acústicos, aislamiento, balance frecuencial y diseño acústico para estudios y espacios corporativos."
>
  <Hero />
  <StatsStrip />

  <!-- Preview Servicios -->
  <section class="py-20">
    <div class="max-w-7xl mx-auto px-6 mb-12 flex items-end justify-between">
      <div>
        <p class="text-[var(--color-accent)] text-sm font-semibold tracking-widest uppercase mb-3">
          Lo que hacemos
        </p>
        <h2
          class="text-3xl md:text-4xl font-black text-white"
          style="font-family: 'Plus Jakarta Sans', sans-serif"
        >
          Nuestros Servicios
        </h2>
      </div>
      <a
        href="/servicios"
        class="hidden md:inline-flex items-center gap-2 text-[var(--color-accent)] text-sm font-semibold hover:gap-3 transition-all"
      >
        Ver todos →
      </a>
    </div>
    <ServiciosGrid preview={true} />
  </section>

  <!-- Preview Proyectos -->
  <section class="py-20 border-t border-[var(--color-border)]">
    <div class="max-w-7xl mx-auto px-6 mb-12 flex items-end justify-between">
      <div>
        <p class="text-[var(--color-accent)] text-sm font-semibold tracking-widest uppercase mb-3">
          Nuestro trabajo
        </p>
        <h2
          class="text-3xl md:text-4xl font-black text-white"
          style="font-family: 'Plus Jakarta Sans', sans-serif"
        >
          Proyectos Realizados
        </h2>
      </div>
      <a
        href="/proyectos"
        class="hidden md:inline-flex items-center gap-2 text-[var(--color-accent)] text-sm font-semibold hover:gap-3 transition-all"
      >
        Ver galería completa →
      </a>
    </div>
    <!-- Solo 4 fotos en preview del home -->
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(n => (
        <a
          href="/proyectos"
          class="relative overflow-hidden rounded-xl border border-[var(--color-border)] group aspect-square"
        >
          <img
            src={`/images/Studio${n}.webp`}
            alt={`Studio ${n}`}
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all"></div>
        </a>
      ))}
    </div>
    <div class="text-center mt-8 md:hidden">
      <a
        href="/proyectos"
        class="inline-flex items-center gap-2 text-[var(--color-accent)] text-sm font-semibold border border-[var(--color-border-accent)] px-6 py-2 rounded-full"
      >
        Ver galería completa →
      </a>
    </div>
  </section>

  <CTABanner />
</Layout>
```

- [ ] **Step 2: Verificar la página de inicio completa**

```bash
npm run dev
```
Verificar: hero → stats → 3 servicios preview → 4 proyectos preview → CTA. Scroll completo sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: página de inicio completa con todas las secciones ensambladas"
```

---

## Task 9: CI/CD — GitHub Actions + Netlify

**Files:**
- Create: `.github/workflows/preview.yml`
- Verify: `netlify.toml` (ya creado en Task 1)

- [ ] **Step 1: Crear `.github/workflows/preview.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build for GitHub Pages
        run: npm run build
        env:
          GITHUB_PAGES: 'true'

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: ''
```

- [ ] **Step 2: Verificar que el build de GitHub Pages funciona localmente**

```bash
GITHUB_PAGES=true npm run build
```
Esperado: build exitoso sin errores. Los assets deben referenciar `/Acustica_Superior_DEMO/`.

- [ ] **Step 3: Verificar `netlify.toml`**

Debe contener (ya creado en Task 1):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

- [ ] **Step 4: Commit y push**

```bash
git add .github/workflows/preview.yml netlify.toml
git commit -m "ci: GitHub Actions para GitHub Pages preview + config Netlify"
git push origin main
```

- [ ] **Step 5: Verificar en GitHub**

Ir a GitHub → Actions → verificar que el workflow corre exitosamente. Tras completar, ir a Settings → Pages → verificar URL de preview.

**Netlify (producción):** Netlify detecta automáticamente el `netlify.toml` al conectar el repo desde el dashboard. No requiere workflow adicional. Pasos:
1. Ir a `https://app.netlify.com` → "Add new site" → "Import from Git"
2. Seleccionar el repo `abrinay1997-stack/Acustica_Superior_DEMO`
3. Netlify detecta `npm run build` y `dist/` automáticamente desde `netlify.toml`
4. Deploy automático en cada push a `main`
5. Netlify Forms activo en el primer deploy con Netlify Forms detectadas

---

## Task 10: Build Final y Verificación

**Files:**
- Verify: todos los archivos anteriores

- [ ] **Step 1: Build de producción completo**

```bash
npm run build
```
Esperado: 0 errores, 0 warnings críticos.

- [ ] **Step 2: Preview del build**

```bash
npm run preview
```
Navegar a `http://localhost:4321` y verificar todas las páginas.

- [ ] **Step 3: Checklist de calidad**

Verificar cada punto:
- [ ] NavBar sticky visible y hamburger funciona en mobile (375px)
- [ ] Hero split en desktop, apilado en mobile
- [ ] Partículas Canvas animadas en el hero
- [ ] Parallax de la imagen del hero al hacer scroll
- [ ] StatsStrip con fade-in al entrar en viewport
- [ ] Cards de servicios con hover borde amarillo
- [ ] Masonry 3/2/1 columnas según viewport
- [ ] Lightbox se abre, navega y cierra con Escape
- [ ] Formulario de contacto renderiza (validación no activa sin Netlify)
- [ ] Botón WhatsApp flotante visible en todas las páginas
- [ ] Cursor custom en desktop, oculto en touch
- [ ] Footer con links correctos a redes sociales
- [ ] Links de redes abren en nueva pestaña

- [ ] **Step 4: Build para GitHub Pages**

```bash
GITHUB_PAGES=true npm run build
```
Esperado: build exitoso con base path `/Acustica_Superior_DEMO`.

- [ ] **Step 5: Commit final**

```bash
git add -A
git commit -m "feat: sitio web Acústica Superior completo — listo para producción"
git push origin main
```

---

---

## Task 11: CLAUDE.md y Bitácora Agentica ✅ (Ya completado en sesión de diseño)

**Files:**
- `CLAUDE.md` — instrucciones del proyecto, stack, agentes, checklist de build
- `.claude/errors-learned.md` — bitácora de errores aprendidos (vacía al inicio)

> Estos archivos ya fueron creados antes del inicio de la implementación. Verificar que existen:

- [ ] **Step 1: Verificar existencia**

```bash
ls CLAUDE.md .claude/errors-learned.md
```
Esperado: ambos archivos presentes.

- [ ] **Step 2: Commit si no están en git**

```bash
git add CLAUDE.md .claude/errors-learned.md
git commit -m "docs: CLAUDE.md con instrucciones del proyecto y bitácora agentica"
```

---

## Referencia Rápida

| Comando | Uso |
|---------|-----|
| `npm run dev` | Desarrollo en localhost:4321 |
| `npm run build` | Build producción (Netlify) |
| `GITHUB_PAGES=true npm run build` | Build con base path para GitHub Pages |
| `npm run preview` | Preview del build estático |

**Contacto cliente:**
- WhatsApp: `https://wa.me/50761399247`
- Instagram: `https://www.instagram.com/acusticasuperior/`
- Facebook: `https://www.facebook.com/acusticasuperior`

**Assets en `public/images/`:**
- Servicios: `Adecuación_acustica.webp`, `Aislamiento_y_bloqueo_acustico.webp`, `Balance_frecuencial.webp`, `Control_de_Ruido_Industrial.webp`, `Medición_y_diseño_acústico.webp`
- Proyectos: `Studio1.webp` … `Studio12.webp`
- Logo: `Logo/LOGO.webp`
