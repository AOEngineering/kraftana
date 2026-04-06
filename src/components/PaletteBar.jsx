"use client"

export default function PaletteBar() {
  const swatches = [
    { name: "Forest", hex: "#2F3A2E" },
    { name: "Bark",   hex: "#4B4236" },
    { name: "Ochre",  hex: "#A57A2C" },
    { name: "Sage",   hex: "#7DA576" },
    { name: "Blush",  hex: "#FBE9EC" },
    { name: "Linen",  hex: "#FFF8F4" },
  ]
  return (
    <div className="grid grid-cols-6 gap-2">
      {swatches.map(s => (
        <div key={s.hex} className="rounded-2xl h-10 border" style={{ backgroundColor: s.hex, borderColor: "rgba(0,0,0,0.06)" }} title={`${s.name} ${s.hex}`} />
      ))}
    </div>
  )
}
