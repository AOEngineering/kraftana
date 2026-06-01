export default function Callouts() {
  const items = [
    { title: "Lead time", text: "Typically 7 to 14 days depending on project." },
    { title: "Care", text: "Gentle wash, air dry. Care notes included with every order." },
    { title: "Gifts", text: "Add a message at checkout. Wrapped with care." },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((c, i) => (
        <div
          key={i}
          className="rounded-2xl p-6 border bg-white"
          style={{ borderColor: "#eae6e2" }}
        >
          <h4 className="font-semibold text-kraft-forest">{c.title}</h4>
          <p className="text-sm text-kraft-bark/80 mt-1">{c.text}</p>
        </div>
      ))}
    </div>
  )
}
