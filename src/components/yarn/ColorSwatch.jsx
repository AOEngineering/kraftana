"use client";

export default function ColorSwatch({ color, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(color.id)}
      className={[
        "group relative aspect-square w-14 rounded-xl border transition",
        selected ? "ring-2 ring-black border-black/10" : "border-black/10 hover:border-black/30"
      ].join(" ")}
      aria-pressed={selected}
      aria-label={`${color.name} (${color.id})`}
      title={`${color.name} • ${color.brand} ${color.line} • ${color.id}`}
    >
      <div className="absolute inset-0 rounded-xl" style={{ backgroundColor: color.hex }} />
      <div className="absolute bottom-1 left-1 right-1 text-[10px] leading-tight rounded px-1 py-[2px] bg-white/80 backdrop-blur-sm text-black/80 text-center">
        {color.name}
      </div>
      {selected && (
        <div className="absolute -top-1 -right-1 rounded-full bg-black text-white text-[10px] px-1.5 py-[1px]">
          ✓
        </div>
      )}
    </button>
  );
}
