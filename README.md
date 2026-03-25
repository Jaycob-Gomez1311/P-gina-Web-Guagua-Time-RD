# GuaguaTime RD

Simulador de rutas y costos del transporte público en República Dominicana. Aplicación web 100% front-end, sin frameworks, que permite calcular rutas entre barrios/sectores, con tiempos y costos estimados, guardar favoritos, y recibir alertas que afectan las estimaciones.

## Características

- ✅ Selección de origen/destino desde lista de sectores dominicanos.
- ✅ Cálculo de múltiples rutas (concho, guagua, carro público, motoconcho) con tiempos y costos.
- ✅ Aplicación de alertas (lluvia, hora pico, paro) que modifican tiempo y costo.
- ✅ Ordenamiento de rutas por tiempo, costo o número de transbordos.
- ✅ Guardar rutas favoritas en localStorage.
- ✅ Mapa esquemático SVG de nodos y conexiones.
- ✅ Modo oscuro automático (prefers-color-scheme) y manual.
- ✅ PWA: manifest y service worker para funcionamiento offline.
- ✅ Modo ahorro que reduce animaciones.
- ✅ Internacionalización (ES/EN) con diccionario JSON.
- ✅ Diseño responsive, accesible (semántico, ARIA).
- ✅ Código modular ES6, sin dependencias externas.

## Instalación y ejecución

1. Clona o descarga el repositorio.
2. Abre la carpeta `guaguatime-rd` en Visual Studio Code o cualquier servidor local.
3. Para probar la PWA y el service worker, es necesario servir la aplicación mediante un servidor HTTP. Puedes usar la extensión "Live Server" de VSCode o ejecutar:
   ```bash
   npx serve