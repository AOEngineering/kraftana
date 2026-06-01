import { redirect } from "next/navigation"

export default async function AdminMessagesPage() {
  redirect("/admin/requests?view=messages")
}
