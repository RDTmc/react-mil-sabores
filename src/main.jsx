// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/brand.css'
import './styles/HomeSections.css'

import { ProveedorCarrito } from './context/CartContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

import App from './App.jsx'

import HomePage from './pages/HomePage.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import BlogPage from './pages/BlogPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import AccountPage from './pages/AccountPage.jsx'
import CompraPage from './pages/CompraPage.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'

import RequireAuth from './routes/RequireAuth.jsx'
import RequireAdmin from './routes/RequireAdmin.jsx'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // Rutas públicas
      { path: '/', element: <HomePage /> },
      { path: '/catalogo', element: <CatalogPage /> },
      { path: '/producto/:id', element: <ProductPage /> },
      { path: '/carrito', element: <CartPage /> }, 
      { path: '/blog', element: <BlogPage /> },
      { path: '/nosotros', element: <AboutPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/registro', element: <RegisterPage /> },

      // Rutas que requieren usuario autenticado
      {
        element: <RequireAuth />,
        children: [
          { path: '/pedido', element: <CheckoutPage /> },
          { path: '/micuenta', element: <AccountPage /> },
          { path: '/compra', element: <CompraPage /> },
        ],
      },

      // Rutas sólo para ADMIN
      {
        element: <RequireAdmin />,
        children: [
          { path: '/admin/panel', element: <AdminDashboardPage /> },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <React.StrictMode>
      <ProveedorCarrito>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </ProveedorCarrito>
    </React.StrictMode>
  </AuthProvider>
)
