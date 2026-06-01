import { NextResponse } from "next/server"

import { getAdminSession } from "@/lib/adminAuth"
import { buildSimpleReportPdf } from "@/lib/adminPdf"
import { getOptionalDb, getServerEnv } from "@/lib/db/d1"
import { fetchCustomRequestsFromDb } from "@/lib/db/customRequests"

export async function GET(request) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  const db = getOptionalDb(getServerEnv())
  if (!db) {
    return new NextResponse("D1 is not configured.", { status: 503 })
  }

  const requests = await fetchCustomRequestsFromDb(db, { status: "all" })
  const rows = requests.map((item) => {
    const contact = [item.email, item.phone].filter(Boolean).join(" | ") || "no contact provided"
    const yarnSummary = (item.selectedYarns || [])
      .map((yarn) => `${yarn.line || "Yarn"} ${yarn.code || "00"} ${yarn.name || "Unknown"}`)
      .join(" | ")
    return [
      `Request: ${item.requestNumber} | Status: ${item.status}`,
      `Name: ${item.name} | Contact: ${contact}`,
      `Category: ${item.category || "General"} | Piece: ${item.itemType || "custom piece"} | Size: ${item.sizeText || "n/a"}`,
      `Guide: ${item.guideProduct || "n/a"} | Idea: ${item.customItemText || "n/a"}`,
      `Yarns: ${yarnSummary || "none selected"}`,
      `Colors: ${item.paletteNotes || "n/a"}`,
      item.message ? `Message: ${item.message}` : "Message: none",
      `Created: ${item.createdAt || item.created_at || ""}`,
    ].join(" || ")
  })

  const pdf = await buildSimpleReportPdf({
    title: "Kraftana Studio Requests Report",
    subtitle: `Total requests: ${requests.length}`,
    sections: [{ heading: "Requests", rows }],
  })

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="kraftana-requests.pdf"',
    },
  })
}
