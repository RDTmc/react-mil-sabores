/* src/main.jsx */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/brand.css'


import AppLayout from './App.jsx'

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
