import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import React, { type ReactElement } from 'react'
import type { DocumentProps } from '@react-pdf/renderer'
import { CatalogPDF } from '@/components/pdf/CatalogPDF'
import { getProperties } from '@/lib/properties'
import { PROPERTIES } from '@/data/properties'
import type { Property } from '@/data/properties'

export const maxDuration = 60 // seconds — needed for large catalogs

export async function POST(req: Request) {
  try {
    const { ids } = await req.json() as { ids: string[] }

    let all: Property[] = []
    try {
      all = await getProperties()
      if (all.length === 0) all = PROPERTIES
    } catch {
      all = PROPERTIES
    }

    const properties = ids && ids.length > 0
      ? all.filter(p => ids.includes(p.id))
      : all

    if (properties.length === 0) {
      return NextResponse.json({ error: 'Nenhum imóvel encontrado' }, { status: 404 })
    }

    const element = React.createElement(CatalogPDF, { properties }) as ReactElement<DocumentProps>
    const buffer = await renderToBuffer(element)

    const date = new Date().toISOString().split('T')[0]

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="catalogo-${date}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('PDF generation error:', err)
    return NextResponse.json({ error: 'Erro ao gerar PDF' }, { status: 500 })
  }
}
