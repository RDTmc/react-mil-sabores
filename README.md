
# React Mil Sabores – Frontend (React + Microservicios)

Frontend del proyecto **Pastelería Mil Sabores**, desarrollado con **React + Vite**, conectado a un backend basado en **microservicios Spring Boot**:

- Catálogo de productos (ms-productos).
- Autenticación y usuarios (ms-usuarios).
- Carrito persistente por usuario (ms-cart).
- Órdenes y promociones automáticas (ms-orders).
- Panel administrador para monitoreo de usuarios y pedidos.

Esta rama **`React+Microservicios`** es la versión preparada para la **defensa del proyecto** y puede utilizarse como rama principal (`main`) del repositorio.

---

## 1. Stack tecnológico

**Frontend**

- **React 18** + **Vite** – SPA rápida, DX moderna.
- **React Router DOM** – Navegación con rutas públicas y protegidas.
- **Context API** – Manejo global de:
  - Sesión y roles (`AuthContext`).
  - Carrito (`CartContext`).
  - Notificaciones tipo toast (`ToastContext`).
- **Bootstrap 5** – Layout responsivo y componentes básicos.
- **CSS modular** – Estilos en `/src/styles` (brand, home, navbar, blog, etc.).
- **Axios** – Consumo de los microservicios backend.

**Backend (integración)**

- Microservicios Spring Boot:
  - `ms-usuarios` – Auth, registro, roles.
  - `ms-productos` – Catálogo de productos.
  - `ms-cart` – Carrito por usuario.
  - `ms-orders` – Órdenes, totales y promociones.
- Base de datos: **PostgreSQL**.
- Imágenes de productos: **Supabase Storage** (URLs públicas).

> La configuración detallada del backend está en el repo:  
> `https://github.com/RDTmc/mil-sabores-api`

---

## 2. Principales funcionalidades

### 2.1. Para el cliente

- **Home** con:
  - Hero principal.
  - Productos destacados.
  - Sección de testimonios.
  - Noticias (referencia a blog).
- **Catálogo de productos** con:
  - Grilla de tarjetas con imagen, nombre, descripción y precio.
  - Imágenes cargadas desde Supabase o desde `/public/img`.
- **Ficha de producto**:
  - Visualización de la imagen principal.
  - Descripción, precio y tallas disponibles (`sizes`).
  - Selector de cantidad.
  - Botones “Añadir al carrito” y “Ir al carrito”.
- **Carrito de compras**:
  - Como invitado → carrito en `localStorage`.
  - Como usuario autenticado → carrito en `ms-cart`.
  - Totales con cálculo de IVA aproximado (19%).
- **Checkout / Pedido**:
  - Formulario con nombre, email, teléfono, dirección, comuna.
  - Fecha de entrega y método de pago.
  - Validaciones en frontend.
  - Creación de orden en `ms-orders`.
  - Aplicación automática de promociones según los datos del usuario.
- **Confirmación de compra**:
  - Pantalla `/compra` con resumen de la última orden:
    - Datos de cliente.
    - Método de pago.
    - Dirección y fecha.
    - Ítems, subtotales, descuento, IVA y total final.
  - Opción de imprimir comprobante.

### 2.2. Autenticación y roles

- **Registro y login** contra `ms-usuarios`:
  - `POST /auth/register`
  - `POST /auth/login`
- El JWT devuelto se almacena en `localStorage` (`ms_auth_state`).
- El payload del token se decodifica en el frontend para obtener:
  - `id`, `email`, `fullName`, `role`.
  - `birthDate`, `registrationCode` (para promociones).
- Rutas protegidas:
  - `RequireAuth` → solo usuarios logeados:
    - `/pedido`
    - `/compra`
    - `/micuenta`
  - `RequireAdmin` → solo rol `ADMIN`:
    - `/admin/panel`

### 2.3. Panel administrador

- Ruta: `/admin/panel`
- Funcionalidades:
  - **Órdenes recientes**:
    - Consulta a `ms-orders` → `GET /admin/orders/latest`.
    - Muestra ID, fecha, usuario, estado, montos y descuentos.
    - KPIs: total de órdenes, ventas totales, ticket promedio, clientes únicos.
  - **Gestión de usuarios**:
    - Consulta a `ms-usuarios` → `GET /admin/users`.
    - Permite editar nombre, teléfono y rol.
    - Permite eliminar usuarios.
    - Protegido tanto en frontend (`RequireAdmin`) como en backend (Spring Security).

