# ☕ Terroso Café & Restaurante

[![Astro](https://img.shields.io/badge/Astro-5.0-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![WCAG](https://img.shields.io/badge/WCAG_2.2-AA_Compliant-2E7D32?style=flat-square)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![SEO](https://img.shields.io/badge/SEO_Google-2026_Ready-EA4335?style=flat-square&logo=google&logoColor=white)](https://developers.google.com/search)

Plataforma web oficial y catálogo gastronómico interactivo de **Terroso Café & Restaurante**, ubicado en la emblemática **Av. Luis Roche de Altamira (Caracas, Venezuela)**. Un espacio dedicado al café de especialidad de fincas andinas venezolanas, la panadería artesanal de fermentación lenta (masa madre) y la cocina de origen contemporánea.

La web combina arquitectura de alto rendimiento generada estáticamente (SSG), diseño editorial de lujo inspirado en los tonos de la tierra y la arcilla (*Earthy Palette*), accesibilidad integral y un sistema de escalado proporcional capaz de adaptarse armónicamente desde teléfonos compactos hasta pantallas **Ultrawide 21:9 y monitores 4K UHD**.

---

## 🌟 Características Principales

### 1. Experiencia Gastronómica & Reserva Interactiva
- **Catálogo de Temporada con Filtros WAI-ARIA**: Pestañas de filtrado dinámico (Desayunos, Café, Brunch, Panadería) con soporte de teclado accesible (flechas horizontales `ArrowLeft` / `ArrowRight`, `Home` y `End`).
- **Configurador de Reservas para WhatsApp**: Selector en tiempo real del número de comensales, momento del día (Brunch, Almuerzo, Tarde) y área deseada (Terraza Jardín o Salón Principal). Genera automáticamente un mensaje codificado para confirmación inmediata con el anfitrión.
- **Horario Dinámico en Vivo (Zona Caracas)**: Cálculo automático del horario del día según la hora local de Venezuela (`America/Caracas`), indicando estado de apertura en tiempo real.
- **Cumplimiento y Transparencia Comercial (BCV)**: Indicación explícita de precios referenciales en USD ($) con recepción de pagos en Bolívares (VES) a la tasa oficial del Banco Central de Venezuela, Pago Móvil y divisas en efectivo.

### 2. Accesibilidad Avanzada (WCAG 2.2 AA)
- **Navegación Móvil con Focus Trap**: Al abrir el menú desplegable en dispositivos táctiles, el contenido de fondo (`<main>` y `<footer>`) se aísla con el atributo `inert`, impidiendo la pérdida del tabulador y bloqueando el scroll de fondo.
- **Botón "Volver Arriba" con Gestión de Foco**: El botón `#scroll-to-top` permanece con `tabindex="-1"` y `aria-hidden="true"` mientras está oculto, y solo entra en el orden de tabulación al hacerse visible (`scrollY > 400px`).
- **Navegación por Anclas y Botón "Atrás"**: Los enlaces de sección (`#menu`, `#reservas`, `#historia`) actualizan el hash en la URL con `history.pushState` sin recargar la página, permitiendo copiar enlaces directos y usar los botones Atrás/Adelante del navegador.
- **Pausa Accesible en Galería**: El carrusel continuo se pausa de inmediato al recibir foco de teclado (`focusin`/`focusout`), evitando que el elemento enfocado se desplace fuera del viewport.

### 3. SEO Técnico Google 2026 & Datos Estructurados
- **Schema.org Graph Completo (`CafeOrCoffeeShop`)**: Incorpora geolocalización satelital precisa (Altamira, Caracas: `10.4965, -66.8524`), horarios por día, rangos de precio, teléfono, métodos de pago aceptados y atributos clave (Pet Friendly, Terraza, WiFi de alta velocidad).
- **Metadatos Sociales & PWA**: Open Graph optimizado con locale `es_VE`, Twitter Cards en formato `summary_large_image`, manifiesto web (`manifest.webmanifest`) e icono SVG escalable.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Justificación / Propósito |
| :--- | :--- | :--- |
| **Framework** | **Astro 5 (SSG)** | Generación estática pura. Produce cero JavaScript innecesario en el cliente y ofrece tiempos de carga inicial casi instantáneos (TTFB < 50ms). |
| **Estilos & Tokens** | **Tailwind CSS v4** | Utiliza `@theme` con variables nativas de color y espaciado, sistema de diseño centralizado sin sobrecarga de runtime. |
| **Tipografía** | **Google Fonts** | *Playfair Display* (serif editorial de alta gama para títulos) y *Plus Jakarta Sans* (sans-serif contemporánea para lectura cómoda). |
| **Iconografía** | **Material Symbols Outlined** | Glifos vectoriales ligeros configurados con `display=swap`. |
| **Lógica de Cliente** | **TypeScript / Vanilla JS** | Controladores nativos con `IntersectionObserver`, `requestAnimationFrame`, `Intl.NumberFormat` y `history.pushState`. Cero dependencias externas pesadas. |
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
│   ├── assets/                 # Imágenes originales optimizadas por Astro
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
│   ├── data/                   # Datos estructurados y constantes del negocio
│   │   ├── menu.ts             # Listado de platos, categorías, precios y descripciones
│   │   └── site.ts             # Configuración general (horarios, teléfonos, redes, dirección)
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

## 📍 Ubicación y Contacto del Establecimiento

- **Dirección**: Av. Luis Roche, Torre Empresarial, Planta Baja, Altamira, Municipio Chacao, Caracas, Miranda, Venezuela (Código Postal 1060).
- **Especialidades**: Café de finca (Mérida y Táchira), panes de masa madre de fermentación natural (24-48 hrs), brunch artesanal y repostería de autor.
- **Ambiente**: Terraza al aire libre *Pet-Friendly*, salón climatizado, WiFi de alta velocidad y tomas de corriente para trabajo remoto.

---

## 📄 Licencia

Desarrollado para **Terroso Café & Restaurante**. Todos los derechos reservados © 2026.
