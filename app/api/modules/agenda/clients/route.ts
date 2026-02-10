import { NextResponse } from 'next/server'

export async function GET() {
  const sample = [
    {
      id: '1',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '3001234567',
      nit: '900123456-7',
    },
    {
      id: '2',
      firstName: 'María',
      lastName: 'Gómez',
      email: 'maria.gomez@example.com',
      phone: '3107654321',
      nit: '900765432-1',
    },
  ]

  return NextResponse.json(sample)
}