---

## 3. Estructura de carpetas (simplificada)

```text
react-mil-sabores/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx              # AppLayout: Navbar + Outlet + Footer
    ├── routes/
    │   ├── RequireAuth.jsx
    │   └── RequireAdmin.jsx
    ├── context/
    │   ├── AuthContext.jsx   # Manejo de sesión, JWT, rol
    │   ├── CartContext.jsx   # Carrito (localStorage + ms-cart)
    │   └── ToastContext.jsx  # Toasts globales
    ├── lib/
    │   ├── apiClient.js      # Axios + integración con microservicios
    │   └── imageUtils.js     # Helper para resolver URLs de imágenes
    ├── components/
    │   ├── NavbarMS.jsx
    │   ├── FooterMS.jsx
    │   ├── catalogo/GrillaDeProductos.jsx
    │   ├── home/Hero.jsx
    │   ├── home/GrillaDeDestacados.jsx
    │   ├── home/NewsGrid.jsx
    │   ├── home/Testimonials.jsx
    │   └── producto/
    │       ├── FichaProducto.jsx
    │       └── GaleriaProducto.jsx
    ├── pages/
    │   ├── HomePage.jsx
    │   ├── CatalogPage.jsx
    │   ├── ProductPage.jsx
    │   ├── CartPage.jsx
    │   ├── CheckoutPage.jsx     # /pedido
    │   ├── CompraPage.jsx       # /compra
    │   ├── LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   ├── AccountPage.jsx      # /micuenta
    │   ├── AdminDashboardPage.jsx
    │   ├── BlogPage.jsx
    │   └── AboutPage.jsx        # /nosotros
    └── styles/
        ├── brand.css
        ├── HomeSections.css
        ├── NavbarMS.css
        └── BlogPage.css
````

---

## 4. Rutas principales

Definidas en `src/main.jsx`:

* **Públicas**

  * `/` – Home.
  * `/catalogo` – Catálogo de productos.
  * `/producto/:id` – Ficha de producto.
  * `/carrito` – Carrito (invitado / usuario).
  * `/blog` – Blog y noticias.
  * `/nosotros` – Quiénes somos.
  * `/login` – Iniciar sesión.
  * `/registro` – Crear cuenta.

* **Protegidas (RequireAuth)**

  * `/pedido` – Checkout / Confirmar pedido.
  * `/compra` – Confirmación de compra.
  * `/micuenta` – Página de cuenta del usuario.

* **Administrador (RequireAdmin)**

  * `/admin/panel` – Panel administrador (órdenes + usuarios).

---

## 5. Integración con el backend (microservicios)

La integración se realiza vía `src/lib/apiClient.js` usando `axios`.
Los endpoints se leen desde variables de entorno Vite:

```env
# .env.development o .env.local

VITE_API_URL=http://localhost:8081/api        # ms-productos
VITE_AUTH_API_URL=http://localhost:8082/api   # ms-usuarios
VITE_CART_API_URL=http://localhost:8084/api   # ms-cart
VITE_ORDERS_API_URL=http://localhost:8083/api # ms-orders
```

### 5.1. Catálogo (ms-productos)

* `GET /products` – Lista paginada (con filtros `q`, `categoryId`).
* `GET /products/:id` – Detalle de producto.
* `GET /featured` – Destacados para home.
* `GET /categories` – Categorías.

### 5.2. Auth y usuarios (ms-usuarios)

* `POST /auth/login` – Login, devuelve JWT + datos del usuario.
* `POST /auth/register` – Registro.
* `GET /admin/users` – Lista usuarios (ADMIN).
* `PUT /admin/users/:id` – Actualizar usuario (ADMIN).
* `DELETE /admin/users/:id` – Eliminar usuario (ADMIN).

Los clientes `axios` incluyen automáticamente `Authorization: Bearer <token>` al leer el JWT desde `localStorage` (`ms_auth_state`).

### 5.3. Carrito (ms-cart)

* `GET /cart`
* `POST /cart/items`
* `PUT /cart/items/:id`
* `DELETE /cart/items/:id`
* `DELETE /cart`

Todos requieren:

* `Authorization: Bearer <token>`
* `X-User-Id: <id-del-usuario>` (obtenido desde `AuthContext`).

### 5.4. Órdenes y promociones (ms-orders)

* `POST /orders` – Crea orden desde el checkout.
* `GET /orders` – Lista órdenes del usuario actual.
* `GET /orders/:id` – Detalle orden.
* `GET /admin/orders/latest?limit=N` – Últimas N órdenes (ADMIN).

El backend calcula:

* `subtotalAmount`, `discountAmount`, `discountCode`, `discountDescription`, `totalAmount`.

En el frontend, `CheckoutPage` guarda un snapshot de la orden en `sessionStorage` (`ms_last_order`), y `CompraPage` muestra el resumen detallado.

---

## 6. Requisitos previos

* **Node.js 18+** (recomendado 18 o 20).
* **npm** o **yarn** (el proyecto está pensado para `npm`).
* Backend `mil-sabores-api` levantado con todos los microservicios configurados.

---

## 7. Instalación y ejecución

```bash
# Clonar repositorio
git clone https://github.com/RDTmc/react-mil-sabores.git
cd react-mil-sabores

