import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { content, type } = await request.json()

    // Pour l'instant, on retourne un PDF simple en base64
    // En production, vous pouvez utiliser une bibliothèque comme puppeteer ou jsPDF
    const pdfContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Document</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .content { line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Document Généré</h1>
          </div>
          <div class="content">
            ${content}
          </div>
        </body>
      </html>
    `

    return NextResponse.json({
      success: true,
      content: pdfContent,
      message: "PDF généré avec succès",
    })
  } catch (error) {
    console.error("Erreur génération PDF:", error)
    return NextResponse.json({ success: false, message: "Erreur lors de la génération du PDF" }, { status: 500 })
  }
}
