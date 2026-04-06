"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"

const cornerPositions = {
  "top-left": "items-start justify-start",
  "top-right": "items-start justify-end",
  "bottom-left": "items-end justify-start",
  "bottom-right": "items-end justify-end",
}

function CornerWatermark({ text, opacity, position, className }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-20 flex select-none p-4 sm:p-5",
        cornerPositions[position] || cornerPositions["bottom-right"],
        className
      )}
    >
      <span
        className="rounded-full border border-white/28 bg-[rgba(56,37,33,0.34)] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.36em] text-[rgba(255,250,246,0.96)] shadow-[0_12px_28px_rgba(0,0,0,0.18)] backdrop-blur-md sm:text-[11px]"
        style={{ opacity }}
      >
        {text}
      </span>
    </div>
  )
}

function PatternWatermark({ text, opacity, className }) {
  const rows = Array.from({ length: 6 }, () => `${text}  ${text}  ${text}  ${text}`)

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-[-22%] z-20 flex rotate-[-24deg] select-none flex-col items-center justify-center gap-9 overflow-hidden",
        className
      )}
      style={{ opacity }}
    >
      {rows.map((row, index) => (
        <span
          key={`${row}-${index}`}
          className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.4em] text-[rgba(255,250,246,0.72)] [text-shadow:0_1px_10px_rgba(0,0,0,0.16)] sm:text-[14px]"
        >
          {row}
        </span>
      ))}
    </div>
  )
}

export default function WatermarkedImage({
  watermarkText = "Kraftana",
  watermarkOpacity = 0.34,
  watermarkPosition = "bottom-right",
  watermarkMode = "corner",
  preventDrag = true,
  preventContextMenu = true,
  disableDrag,
  imageClassName,
  overlayClassName,
  className,
  alt,
  ...imageProps
}) {
  const isFill = Boolean(imageProps.fill)
  const dragBlocked = typeof disableDrag === "boolean" ? disableDrag : preventDrag

  const handleContextMenu = preventContextMenu
    ? (event) => {
        event.preventDefault()
      }
    : undefined

  const handleDragStart = dragBlocked
    ? (event) => {
        event.preventDefault()
      }
    : undefined

  return (
    <div
      className={cn(
        "group/image relative isolate h-full w-full overflow-hidden",
        isFill && "absolute inset-0",
        className
      )}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
    >
      <Image
        {...imageProps}
        alt={alt}
        quality={imageProps.quality ?? 82}
        draggable={dragBlocked ? false : imageProps.draggable}
        className={cn(
          "z-0 select-none object-cover transition-transform duration-300 ease-out group-hover/image:scale-[1.02]",
          imageClassName
        )}
      />

      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(20,12,10,0.02),rgba(20,12,10,0.05))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-[rgba(42,24,21,0.24)] via-transparent to-transparent" />

      {watermarkMode === "pattern" ? (
        <PatternWatermark text={watermarkText} opacity={watermarkOpacity} className={overlayClassName} />
      ) : (
        <CornerWatermark
          text={watermarkText}
          opacity={watermarkOpacity}
          position={watermarkPosition}
          className={overlayClassName}
        />
      )}
    </div>
  )
}
