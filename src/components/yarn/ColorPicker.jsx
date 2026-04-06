"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ColorSwatch from "./ColorSwatch";
import { YARN_COLORS, YARN_BRANDS, YARN_LINES } from "./colors";

/* --- utils exported (you referenced these earlier) --- */
export function hexToRgb(hex) {
  const c = hex.replace("#", "");
  const n = parseInt(c.length === 3 ? c.split("").map(x => x + x).join("") : c, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
export function distRGB(a, b) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}
/* ---------------------------------------------------- */

export default function ColorPicker({
  value = [],              // array of selected IDs
  onChange = () => {},
  max = 6,                 // limit number of selected skeins
  allowDuplicates = false, // if you want same shade twice, set true
}) {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("any");
  const [line, setLine] = useState("any");

  const filtered = useMemo(() => {
    const qn = q.trim().toLowerCase();
    return YARN_COLORS.filter(c => {
      const matchesQ = !qn || c.name.toLowerCase().includes(qn) || c.id.toLowerCase().includes(qn);
      const matchesBrand = brand === "any" || c.brand === brand;
      const matchesLine = line === "any" || c.line === line;
      return matchesQ && matchesBrand && matchesLine;
    });
  }, [q, brand, line]);

  function toggle(id) {
    if (allowDuplicates) {
      onChange([...value, id]);
      return;
    }
    const set = new Set(value);
    if (set.has(id)) {
      set.delete(id);
    } else {
      if (set.size >= max) return; // hard cap
      set.add(id);
    }
    onChange(Array.from(set));
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="space-y-1">
          <Label htmlFor="yarn-q">Search</Label>
          <Input id="yarn-q" placeholder="name or code…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Brand</Label>
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger><SelectValue placeholder="Any brand" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {YARN_BRANDS.map(b => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Line</Label>
          <Select value={line} onValueChange={setLine}>
            <SelectTrigger><SelectValue placeholder="Any line" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {YARN_LINES.map(l => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {filtered.map(c => (
          <ColorSwatch key={c.id} color={c} selected={value.includes(c.id)} onToggle={toggle} />
        ))}
      </div>

      <div className="text-xs text-black/60">
        Selected {value.length}/{max}{allowDuplicates ? " (duplicates allowed)" : ""}
      </div>
    </div>
  );
}
