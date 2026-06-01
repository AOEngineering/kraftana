import Image from "next/image"
import { useState } from "react"

export default function ColorSwatch({
  color,
  selected,
  onToggle,
  compact = false,
}) {
  const hasImage = Boolean(color?.image)
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = hasImage && !imageFailed

  function handleImageError() {
    setImageFailed(true)
  }

  return (
    <button
      type="button"
      onClick={() => onToggle(color.id)}
      className={[
        "group relative overflow-hidden rounded-xl border border-[#e4cfba] bg-[#f7eadf] text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ad6f63]/40 focus-visible:ring-offset-2",
        selected
          ? "border-[#b56f63] shadow-[0_12px_24px_rgba(97,66,48,0.2)] ring-2 ring-[#b56f63]/20"
          : "hover:translate-y-[-2px]",
        compact ? "aspect-[4/3] w-full" : "aspect-square w-16 sm:w-18",
      ].join(" ")}
      aria-pressed={selected}
      aria-label={`${color.name} (${color.id})`}
      title={`${color.name} • ${color.brand} ${color.line} • ${color.id}`}
    >
      <div className="absolute inset-0">
        {showImage ? (
          <Image
            src={color.image}
            alt={`${color.name} yarn`}
            fill
            sizes={compact ? "12rem" : "3.5rem"}
            className="object-cover"
            onError={handleImageError}
          />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f7eadf] via-[#efdecd] to-[#e6ccb5] px-2 text-center text-[9px] font-medium uppercase tracking-[0.14em] text-[#7c6356]"
          >
            {color.code}
          </span>
        )}
      </div>

      <span
        className="pointer-events-none absolute inset-0 border border-white/55"
        style={{ backgroundColor: `rgba(255,255,255,${selected ? 0.28 : 0.08})` }}
      />

      <span
        className="pointer-events-none absolute right-2 bottom-2 left-2 rounded-md border border-white/70 bg-white/55 px-2 py-1 text-center text-[10px] font-medium leading-none text-[#6f554b] backdrop-blur-sm"
      >
        {color.code}
      </span>

      <span className="pointer-events-none absolute inset-x-2 top-2 z-10 flex items-center gap-1 text-[10px] font-medium text-[#6f554b]">
        <span
          className="h-2.5 w-2.5 rounded-full border border-white/70"
          style={{ backgroundColor: color.hex }}
        />
        <span className="truncate">{color.name}</span>
      </span>

      {selected ? (
        <span className="absolute -top-2 -right-2 z-20 rounded-full bg-[#ad6f63] px-1.5 py-1 text-[11px] text-white">
          ✓
        </span>
      ) : null}
    </button>
  )
}
