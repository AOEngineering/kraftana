import { NextResponse } from "next/server"

import { getAdminSession } from "@/lib/adminAuth"
import { buildSimpleReportPdf } from "@/lib/adminPdf"
import { fetchContactMessagesFromDb } from "@/lib/db/contactMessages"
import { getOptionalDb, getServerEnv } from "@/lib/db/d1"
import { fetchFeedbackFromDb } from "@/lib/db/feedback"

export async function GET(request) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  const db = getOptionalDb(getServerEnv())
  if (!db) {
    return new NextResponse("D1 is not configured.", { status: 503 })
  }

  const [messages, feedback] = await Promise.all([
    fetchContactMessagesFromDb(db, { status: "all" }),
    fetchFeedbackFromDb(db, { status: "all" }),
  ])

  const rows = [
    ...messages.map((item) => ({ source: "contact", ...item })),
    ...feedback.map((item) => ({ source: "feedback", ...item })),
  ]

  const lines = rows.map((item) => {
    const title = item.source === "contact" ? (item.subject || "message") : (item.type || "feedback")
    const who = item.source === "contact" ? `${item.name || "unknown"} <${item.email || "no-email"}>` : (item.pagePath || "site")
    return [
      `Source: ${item.source} | Status: ${item.status || "new"} | Topic: ${title}`,
      `From: ${who}`,
      `Message: ${item.message || ""}`,
      `Created: ${item.createdAt || item.created_at || ""}`,
    ].join(" || ")
  })

  const pdf = await buildSimpleReportPdf({
    title: "Kraftana Studio Messages Report",
    subtitle: `Total items: ${rows.length}`,
    sections: [{ heading: "Messages and Feedback", rows: lines }],
  })

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="kraftana-messages.pdf"',
    },
  })
}
