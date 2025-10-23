import { render, screen } from '@testing-library/react'

function Demo() { return <h1>Hola pruebas</h1> }

test('renderiza sin explotar', () => {
  render(<Demo />)
  expect(screen.getByText('Hola pruebas')).toBeInTheDocument()
})

