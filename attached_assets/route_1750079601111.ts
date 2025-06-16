import { NextRequest, NextResponse } from 'next/server'
import { stagiaireService } from '@/lib/services/stagiaires-service'
import { demandesService } from '@/lib/services/demandes-service'
import { documentsService } from '@/lib/services/documents-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'

    let data: any[] = []
    let filename = ''

    switch (params.type) {
      case 'stagiaires':
        data = await stagiairesService.getAll()
        filename = 'stagiaires'
        break
      case 'demandes':
        data = await demandesService.getAll()
        filename = 'demandes'
        break
      case 'documents':
        data = await documentsService.getAll()
        filename = 'documents'
        break
      default:
        return NextResponse.json({ error: 'Type d\'export non supporté' }, { status: 400 })
    }

    if (format === 'csv') {
      const csv = convertToCSV(data)
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`
        }
      })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        return typeof value === 'string' ? `"${value}"` : value
      }).join(',')
    )
  ].join('\n')

  return csvContent
}