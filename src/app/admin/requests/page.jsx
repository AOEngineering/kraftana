import { quickRequestStatusAction, updateRequestAction } from "@/app/admin/actions"
import { updateMessageStatusAction } from "@/app/admin/actions"
import AdminSetupNotice from "@/components/admin/AdminSetupNotice"
import AdminShell from "@/components/admin/AdminShell"
import { Button } from "@/components/ui/button"
import { requireAdminSession } from "@/lib/adminAuth"
import { getAdminSetupError } from "@/lib/adminRuntime"
import { fetchContactMessagesFromDb } from "@/lib/db/contactMessages"
import { fetchCustomRequestsFromDb } from "@/lib/db/customRequests"
import { getRequiredDb, getServerEnv } from "@/lib/db/d1"
import { fetchFeedbackFromDb } from "@/lib/db/feedback"

export const dynamic = "force-dynamic"

export default async function AdminRequestsPage({ searchParams }) {
  await requireAdminSession("/admin/requests")
  const setupError = await getAdminSetupError()

  if (setupError) {
    return (
      <AdminShell title="Requests" description="Review custom requests and update their status.">
        <AdminSetupNotice message={setupError} />
      </AdminShell>
    )
  }

  const db = getRequiredDb(getServerEnv())
  const params = await searchParams
  const view = params?.view || "requests"
  const requestStatus = params?.requestStatus || "all"
  const messageStatus = params?.messageStatus || "all"
  const messageType = params?.messageType || "all"
  const page = Math.max(1, Number(params?.page || 1))
  const pageSize = 8
  const requests = await fetchCustomRequestsFromDb(db, { status: requestStatus })
  const [messages, feedback] = await Promise.all([
    fetchContactMessagesFromDb(db, { status: messageStatus }),
    fetchFeedbackFromDb(db, { status: messageStatus }),
  ])
  const messageItems = [
    ...messages.map((item) => ({ ...item, itemType: "contact" })),
    ...feedback.map((item) => ({ ...item, itemType: "feedback" })),
  ]
    .filter((item) => messageType === "all" || item.itemType === messageType)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
  const totalPages = Math.max(1, Math.ceil(requests.length / pageSize))
  const messageTotalPages = Math.max(1, Math.ceil(messageItems.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const safeMessagePage = Math.min(page, messageTotalPages)
  const pagedRequests = requests.slice((safePage - 1) * pageSize, safePage * pageSize)
  const pagedMessages = messageItems.slice(
    (safeMessagePage - 1) * pageSize,
    safeMessagePage * pageSize
  )

  function statusClass(value) {
    if (value === "new") return "bg-[rgba(196,120,74,0.18)] text-[rgb(133,77,45)]"
    if (value === "quoted" || value === "in_progress") return "bg-[rgba(91,132,192,0.18)] text-[rgb(46,79,130)]"
    if (value === "completed") return "bg-[rgba(82,146,104,0.18)] text-[rgb(40,102,61)]"
    if (value === "archived") return "bg-[rgba(120,120,120,0.14)] text-[rgb(84,84,84)]"
    return "bg-[rgba(140,110,90,0.16)] text-[rgb(102,74,56)]"
  }

  function getContactSummary(request) {
    if (request.email && request.phone) return `${request.email} | ${request.phone}`
    if (request.email) return request.email
    if (request.phone) return request.phone
    return "No contact details saved"
  }

  function getShippingSummary(request) {
    const shipping = request.shippingAddress
    if (!shipping?.line1 || !shipping?.city || !shipping?.state || !shipping?.postalCode || !shipping?.country) {
      return null
    }

    return {
      line1: shipping.line1,
      line2: shipping.line2,
      locality: `${shipping.city}, ${shipping.state} ${shipping.postalCode}`.trim(),
      country: shipping.country,
    }
  }

  function formatYarnSummary(selection) {
    if (!selection?.length) return "No yarn selected"
    return selection
      .map((item) => `${item.line || "Yarn"} ${item.code || "00"} - ${item.name || "Unknown"}`)
      .join(", ")
  }

  function messageStatusClass(value) {
    if (value === "new") return "bg-[rgba(196,120,74,0.18)] text-[rgb(133,77,45)]"
    if (value === "reviewed") return "bg-[rgba(91,132,192,0.18)] text-[rgb(46,79,130)]"
    if (value === "archived") return "bg-[rgba(120,120,120,0.14)] text-[rgb(84,84,84)]"
    return "bg-[rgba(140,110,90,0.16)] text-[rgb(102,74,56)]"
  }

  return (
    <AdminShell
      title="Requests"
      description="Review custom order inquiries, understand what the customer wants, and decide the next step with plain, guided actions."
    >
      <section className="admin-surface rounded-[2rem] p-6 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <form className="flex flex-wrap items-end gap-4">
            <label className="grid gap-2 text-sm">
              <span>View</span>
              <select name="view" defaultValue={view} className="admin-input">
                <option value="requests">Requests</option>
                <option value="messages">Messages</option>
              </select>
            </label>
            {view === "requests" ? (
              <label className="grid gap-2 text-sm">
                <span>Status</span>
                <select name="requestStatus" defaultValue={requestStatus} className="admin-input">
                  <option value="all">All</option>
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="quoted">Quoted</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
            ) : (
              <>
                <label className="grid gap-2 text-sm">
                  <span>Status</span>
                  <select name="messageStatus" defaultValue={messageStatus} className="admin-input">
                    <option value="all">All</option>
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm">
                  <span>Type</span>
                  <select name="messageType" defaultValue={messageType} className="admin-input">
                    <option value="all">All</option>
                    <option value="contact">Contact</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </label>
              </>
            )}
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-4 text-sm"
            >
              Apply filter
            </button>
          </form>
          <a
            href={view === "messages" ? "/admin/messages/export" : "/admin/requests/export"}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-1)] px-4 text-sm text-foreground/70"
          >
            Export PDF
          </a>
        </div>
      </section>

      {view === "requests" ? (
      <section className="grid gap-4">
        {pagedRequests.length ? (
          pagedRequests.map((request) => (
            <article key={request.id} className="admin-surface rounded-[2rem] p-6 sm:p-7">
              {(() => {
                const shipping = getShippingSummary(request)
                return (
                  <details className="group" open={request.status === "new"}>
                    <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 rounded-[1.2rem] bg-[color:var(--surface-1)] px-4 py-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-[color:var(--foreground)]">{request.requestNumber}</span>
                          <span className={`admin-pill ${statusClass(request.status)}`}>{request.status}</span>
                        </div>
                        <div className="mt-1 truncate text-sm text-foreground/58">
                          {request.name} | {getContactSummary(request)} | {request.itemType || "Custom piece"}
                        </div>
                      </div>
                      <span className="text-xs uppercase tracking-[0.18em] text-foreground/46 group-open:hidden">Expand</span>
                      <span className="hidden text-xs uppercase tracking-[0.18em] text-foreground/46 group-open:inline">Collapse</span>
                    </summary>

                    <div className="mt-4 grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                      <div className="max-w-4xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-semibold text-[color:var(--foreground)]">{request.requestNumber}</div>
                          <span className={`admin-pill ${statusClass(request.status)}`}>{request.status}</span>
                        </div>
                        <div className="mt-2 text-sm text-foreground/58">
                          {request.name} | {getContactSummary(request)} | {request.itemType || "Custom piece"}
                        </div>
                        <div className="mt-2 text-xs uppercase tracking-[0.18em] text-foreground/46">
                          {request.createdAt}
                        </div>

                        <div className="mt-5 rounded-[1.4rem] bg-[color:var(--surface-1)] p-4 sm:p-5">
                          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/46">
                            Customer wants
                          </div>
                          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-3">
                            <div className="rounded-[1rem] bg-white/70 px-4 py-3 dark:bg-white/5">
                              <div className="text-foreground/55">Item</div>
                              <div className="mt-1 font-medium text-[color:var(--foreground)]">
                                {request.itemType || "Custom piece"}
                              </div>
                            </div>
                            <div className="rounded-[1rem] bg-white/70 px-4 py-3 dark:bg-white/5">
                              <div className="text-foreground/55">Size</div>
                              <div className="mt-1 font-medium text-[color:var(--foreground)]">
                                {request.sizeText || "Not specified"}
                              </div>
                            </div>
                            <div className="rounded-[1rem] bg-white/70 px-4 py-3 dark:bg-white/5">
                              <div className="text-foreground/55">Colors</div>
                              <div className="mt-1 font-medium text-[color:var(--foreground)]">
                                {request.paletteNotes || "Not specified"}
                              </div>
                            </div>
                            <div className="rounded-[1rem] bg-white/70 px-4 py-3 dark:bg-white/5">
                              <div className="text-foreground/55">Category / Idea</div>
                              <div className="mt-1 font-medium text-[color:var(--foreground)]">
                                {request.category || "General request"}
                              </div>
                            </div>
                            <div className="rounded-[1rem] bg-white/70 px-4 py-3 dark:bg-white/5 sm:col-span-2 xl:col-span-1">
                              <div className="text-foreground/55">Yarn selected</div>
                              <div className="mt-1 font-medium text-[color:var(--foreground)]">
                                {formatYarnSummary(request.selectedYarns)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3 text-sm leading-7 text-foreground/66">
                          <div>
                            <div className="font-medium text-[color:var(--foreground)]">Who is asking?</div>
                            <div>{request.name}</div>
                          </div>
                          <div>
                            <div className="font-medium text-[color:var(--foreground)]">How should Kevonne follow up?</div>
                            <div>{getContactSummary(request)}</div>
                          </div>
                          {shipping ? (
                            <div>
                              <div className="font-medium text-[color:var(--foreground)]">Shipping address</div>
                              <div>{shipping.line1}</div>
                              {shipping.line2 ? <div>{shipping.line2}</div> : null}
                              <div>{shipping.locality}</div>
                              <div>{shipping.country}</div>
                            </div>
                          ) : null}
                          <div>
                            <div className="font-medium text-[color:var(--foreground)]">Do I have enough information?</div>
                            <div>
                              {request.sizeText || request.paletteNotes
                                ? "There are enough basics here to follow up or move this toward a quote."
                                : "You may want to ask a follow-up question before quoting."}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-[color:var(--foreground)]">What should I do next?</div>
                            <div>{request.adminNotes || "Review the details, decide whether more information is needed, then move this toward a quote when you are ready."}</div>
                          </div>
                          {request.message ? (
                            <div>
                              <div className="font-medium text-[color:var(--foreground)]">Anything else they shared?</div>
                              <div>{request.message}</div>
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <form action={quickRequestStatusAction}>
                            <input type="hidden" name="id" value={request.id} />
                            <input type="hidden" name="intent" value="reviewed" />
                            <input type="hidden" name="currentNotes" value={request.adminNotes || ""} />
                            <Button type="submit" variant="outline" className="h-11">
                              Mark reviewed
                            </Button>
                          </form>
                          <form action={quickRequestStatusAction}>
                            <input type="hidden" name="id" value={request.id} />
                            <input type="hidden" name="intent" value="needs_info" />
                            <input type="hidden" name="currentNotes" value={request.adminNotes || ""} />
                            <Button type="submit" variant="outline" className="h-11">
                              Needs more info
                            </Button>
                          </form>
                          <form action={quickRequestStatusAction}>
                            <input type="hidden" name="id" value={request.id} />
                            <input type="hidden" name="intent" value="quote" />
                            <input type="hidden" name="currentNotes" value={request.adminNotes || ""} />
                            <Button type="submit" className="h-11">
                              Ready to quote
                            </Button>
                          </form>
                          <form action={quickRequestStatusAction}>
                            <input type="hidden" name="id" value={request.id} />
                            <input type="hidden" name="intent" value="archive" />
                            <input type="hidden" name="currentNotes" value={request.adminNotes || ""} />
                            <Button type="submit" variant="outline" className="h-11">
                              Archive
                            </Button>
                          </form>
                        </div>
                      </div>

                      <div className="grid gap-3 xl:rounded-[1.7rem] xl:bg-[rgba(255,255,255,0.4)] xl:p-4">
                        <form action={updateRequestAction} className="grid gap-3">
                          <input type="hidden" name="id" value={request.id} />
                          <select name="status" defaultValue={request.status} className="admin-input">
                            <option value="new">New</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="quoted">Quoted</option>
                            <option value="in_progress">In progress</option>
                            <option value="completed">Completed</option>
                            <option value="archived">Archived</option>
                          </select>
                          <textarea
                            name="adminNotes"
                            rows={5}
                            defaultValue={request.adminNotes}
                            placeholder="Add notes for follow-up, quote details, or what still needs confirmation."
                            className="admin-textarea"
                          />
                          <div className="rounded-[1rem] bg-[color:var(--surface-1)] px-4 py-3 text-sm leading-7 text-foreground/62">
                            Once the details feel clear, use <span className="font-medium text-[color:var(--foreground)]">Ready to quote</span> above and keep any quote details in your notes for now.
                          </div>
                          <button
                            type="submit"
                            className="inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#b7776d,#915a51)] px-4 text-sm font-semibold text-white"
                          >
                            Save request notes
                          </button>
                        </form>
                      </div>
                    </div>
                  </details>
                )
              })()}
            </article>
          ))
        ) : (
          <div className="admin-empty text-sm leading-7 text-foreground/64">
            No custom requests match this view yet. Try a different status or share the custom request link with customers.
          </div>
        )}
      </section>
      ) : (
        <section className="grid gap-4">
          {pagedMessages.length ? (
            pagedMessages.map((item) => (
              <form key={`${item.itemType}-${item.id}`} action={updateMessageStatusAction} className="admin-surface rounded-[2rem] p-5 sm:p-6">
                <input type="hidden" name="type" value={item.itemType} />
                <input type="hidden" name="id" value={item.id} />
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-medium text-[color:var(--foreground)]">
                    {item.itemType === "contact" ? item.subject || "Message" : item.type}
                  </div>
                  <span className={`admin-pill ${messageStatusClass(item.status || "new")}`}>{item.status || "new"}</span>
                </div>
                <div className="mt-2 text-sm text-foreground/58">
                  {item.itemType === "contact" ? `${item.name} | ${item.email}` : item.pagePath || "Site feedback"}
                </div>
                {item.createdAt ? (
                  <div className="mt-2 text-xs uppercase tracking-[0.18em] text-foreground/46">
                    {item.createdAt}
                  </div>
                ) : null}
                <p className="mt-4 text-sm leading-7 text-foreground/70">{item.message}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="submit"
                    name="status"
                    value="reviewed"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-4 text-sm"
                  >
                    Mark reviewed
                  </button>
                  <button
                    type="submit"
                    name="status"
                    value="archived"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--line-soft)] bg-[color:var(--surface-1)] px-4 text-sm text-foreground/70"
                  >
                    Archive
                  </button>
                </div>
              </form>
            ))
          ) : (
            <div className="admin-empty text-sm leading-7 text-foreground/64">
              No messages match this view yet. Try another filter.
            </div>
          )}
        </section>
      )}

      {view === "requests" && totalPages > 1 ? (
        <section className="admin-surface rounded-[2rem] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="text-foreground/62">
              Page {safePage} of {totalPages}
            </div>
            <div className="flex flex-wrap gap-2">
              {safePage > 1 ? (
                <a
                  href={`/admin/requests?view=requests&requestStatus=${encodeURIComponent(requestStatus)}&page=${safePage - 1}`}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--line-soft)] px-4"
                >
                  Previous
                </a>
              ) : null}
              {safePage < totalPages ? (
                <a
                  href={`/admin/requests?view=requests&requestStatus=${encodeURIComponent(requestStatus)}&page=${safePage + 1}`}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--line-soft)] px-4"
                >
                  Next
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
      {view === "messages" && messageTotalPages > 1 ? (
        <section className="admin-surface rounded-[2rem] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="text-foreground/62">
              Page {safeMessagePage} of {messageTotalPages}
            </div>
            <div className="flex flex-wrap gap-2">
              {safeMessagePage > 1 ? (
                <a
                  href={`/admin/requests?view=messages&messageStatus=${encodeURIComponent(messageStatus)}&messageType=${encodeURIComponent(messageType)}&page=${safeMessagePage - 1}`}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--line-soft)] px-4"
                >
                  Previous
                </a>
              ) : null}
              {safeMessagePage < messageTotalPages ? (
                <a
                  href={`/admin/requests?view=messages&messageStatus=${encodeURIComponent(messageStatus)}&messageType=${encodeURIComponent(messageType)}&page=${safeMessagePage + 1}`}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--line-soft)] px-4"
                >
                  Next
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </AdminShell>
  )
}
