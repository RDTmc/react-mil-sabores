// src/pages/ProductPage.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock de componentes hijos para aislar la página
jest.mock('../components/producto/GaleriaProducto', () => ({
  __esModule: true,
  default: ({ imagen }) => <div data-testid="galeria" data-imagen={imagen}>Galeria</div>,
}));
jest.mock('../components/producto/FichaProducto', () => ({
  __esModule: true,
  default: ({ producto }) => (
    <div data-testid="ficha" data-name={producto?.name} data-price={producto?.price}>
      Ficha
    </div>
  ),
}));

// 🔌 Mock de Supabase para esta suite
const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockMaybeSingle = jest.fn();

jest.mock('../lib/supabaseClient', () => {
  return {
    supabase: {
      from: (...args) => mockFrom(...args),
    },
  };
});

import ProductPage from './ProductPage';

beforeEach(() => {
  jest.clearAllMocks();
});

function renderWithRoute(initialPath = '/producto/99') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/producto/:id" element={<ProductPage />} />
      </Routes>
    </MemoryRouter>
  );
}

test('muestra "Cargando…" y luego renderiza galería + ficha con los props correctos', async () => {
  // Cadena de llamadas: from('products').select(...).eq('id', id).maybeSingle()
  mockFrom.mockReturnValue({
    select: (...args) => {
      mockSelect(...args);
      return {
        eq: (...argsEq) => {
          mockEq(...argsEq);
          return {
            maybeSingle: () =>
              Promise.resolve({
                data: {
                  id: '99',
                  name: 'Cheesecake',
                  price: 4200,
                  image_path: '/img/cheesecake.jpg',
                  description: 'Delicioso',
                  sizes: ['M', 'XL'],
                },
                error: null,
              }),
          };
        },
      };
    },
  });

  renderWithRoute('/producto/99');

  // Estado inicial: indicador de carga visible
  expect(screen.getByText(/cargando…/i)).toBeInTheDocument();

  // Espera a que se resuelva la carga y se monten los hijos
  await waitFor(() => expect(screen.getByTestId('galeria')).toBeInTheDocument());
  await waitFor(() => expect(screen.getByTestId('ficha')).toBeInTheDocument());

  // Verifica cadena y props usados
  expect(mockFrom).toHaveBeenCalledWith('products');
  expect(mockSelect).toHaveBeenCalledWith('id, name, price, image_path, description, sizes');
  expect(mockEq).toHaveBeenCalledWith('id', '99');

  // Verifica props pasados a hijos
  expect(screen.getByTestId('galeria').getAttribute('data-imagen')).toBe('/img/cheesecake.jpg');
  expect(screen.getByTestId('ficha').getAttribute('data-name')).toBe('Cheesecake');
  expect(screen.getByTestId('ficha').getAttribute('data-price')).toBe('4200');
});

test('muestra alerta "Producto no encontrado." cuando Supabase retorna null', async () => {
  mockFrom.mockReturnValue({
    select: () => ({
      eq: () => ({
        maybeSingle: () =>
          Promise.resolve({
            data: null, // No encontrado
            error: null,
          }),
      }),
    }),
  });

  renderWithRoute('/producto/123');

  // Se ve el loading primero
  expect(screen.getByText(/cargando…/i)).toBeInTheDocument();

  // Luego la alerta de no encontrado
  await waitFor(() =>
    expect(screen.getByText(/producto no encontrado\./i)).toBeInTheDocument()
  );
});
