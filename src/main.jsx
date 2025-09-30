/* src/main.jsx */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import AppLayout from './App.jsx'

// Placeholders de páginas (crea archivos reales después)
const HomePage = () => <h1>Inicio</h1>;
const CatalogPage = () => <h1>Catálogo</h1>;
const ProductPage = () => <h1>Producto</h1>;
const CartPage = () => <h1>Carrito</h1>;
const CheckoutPage = () => <h1>Pedido</h1>;
const BlogPage = () => <h1>Blog</h1>;
const AboutPage = () => <h1>Nosotros</h1>;
const LoginPage = () => <h1>Login</h1>;
const RegisterPage = () => <h1>Registro</h1>;
const AccountPage = () => <h1>Mi Cuenta</h1>;

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/catalogo', element: <CatalogPage /> },
      { path: '/producto/:id', element: <ProductPage /> },
      { path: '/carrito', element: <CartPage /> },
      { path: '/pedido', element: <CheckoutPage /> },
      { path: '/blog', element: <BlogPage /> },
      { path: '/nosotros', element: <AboutPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/registro', element: <RegisterPage /> },
      { path: '/micuenta', element: <AccountPage /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
