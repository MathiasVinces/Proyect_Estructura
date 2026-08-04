# LogiExpress — Sistema de Logística y Envíos

> **Proyecto Final — Materia: Estructura de Datos**  
> Tercer Semestre

**Autores:**
- Cristhian Eduardo Avila Vera
- Mathias Alexander Vinces Mero

---

## Descripción

**LogiExpress** es un sistema de gestión de logística y envíos de paquetes desarrollado como proyecto final de la materia de Estructura de Datos. La aplicación implementa **6 estructuras de datos** fundamentales conectadas a un dashboard web interactivo.

El sistema permite registrar clientes y paquetes, calcular tarifas, rastrear envíos, gestionar colas de despacho y visualizar rutas de entrega mediante un grafo.

---

## Estructuras de Datos Implementadas

| Estructura | Archivo | Uso en el Sistema |
|---|---|---|
| **Lista Simplemente Enlazada** | `ListaEnlazada.js` | CRUD de clientes y paquetes |
| **Arreglo Estático** | `TablaTarifas.js` | Tabla de 5 tarifas con acceso O(1) |
| **Pila (LIFO)** | `Pila.js` | Historial de acciones y deshacer |
| **Cola (FIFO)** | `Cola.js` | Cola de despacho de paquetes |
| **Árbol Binario de Búsqueda** | `ArbolBinarioBusqueda.js` | Rastreo de paquetes por Tracking ID |
| **Grafo (Lista de Adyacencia)** | `Grafo.js` | Red de rutas entre ciudades |

---

## Estructura del Proyecto

```
Proyect_Estructura/
├── index.html              # Dashboard principal (UI)
├── package.json
├── css/
│   └── styles.css          # Estilos Apple HIG + Glassmorphism
└── src/
    ├── app.js              # Controlador principal (conecta UI ↔ estructuras)
    ├── models/
    │   ├── Cliente.js      # Modelo de Cliente
    │   └── Paquete.js      # Modelo de Paquete
    └── structures/
        ├── Nodo.js                  # Nodo genérico para listas
        ├── ListaEnlazada.js         # Lista simplemente enlazada
        ├── TablaTarifas.js          # Arreglo estático de tarifas
        ├── Pila.js                  # Pila LIFO
        ├── Cola.js                  # Cola FIFO
        ├── ArbolBinarioBusqueda.js  # BST para rastreo
        └── Grafo.js                 # Grafo de rutas
```

---

## Cómo ejecutar

### Opción 1 — Live Server (VS Code)
1. Abrir el proyecto en VS Code
2. Instalar la extensión **Live Server**
3. Clic derecho en `index.html` → **Open with Live Server**

### Opción 2 — Servidor local con Node.js
```bash
npm start
# equivale a: npx serve .
```

> El archivo `src/app.js` usa ES Modules (`type: "module"`), por lo que el `index.html` **debe abrirse desde un servidor local** y no directamente con doble clic.

---

## Funcionalidades del Dashboard

### Resumen
- Estadísticas en tiempo real: total de paquetes, clientes, cola de despacho y rutas activas.
- **Rastreo Express por Tracking ID** usando el Árbol BST — búsqueda O(log n).

### Clientes
- CRUD completo sobre la Lista Enlazada: agregar, editar y eliminar clientes.
- Tabla de paquetes registrados con su Tracking ID, estado y costo.

### Tarifas
- Visualización del arreglo estático de 5 categorías tarifarias.
- Calculadora de costos por peso con resaltado de la categoría correspondiente.

### Operaciones
- **Cola FIFO**: despacho ordenado de paquetes (primero en entrar, primero en salir).
- **Pila LIFO**: historial de todas las acciones con función de deshacer (undo).

### Rutas
- Mapa SVG interactivo del grafo de ciudades del Ecuador.
- Agregar nuevas rutas con distancia en kilómetros.

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 semántico | Estructura del dashboard |
| CSS Vanilla | Estilos Apple HIG, glassmorphism, animaciones |
| JavaScript ES6+ (Módulos) | Lógica, estructuras de datos, DOM |
| SVG | Visualización del grafo de rutas |

---

## Fases del Proyecto

- **Fase 1**  — Modelos (`Cliente`, `Paquete`), `Nodo`, `ListaEnlazada`, `TablaTarifas`
- **Fase 2**  — `Pila`, `Cola`, `ArbolBinarioBusqueda`, `Grafo`
- **Fase 3**  — Dashboard web interactivo conectado a todas las estructuras

---

*PUCEM · Tercer Semestre · 2025*