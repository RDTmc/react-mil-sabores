// src/pages/CatalogPage.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

// 🔧 Mocks de componentes hijo
jest.mock('../components/catalogo/BarraFiltros.jsx', () => ({
  __esModule: true,
  default: ({
    terminoDeBusqueda,
    onCambiarTerminoDeBusqueda,
    idCategoriaSeleccionada,
    onCambiarIdCategoriaSeleccionada,
    categorias = [],
  }) => (
    <div data-testid="barra-filtros">
      <input
        aria-label="buscar"
        value={terminoDeBusqueda}
        onChange={(e) => onCambiarTerminoDeBusqueda(e.target.value)}
      />
      <select
        aria-label="categoria"
        value={idCategoriaSeleccionada}
        onChange={(e) => onCambiarIdCategoriaSeleccionada(e.target.value)}
      >
        <option value="">Todas</option>
        {categorias.map((c) => (
          <option key={c.id} value={String(c.id)}>{c.nombre}</option>
        ))}
      </select>
    </div>
  ),
}));

jest.mock('../components/catalogo/GrillaDeProductos.jsx', () => ({
  __esModule: true,
  default: ({ listaProductos = [] }) => (
    <ul data-testid="grid">
      {listaProductos.map((p) => (
        <li key={p.id} data-testid="item">{p.name}</li>
      ))}
    </ul>
  ),
}));

// 🔌 Mock Supabase
const mockFrom = jest.fn();
let mockedProducts = [];
let mockedError = null;

jest.mock('../lib/supabaseClient', () => {
  return {
    supabase: {
      from: (...args) => mockFrom(...args),
    },
  };
});

// 🪝 Mock del hook de categorías
let mockedCategorias = [];
let mockedCatLoading = false;
let mockedCatError = null;

jest.mock('../hooks/useCategorias', () => ({
  useCategorias: () => ({
    listaCategorias: mockedCategorias,
    loadingCarga: mockedCatLoading,
    errorCarga: mockedCatError,
  }),
}));

import CatalogPage from './CatalogPage';

beforeEach(() => {
  jest.clearAllMocks();

  // Valores por defecto para cada test
  mockedProducts = [
    { id: 1, name: 'Cheesecake', price: 4200, image_path: '/img/chees.jpg', description: 'Queso crema', category_id: 10 },
    { id: 2, name: 'Torta Selva Negra', price: 6500, image_path: '/img/selva.jpg', description: 'Chocolate y cerezas', category_id: 10 },
    { id: 3, name: 'Brownie', price: 1500, image_path: '/img/brownie.jpg', description: 'Chocolate intenso', category_id: 20 },
  ];
  mockedError = null;

  mockedCategorias = [
    { id: 10, nombre: 'Tortas' },
    { id: 20, nombre: 'Galletas' },
  ];
  mockedCatLoading = false;
  mockedCatError = null;

  mockFrom.mockImplementation((table) => {
    if (table !== 'products') throw new Error('Tabla inesperada en supabase.from');
    return {
      select: (cols) => {
        expect(cols).toBe('id, name, price, image_path, description, category_id');
        return {
          order: (colName) => {
            expect(colName).toBe('name');
            return Promise.resolve({ data: mockedProducts, error: mockedError });
          },
        };
      },
    };
  });
});

test('Carga inicial: muestra skeleton y luego la grilla con productos', async () => {
  const { container } = render(<CatalogPage />);

  // Skeleton cargando…
  // (buscamos por clase .placeholder para no depender de textos)
  expect(container.querySelectorAll('.placeholder').length).toBeGreaterThan(0);

  // Luego aparece la grilla con los items
  await waitFor(() => expect(screen.getByTestId('grid')).toBeInTheDocument());
  expect(screen.getAllByTestId('item')).toHaveLength(3);
});

test('Filtro por categoría: al seleccionar categoría, se reduce la lista', async () => {
  render(<CatalogPage />);

  // Espera carga
  await waitFor(() => screen.getByTestId('grid'));
  expect(screen.getAllByTestId('item')).toHaveLength(3);

  // Selecciona categoría "Tortas" (id 10) → quedan 2
  fireEvent.change(screen.getByLabelText(/categoria/i), { target: { value: '10' } });
  expect(screen.getAllByTestId('item')).toHaveLength(2);
  // Selecciona "Galletas" (id 20) → queda 1
  fireEvent.change(screen.getByLabelText(/categoria/i), { target: { value: '20' } });
  expect(screen.getAllByTestId('item')).toHaveLength(1);
  // Vuelve a "Todas"
  fireEvent.change(screen.getByLabelText(/categoria/i), { target: { value: '' } });
  expect(screen.getAllByTestId('item')).toHaveLength(3);
});

test('Búsqueda por texto: filtra por name/description (case-insensitive)', async () => {
  render(<CatalogPage />);

  await waitFor(() => screen.getByTestId('grid'));

  // "che" debe coincidir con Cheesecake (name) → 1
  fireEvent.change(screen.getByLabelText(/buscar/i), { target: { value: 'che' } });
  expect(screen.getAllByTestId('item')).toHaveLength(1);
  expect(screen.getByText(/cheesecake/i)).toBeInTheDocument();

  // "choco" coincide con descripción de Selva Negra y Brownie (description "Chocolate")
  fireEvent.change(screen.getByLabelText(/buscar/i), { target: { value: 'choco' } });
  expect(screen.getAllByTestId('item')).toHaveLength(2);

  // Borrar búsqueda → vuelven los 3
  fireEvent.change(screen.getByLabelText(/buscar/i), { target: { value: '' } });
  expect(screen.getAllByTestId('item')).toHaveLength(3);
});

test('Empty state: si Supabase retorna [], la grilla queda vacía (sin error)', async () => {
  mockedProducts = [];

  render(<CatalogPage />);

  await waitFor(() => screen.getByTestId('grid'));
  expect(screen.queryAllByTestId('item')).toHaveLength(0);
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('Error state: si Supabase retorna error, se muestra la alerta', async () => {
  mockedError = new Error('Boom!');

  render(<CatalogPage />);

  // Espera el fin de carga y que aparezca el error global
  await waitFor(() => screen.getByText(/no se pudo cargar el catálogo/i));
  expect(screen.getByText(/boom/i)).toBeInTheDocument();
});
