import { PDFDocument, StandardFonts } from "pdf-lib"

function wrapText(text, maxChars = 96) {
  const value = String(text || "").replace(/\s+/g, " ").trim()
  if (!value) return [""]
  const words = value.split(" ")
  const lines = []
  let current = ""

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length <= maxChars) {
      current = next
      continue
    }
    lines.push(current)
    current = word
  }

  if (current) lines.push(current)
  return lines
}

function drawLine(page, font, text, x, y, size = 10) {
  page.drawText(text, { x, y, size, font })
}

export async function buildSimpleReportPdf({ title, subtitle = "", sections = [] }) {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  let page = pdf.addPage([612, 792])
  const margin = 48
  const lineHeight = 13
  let y = 760

  function ensureSpace(linesNeeded = 1) {
    if (y - linesNeeded * lineHeight < 60) {
      page = pdf.addPage([612, 792])
      y = 760
    }
  }

  drawLine(page, bold, title, margin, y, 16)
  y -= 18
  if (subtitle) {
    drawLine(page, font, subtitle, margin, y, 10)
    y -= 16
  }
  drawLine(page, font, `Generated: ${new Date().toISOString()}`, margin, y, 9)
  y -= 20

  for (const section of sections) {
    ensureSpace(3)
    drawLine(page, bold, section.heading, margin, y, 12)
    y -= 14

    for (const row of section.rows) {
      const lines = wrapText(row, 96)
      ensureSpace(lines.length + 1)
      for (const line of lines) {
        drawLine(page, font, line, margin, y, 10)
        y -= lineHeight
      }
      y -= 3
    }

    y -= 8
  }

  return Buffer.from(await pdf.save())
}

