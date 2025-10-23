// src/components/NavbarMS.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock de useCarrito para evitar el error de provider
jest.mock('../context/CartContext', () => ({
  useCarrito: () => ({
    listaItems: [{ id: 1, name: 'Brownie', price: 4000, qty: 2 }],
    obtenerTotales: () => ({ cantidad: 2, sub: 8000, iva: 1520, total: 9520 }),
  }),
}));

import NavbarMS from './NavbarMS';

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <NavbarMS />
    </MemoryRouter>
  );

test('Navbar muestra la marca y los links principales', () => {
  renderNavbar();
  expect(screen.getByRole('link', { name: /mil sabores/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /catálogo/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /nosotros/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /carrito/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /mi cuenta/i })).toBeInTheDocument();
});

test('Navbar incluye el botón toggler con atributos de Bootstrap', () => {
  renderNavbar();
  const toggler = screen.getByRole('button');
  expect(toggler).toHaveAttribute('data-bs-toggle', 'collapse');
  expect(toggler).toHaveAttribute('data-bs-target', '#navMS');
});
