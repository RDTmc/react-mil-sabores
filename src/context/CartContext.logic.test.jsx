// src/context/CartContext.logic.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProveedorCarrito, useCarrito } from './CartContext';

beforeEach(() => {
  // aislamos cada test
  localStorage.clear();
  jest.restoreAllMocks();
});

function Probe() {
  const { listaItems, agregarItem, removerItem, vaciar, obtenerTotales } = useCarrito();

  const handleAdd = () => {
    // agrega 2 items distintos y una variante con size
    agregarItem({ id: 10, name: 'Torta', price: 5000 }, 2);            // qty 2
    agregarItem({ id: 11, name: 'Brownie', price: 1500 }, 1);          // qty 1
    agregarItem({ id: 12, name: 'Cheesecake', price: 4200 }, 1, 'XL'); // con size
  };

  const handleRemoveOne = () => {
    removerItem(11);          // quita Brownie
  };

  const handleRemoveVariant = () => {
    removerItem(12, 'XL');    // quita variante XL del Cheesecake
  };

  const handleClear = () => {
    vaciar();
  };

  const totals = obtenerTotales();

  return (
    <div>
      <button onClick={handleAdd}>agregar</button>
      <button onClick={handleRemoveOne}>removerUno</button>
      <button onClick={handleRemoveVariant}>removerVariante</button>
      <button onClick={handleClear}>vaciar</button>

      <output aria-label="len">{listaItems.length}</output>
      <output aria-label="sub">{totals.sub}</output>
      <output aria-label="iva">{totals.iva}</output>
      <output aria-label="total">{totals.total}</output>
    </div>
  );
}

test('agregarItem calcula sub/iva/total y persiste en localStorage (ms_carrito)', () => {
  render(
    <ProveedorCarrito>
      <Probe />
    </ProveedorCarrito>
  );

  fireEvent.click(screen.getByText('agregar'));

  // sub: 5000*2 + 1500*1 + 4200*1 = 15700
  const sub = Number(screen.getByLabelText('sub').textContent);
  const iva = Number(screen.getByLabelText('iva').textContent);
  const total = Number(screen.getByLabelText('total').textContent);
  const len = Number(screen.getByLabelText('len').textContent);

  expect(sub).toBe(15700);
  expect(iva).toBe(Math.round(15700 * 0.19));
  expect(total).toBe(sub + iva);
  expect(len).toBe(3);

  const saved = JSON.parse(localStorage.getItem('ms_carrito') || '[]');
  expect(saved).toHaveLength(3);
  expect(saved).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ id: 10, name: 'Torta', price: 5000, qty: 2 }),
      expect.objectContaining({ id: 11, name: 'Brownie', price: 1500, qty: 1 }),
      expect.objectContaining({ id: 12, name: 'Cheesecake', price: 4200, qty: 1, size: 'XL' }),
    ])
  );
});

test('removerItem quita por id y por (id + size); vaciar limpia y persiste', () => {
  render(
    <ProveedorCarrito>
      <Probe />
    </ProveedorCarrito>
  );

  // Sembrar datos
  fireEvent.click(screen.getByText('agregar'));

  // Remueve Brownie (id 11)
  fireEvent.click(screen.getByText('removerUno'));
  let len = Number(screen.getByLabelText('len').textContent);
  expect(len).toBe(2);

  // Remueve variante cheesecake XL (id 12, size "XL")
  fireEvent.click(screen.getByText('removerVariante'));
  len = Number(screen.getByLabelText('len').textContent);
  expect(len).toBe(1);

  // Vaciar todo
  fireEvent.click(screen.getByText('vaciar'));
  len = Number(screen.getByLabelText('len').textContent);
  expect(len).toBe(0);

  const saved = JSON.parse(localStorage.getItem('ms_carrito') || '[]');
  expect(saved).toHaveLength(0);
});

test('useCarrito lanza error si se usa fuera de ProveedorCarrito', () => {
  // componente que intenta usar el hook sin provider
  const Orphan = () => {
    // debe lanzar
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCarrito();
    return null;
  };

  // atrapamos el error para aserción
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => render(<Orphan />)).toThrow(
    /useCarrito debe usarse dentro de <ProveedorCarrito>\./i
  );

  spy.mockRestore();
});