# Cambiar a la rama de defensa (si aún no es la default)
git checkout React+Microservicios

# Instalar dependencias
npm install

# Configurar variables de entorno (crear .env.development o .env.local)
# Ejemplo:
# VITE_API_URL=http://localhost:8081/api
# VITE_AUTH_API_URL=http://localhost:8082/api
# VITE_CART_API_URL=http://localhost:8084/api
# VITE_ORDERS_API_URL=http://localhost:8083/api

# Ejecutar en modo desarrollo
npm run dev
```

Por defecto, Vite expondrá la app en:

```text
http://localhost:5173/
```

---

## 8. Scripts disponibles

En `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx"
  }
}
```

Uso:

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Previsualizar build de producción
npm run preview

# (Opcional) Linting
npm run lint
```

---

## 9. Estilos y diseño

* Hoja de estilos principal de marca: `src/styles/brand.css`.
* Secciones de home: `src/styles/HomeSections.css`.
* Navbar y comportamiento responsive: `src/styles/NavbarMS.css`.
* Blog / Recetas: `src/styles/BlogPage.css`.
* Se utiliza **Bootstrap 5** importado en `src/main.jsx`:

  * `import 'bootstrap/dist/css/bootstrap.min.css'`
  * `import 'bootstrap/dist/js/bootstrap.bundle.min.js'`

Imágenes:

* Productos: URLs de Supabase o rutas relativas (`/img/...` en `public`).
* Testimonios, noticias, recetas: imágenes estáticas en `public/img`.

---

## 10. Flujo Git propuesto

Dado que la rama **`React+Microservicios`** concentra la versión completa integrada con el backend, se recomienda:

* Usar `React+Microservicios` como **rama principal** (`main`) o configurarla como rama default en GitHub.
* Crear ramas de feature desde esta rama:

```bash
git checkout React+Microservicios
git checkout -b feature/nueva-funcionalidad
# ... trabajar ...
git commit -m "feat: agrega nueva funcionalidad X"
git push origin feature/nueva-funcionalidad
# PR → React+Microservicios (o main)
```

Convenciones de commit (Conventional Commits):

* `feat:` nueva funcionalidad.
* `fix:` corrección de bugs.
* `docs:` documentación.
* `style:` cambios de estilo (sin lógica).
* `refactor:` refactorización.
* `test:` tests.
* `build:`, `chore:`, `revert:` según corresponda.

---

## 11. Relación con el backend

Resumen de repositorios:

* **Backend (microservicios)**
  `https://github.com/RDTmc/mil-sabores-api`

* **Frontend (este repo)**
  `https://github.com/RDTmc/react-mil-sabores`
  Rama de defensa / principal: `React+Microservicios`.

El frontend asume que:

* Los microservicios están levantados en los puertos indicados.
* Las variables de entorno Vite (`VITE_*`) apuntan correctamente a cada API.

1. Ver catálogo y destacados.
2. Añadir productos al carrito (invitado o logeado).
3. Login / registro de usuario.
4. Checkout con formulario validado.
5. Aplicación automática de promociones.
6. Confirmación de compra.
7. Panel admin para revisar órdenes y administrar usuarios.

```
```
