# ☕ Terroso Café & Restaurante — Frontend Showcase & Demo

[![Demo Showcase](https://img.shields.io/badge/Tipo-Demo_%2F_Portafolio_Frontend-F59E0B?style=flat-square)](#)
[![Astro](https://img.shields.io/badge/Astro-5.0-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![WCAG](https://img.shields.io/badge/WCAG_2.2-AA_Compliant-2E7D32?style=flat-square)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![SEO](https://img.shields.io/badge/SEO_Google-2026_Ready-EA4335?style=flat-square&logo=google&logoColor=white)](https://developers.google.com/search)

> [!NOTE]
> **Proyecto Conceptual / Demo de Portafolio**: Este sitio web representa una demostración técnica de nivel Senior Frontend para un establecimiento gastronómico ficticio (**Terroso Café & Restaurante**). Fue concebido, diseñado y construido como pieza de exhibición para ilustrar soluciones reales a retos modernos de desarrollo web: arquitectura estática de máximo rendimiento (Astro 5 SSG), accesibilidad web estricta (**WCAG 2.2 AA**), escalado proporcional en pantallas de ultra-alta definición (**1080p, 2K, Ultrawide 21:9 y 4K**) y SEO técnico de vanguardia.

---

## 🎯 Propósito del Proyecto & Habilidades Demostradas

Este proyecto sirve como caso de estudio práctico de ingeniería frontend, demostrando:

1. **Arquitectura Zero-Bloat (Astro 5)**: Eliminación de frameworks de cliente pesados para una landing comercial. El 100% de la interactividad se resuelve mediante Vanilla JavaScript y TypeScript con Web APIs nativas, logrando puntuaciones de 100 en Core Web Vitals y carga casi instantánea.
2. **Escalado Proporcional Dinámico (Layout High-DPI)**: Implementación de una estrategia CSS basada en la raíz `html { font-size: clamp(...) }` que hace crecer armónicamente tipografías, paddings, radios e iconos en resoluciones grandes (1920x1080 hasta 3840x2160 y pantallas ultra-panorámicas 21:9) sin romper la experiencia en móviles ni recurrir a deformaciones con `transform: scale()`.
3. **Accesibilidad Real (WCAG 2.2 Nivel AA)**: Manejo riguroso de foco por teclado (*focus trap* en menú modal móvil con aislamiento `inert`, botones flotantes con `tabindex` dinámico, carrusel continuo con pausa por foco y pestañas WAI-ARIA navegables por flechas).
4. **Diseño Editorial & Micro-interacciones de Lujo**: Identidad visual basada en una paleta de tonos tierra (*Earthy Palette*), tipografía combinada (*Playfair Display* + *Plus Jakarta Sans*) y cinemática continua a 55px/s con `requestAnimationFrame`.
5. **Contextualización Comercial Local**: Modelado de flujos de negocio reales para hostelería: reservas interactivas con WhatsApp sin dependencias de backend, cálculo de horario local en vivo (`America/Caracas`) y cumplimiento de transparencia de precios (USD/VES a tasa oficial BCV).

---

## 🌟 Módulos y Características Clave

### 1. Experiencia Gastronómica & Reserva Interactiva
- **Catálogo de Temporada con Filtros WAI-ARIA**: Pestañas de categorías (Desayunos, Café, Brunch, Panadería) con soporte de teclado accesible (flechas `ArrowLeft` / `ArrowRight`, `Home` y `End`).
- **Configurador Dinámico para WhatsApp**: Selector en tiempo real del número de personas, momento del día y área (Terraza Jardín o Salón). Construye en el cliente una URL codificada para abrir un chat directo de reserva con el anfitrión.
- **Horario Dinámico en Vivo (Zona Caracas)**: Cálculo automático del horario del día según la hora local de Venezuela (`America/Caracas`), indicando si el local ficticio se encuentra abierto o cerrado.
- **Transparencia Comercial y Moneda Local (BCV)**: Indicación explícita de precios referenciales en USD ($) con recepción de pagos en Bolívares (VES) a la tasa oficial del Banco Central de Venezuela, Pago Móvil y divisas en efectivo.

### 2. Accesibilidad Avanzada (WCAG 2.2 AA)
- **Navegación Móvil con Focus Trap**: Al desplegar el menú hamburguesa, `<main>` y `<footer>` se aíslan con el atributo `inert`. El tabulador queda confinado dentro del menú y el scroll de fondo se bloquea (`overflow-hidden`).
- **Botón "Volver Arriba" con Gestión de Foco**: `#scroll-to-top` permanece con `tabindex="-1"` y `aria-hidden="true"` mientras está oculto visualmente, haciéndose accesible por teclado solo cuando `scrollY > 400px`.
- **Navegación por Anclas y Botón "Atrás"**: Los enlaces internos (`#menu`, `#reservas`, etc.) actualizan la barra de direcciones mediante `history.pushState(null, '', '#' + targetId)` y transfieren el foco por teclado sin recargar la página.
- **Pausa Accesible en Galería**: El carrusel continuo se pausa automáticamente cuando cualquier elemento interior recibe el foco por teclado (`focusin`/`focusout`).

### 3. SEO Técnico Google 2026 & Datos Estructurados
- **Schema.org Graph Completo (`CafeOrCoffeeShop`)**: Incorpora geolocalización satelital precisa en Altamira, Caracas (`10.4965, -66.8524`), horarios por día de la semana, rangos de precio, teléfono, métodos de pago aceptados y atributos (Pet Friendly, Terraza, WiFi de alta velocidad).
- **Metadatos Sociales & PWA**: Open Graph optimizado con locale `es_VE`, Twitter Cards en formato `summary_large_image`, manifiesto web (`manifest.webmanifest`) e icono SVG escalable.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Justificación / Propósito |
| :--- | :--- | :--- |
| **Framework** | **Astro 5 (SSG)** | Generación estática pura. Produce cero JavaScript innecesario en el cliente y ofrece tiempos de carga inicial casi instantáneos (TTFB < 50ms). |
| **Estilos & Tokens** | **Tailwind CSS v4** | Utiliza `@theme` con variables nativas de color y espaciado, sistema de diseño centralizado sin sobrecarga de runtime. |
| **Tipografía** | **Google Fonts** | *Playfair Display* (serif editorial de alta gama para títulos) y *Plus Jakarta Sans* (sans-serif contemporánea para lectura cómoda). |
| **Iconografía** | **Material Symbols Outlined** | Glifos vectoriales ligeros configurados con `display=swap`. |
| **Lógica de Cliente** | **TypeScript / Vanilla JS** | Controladores nativos con `IntersectionObserver`, `requestAnimationFrame`, `Intl.NumberFormat` y `history.pushState`. Cero librerías pesadas. |
| **Imágenes** | **astro:assets** | Conversión automática de recursos gráficos a formato moderno WebP con densidades de pantalla `1x` y `2x`. |

---

## ✨ Sistema de Animaciones y Micro-interacciones

El sitio cuenta con una coreografía visual diseñada para transmitir calma y sofisticación artesanal:

1. **Aparición Progresiva por Scroll (`[data-animate]`)**:
   - Elementos observados mediante `IntersectionObserver` que entran suavemente en pantalla con una curva Bézier personalizada: `cubic-bezier(0.16, 1, 0.3, 1)`.
   - Modos disponibles: fade-in vertical, desvanecimiento puro (`fade`), y desplazamientos laterales (`slide-left`, `slide-right`).
2. **Carrusel Infinito Continuo (Galería Gastronómica)**:
   - Motor cinemático propio impulsado por `requestAnimationFrame` que desplaza las fotografías a una velocidad constante y relajante de **~55px/s**.
   - Soporta interacción táctil completa en smartphones (arrastre libre, detección de gesto horizontal vs scroll vertical) y arrastre con cursor de ratón en escritorio.
   - Se pausa automáticamente al interactuar con el mouse (*hover*) o al navegar con el teclado (*focus*).
3. **Contadores Numéricos con Desaceleración Cúbica (`ease-out`)**:
   - Las cifras clave en la sección `#cifras` (100% café de origen, +12k comensales) se animan dinámicamente al entrar en el campo visual.
   - Formateo regional localizado para Venezuela (`es-VE`), mostrando la coma decimal reglamentaria (**`4,9`**).
4. **Micro-interacciones Táctiles y de Hover**:
   - Rebote suave de ratón en el Hero (`animate-bounce`).
   - Indicador de deslizamiento táctil horizontal (`animate-swipe-nudge`) para invitar a explorar los platos en móviles.
   - Elevación tridimensional y escala suave en tarjetas (`group-hover:scale-105`, transiciones de 300ms a 700ms).
   - Barra superior de progreso de desplazamiento en el encabezado (`#scroll-progress`).

---

## 📐 Arquitectura Responsive y Matriz de Viewports

El sitio implementa una arquitectura responsive avanzada de dos niveles:
1. **Sistema Mobile-First (< 1920px)**: Diseñado para teléfonos, tablets y laptops, garantizando áreas de toque de al menos 44x44px y layouts flexibles con CSS Grid y Flexbox.
2. **Escalado Proporcional de Raíz (>= 1920px)**: En monitores grandes, la raíz `html` escala fluidamente mediante la fórmula:
   ```css
   html {
     font-size: clamp(18px, min(0.9375vw, 1.6667vh), 40px);
   }
   ```
   Esto amplía armónicamente tipografía, paddings, radios e iconos basados en `rem`, manteniendo exactamente la misma proporción visual que en 1080p pero aprovechando todo el ancho y alto del monitor sin generar vacíos ni deformaciones.

### Matriz de Compatibilidad Probada

| Dispositivo / Resolución | Ancho x Alto | Aspect Ratio | Comportamiento del Layout |
| :--- | :--- | :--- | :--- |
| **Móvil Compacto** | 375x667 a 390x844 | ~9:19.5 | Menú hamburguesa accesible, catálogo en deck deslizante horizontal con snap, FAB flotante compacto, botones táctiles `>= 44px`. |
| **Móvil Grande / Max** | 414x896 a 430x932 | ~9:19.5 | Tipografía cómoda, espaciados generosos con safe-area-insets para navegación por gestos en iOS/Android. |
| **Tablet Vertical** | 768x1024 (iPad) | 3:4 | Distribución de 2 columnas en perks y reservas, carrusel táctil fluido. |
| **Tablet Horizontal** | 1024x768 / 1180x820 | 4:3 | Activación del menú de navegación de escritorio completo, grilla de menú a 4 columnas. |
| **Laptop / Desktop Estándar** | 1366x768 / 1440x900 | 16:9 / 16:10 | Contenedor `.site-container` centrado (`max-width: 105rem`), navegación desktop completa, indicador de scroll visible. |
| **Full HD Widescreen** | 1920x1080 | 16:9 | Raíz base en 18px. Se eliminan vacíos verticales; las tarjetas del menú aprovechan el 100% de la celda de grilla. |
| **2K / QHD** | 2560x1440 | 16:9 | Raíz escala a 24px. Imágenes gastronómicas y tipografías crecen en proporción perfecta al monitor. |
| **Ultrawide 21:9** | 3440x1440 | 21:9 | La altura (1440px) ancla la escala vertical idéntica a QHD, mientras el contenedor central contiene los párrafos para evitar fatiga ocular. |
| **4K UHD** | 3840x2160 | 16:9 | Raíz escala a 36px–40px. El contenido llena la pantalla de manera monumental y nítida sin elementos diminutos. |

---

## 📂 Estructura del Código Fuente

```text
Terroso_Cafe&Restaurante/
├── public/                     # Recursos estáticos (favicons, robots.txt, sitemap, manifest)
│   ├── favicon.svg
│   └── manifest.webmanifest
├── src/
│   ├── assets/                 # Imágenes optimizadas automáticamente por Astro
│   │   ├── logo.png
│   │   ├── café.png
│   │   ├── criolla.png
│   │   ├── croissant _ sourdough.png
│   │   ├── fundadores.png
│   │   ├── terroso-ambiente-hero.png
│   │   └── terroso-brunch-ceramica.png
│   ├── components/             # Componentes modulares Astro
│   │   ├── Header.astro        # Header fijo, logo, nav desktop, botón móvil y barra de progreso
│   │   ├── Hero.astro          # Sección de apertura con claim, trust badges e imagen principal
│   │   ├── InfoStrip.astro     # Franja informativa con horario de Caracas y enlace a Google Maps
│   │   ├── Menu.astro          # Menú gastronómico interactivo con tabs ARIA y nota BCV
│   │   ├── Gallery.astro       # Carrusel continuo infinito con control táctil y de teclado
│   │   ├── Stats.astro         # Cifras destacadas y contadores animados en vivo
│   │   ├── History.astro       # Historia, fundadores, cultivo andino y tradición de masa madre
│   │   ├── Testimonials.astro  # Reseñas verificadas de clientes y calificación comunitaria
│   │   ├── Reservations.astro  # Widget de reserva con selector dinámico para WhatsApp
│   │   ├── FloatingActions.astro # Botón flotante de WhatsApp y botón "Volver arriba"
│   │   └── Footer.astro        # Información legal, redes, horarios y botón Web Share
│   ├── data/                   # Datos estructurados y mockups comerciales
│   │   ├── menu.ts             # Listado de platos, categorías, precios y descripciones
│   │   └── site.ts             # Configuración general (horarios, teléfonos demo, redes)
│   ├── layouts/
│   │   └── Layout.astro        # Plantilla base HTML5, SEO, Schema.org y precarga de fuentes
│   ├── pages/
│   │   └── index.astro         # Entrada principal de la aplicación y montaje de scripts
│   ├── scripts/                # Controladores JavaScript / TypeScript de cliente
│   │   ├── animations.ts       # Animaciones de scroll, contadores (Intl es-VE) y scroll-to-top
│   │   └── navigation.ts       # Navegación por anclas con historial y focus trap de menú móvil
│   ├── styles/
│   │   └── global.css          # Tokens Tailwind v4, animaciones y escalado para altas resoluciones
│   └── utils/
│       └── format.ts           # Formateadores auxiliares de moneda y puntuación regional
├── astro.config.mjs            # Configuración de compilación de Astro
├── package.json                # Dependencias y scripts de ejecución
└── tsconfig.json               # Configuración del compilador TypeScript
```

---

## 🚀 Comandos y Modo de Desarrollo

El proyecto utiliza **pnpm** como gestor de paquetes recomendado:

### 1. Instalación de dependencias
```bash
pnpm install
```

### 2. Iniciar servidor de desarrollo local
```bash
pnpm run dev
```
El sitio estará disponible en `http://localhost:4321`.

### 3. Compilación para producción (Build estático)
```bash
pnpm run build
```
Genera los archivos estáticos listos para producción en la carpeta `dist/`. La compilación ejecuta optimización de imágenes a WebP, minificación de HTML/CSS y validación tipográfica de TypeScript.

### 4. Previsualización de producción local
```bash
pnpm run preview
```
Sirve la carpeta `dist/` localmente para verificar el comportamiento exacto de producción.

---

## 📌 Contexto Ficticio del Establecimiento (Caso de Estudio)

Para dotar a la demostración de verosimilitud comercial y contextualizar la experiencia de usuario dentro de un caso de estudio real, el proyecto modela un establecimiento gastronómico de alta gama ambientado en **Altamira (Caracas, Venezuela)**:
- **Ubicación referencial**: Av. Luis Roche, Torre Empresarial, PB, Altamira, Municipio Chacao.
- **Propuesta conceptual**: Cafetería de especialidad de fincas andinas (Mérida y Táchira), panadería de masa madre de fermentación natural (24-48 hrs) y terraza *Pet-Friendly*.
- **Datos de contacto y enlaces**: Los números de teléfono, enlaces de WhatsApp, redes y reseñas son valores ficticios/demostrativos utilizados para ilustrar los flujos de interacción e integración.

---

## 📄 Licencia y Reconocimientos

Proyecto de portafolio y demostración de ingeniería frontend desarrollado por su autor. Todos los derechos reservados © 2026.
