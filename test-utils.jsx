// test-utils.jsx (RAÍZ)
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProveedorCarrito } from './src/context/CartContext';

export function renderWithProviders(
  ui,
  { route = '/', cartInitial = [] } = {}
) {
  window.history.pushState({}, 'Test page', route);
  // Semilla del carrito con la clave real del proyecto
  localStorage.setItem('ms_carrito', JSON.stringify(cartInitial));

  return render(
    <ProveedorCarrito>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </ProveedorCarrito>
  );
}
