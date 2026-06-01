import { NextResponse } from "next/server"

export async function POST(request) {
  const body = await request.json().catch(() => ({}))

  return NextResponse.json({
    ok: true,
    receivedAt: new Date().toISOString(),
    hasCustomer: Boolean(body?.customer?.name),
    hasOrder: Boolean(body?.order?.itemType),
  })
}
