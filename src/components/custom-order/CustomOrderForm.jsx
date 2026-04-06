"use client"

import { useDeferredValue, useEffect, useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Clock3, Mail, Palette, Sparkles, Upload } from "lucide-react"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { YARN_BY_ID, HOBBII_HONEY_BUNNY, HOBBII_RAINBOW_84 } from "@/components/yarn/colors"

const Schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  itemType: z.string().min(1, "Select an item type"),
  size: z.string().min(1, "Choose a size"),
  colors: z.string().optional(),
  personalization: z.string().optional(),
  deadline: z.string().optional(),
  budget: z.coerce.number().min(0, "Budget cannot be negative"),
  message: z.string().min(5, "Tell us a little more"),
  deposit: z.boolean().default(false),
  contactOk: z.boolean().refine((value) => value === true, { message: "Please allow us to contact you" }),
  yarnLine: z.string().min(1, "Choose a yarn line"),
  colorIds: z.array(z.string()).min(1, "Pick at least one skein"),
})

const ITEM_TYPES = [
  { value: "throw", label: "Throw blanket" },
  { value: "doll", label: "Keepsake doll" },
  { value: "pillow", label: "Decor pillow" },
  { value: "baby-set", label: "Baby set" },
  { value: "wearable", label: "Wearable" },
  { value: "other", label: "Other" },
]

const SIZES = [
  { value: "baby", label: "Baby" },
  { value: "lap", label: "Lap" },
  { value: "twin", label: "Twin" },
  { value: "queen", label: "Queen" },
  { value: "king", label: "King" },
  { value: "custom", label: "Custom size" },
]

const YARN_LINES = {
  "Honey Bunny": HOBBII_HONEY_BUNNY,
  "Rainbow Cotton 8/4": HOBBII_RAINBOW_84,
}

const COLOR_KEYWORDS = [
  { match: ["white", "natural", "oat", "vanilla"], tone: ["#f7f1e7", "#ece2d3"], ink: "#756254" },
  { match: ["beige", "nude", "almond", "toffee", "nougat", "caramel", "brown", "chocolate"], tone: ["#ddc1a6", "#9c7354"], ink: "#4a3328" },
  { match: ["yellow", "gold", "ochre", "curry", "egg", "lemon"], tone: ["#f3d878", "#d59b38"], ink: "#5a4315" },
  { match: ["orange", "peach", "apricot", "pumpkin", "rust", "coral"], tone: ["#efb189", "#c96d44"], ink: "#5f311d" },
  { match: ["red", "tomato", "bordeaux", "cerise"], tone: ["#d98b8d", "#ab4d56"], ink: "#542428" },
  { match: ["pink", "rose", "candy", "floss"], tone: ["#efc2cf", "#c47f9a"], ink: "#5d3240" },
  { match: ["purple", "plum", "lilac", "lavender", "aubergine", "wisteria"], tone: ["#cdbde3", "#8a72b7"], ink: "#413055" },
  { match: ["blue", "turquoise", "aqua", "indigo", "jeans", "petrol", "cobalt", "sky"], tone: ["#b7d1e8", "#5f8fbe"], ink: "#2e4965" },
  { match: ["green", "mint", "olive", "sage", "lime", "teal", "eucalyptus", "shamrock", "jungle"], tone: ["#c9dbc2", "#6f9371"], ink: "#2f4831" },
  { match: ["grey", "gray", "anthracite", "black", "mist"], tone: ["#d5d3d6", "#7a7881"], ink: "#36343b" },
]

function getBudgetHint(budget) {
  const amount = Number(budget || 0)
  if (amount < 80) return "Small accessory range"
  if (amount < 160) return "Simple throw or small set"
  if (amount < 300) return "Mid-size throw or detailed piece"
  return "Large or more complex project"
}

function findLabel(options, value) {
  return options.find((option) => option.value === value)?.label || "Not chosen yet"
}

function getSkeinPalette(skein) {
  const label = `${skein.name} ${skein.code}`.toLowerCase()
  const match = COLOR_KEYWORDS.find((entry) => entry.match.some((keyword) => label.includes(keyword)))

  if (match) {
    return {
      background: `linear-gradient(135deg, ${match.tone[0]}, ${match.tone[1]})`,
      chip: match.tone[0],
      ink: match.ink,
    }
  }

  const seed = Number.parseInt(String(skein.code).replace(/\D/g, "").slice(-3) || "37", 10)
  const hue = seed % 360
  return {
    background: `linear-gradient(135deg, hsl(${hue} 56% 84%), hsl(${(hue + 32) % 360} 48% 66%))`,
    chip: `hsl(${hue} 56% 84%)`,
    ink: "hsl(18 20% 28%)",
  }
}

function SkeinCard({ skein, selected, onToggle }) {
  const palette = getSkeinPalette(skein)

  return (
    <button
      type="button"
      onClick={() => onToggle(skein.id)}
      className={cn(
        "group rounded-[1.15rem] border p-2 text-left transition duration-200",
        selected
          ? "border-[rgba(145,90,81,0.34)] bg-[color:var(--surface-4)] shadow-[0_14px_34px_rgba(87,56,47,0.12)]"
          : "border-[color:var(--line-soft)] bg-[color:var(--surface-3)] hover:-translate-y-0.5 hover:border-[rgba(145,90,81,0.24)] hover:bg-[color:var(--surface-4)]"
      )}
      aria-pressed={selected}
    >
      <div className="relative overflow-hidden rounded-[0.95rem] p-3" style={{ background: palette.background }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-6 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ backgroundColor: "color-mix(in srgb, var(--surface-4) 78%, transparent)", color: palette.ink }}>
              {skein.line}
            </div>
            <div className="text-base font-semibold" style={{ color: palette.ink }}>
              {skein.code}
            </div>
          </div>
          <span className={cn("inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[11px] font-semibold transition", selected ? "bg-[rgba(71,56,49,0.9)] text-white" : "bg-[color:var(--surface-3)] text-[color:var(--foreground)]")}>
            {selected ? "On" : "Add"}
          </span>
        </div>
      </div>
      <div className="px-1 pb-1 pt-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border border-white/50" style={{ backgroundColor: palette.chip }} aria-hidden="true" />
          <p className="truncate text-sm font-semibold text-[color:var(--foreground)]">{skein.name}</p>
        </div>
        <p className="mt-1 text-xs leading-5 text-foreground/58">{skein.brand}</p>
      </div>
    </button>
  )
}

export default function CustomOrderForm() {
  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: "",
      email: "",
      itemType: "",
      size: "",
      colors: "",
      personalization: "",
      deadline: "",
      budget: 150,
      message: "",
      deposit: false,
      contactOk: true,
      yarnLine: "",
      colorIds: [],
    },
    mode: "onChange",
  })

  const [inspirationFile, setInspirationFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [open, setOpen] = useState(false)
  const [skeinQuery, setSkeinQuery] = useState("")
  const [showAllSkeins, setShowAllSkeins] = useState(false)

  const deferredSkeinQuery = useDeferredValue(skeinQuery)
  const [yarnLine = "", selectedIds = [], itemType = "", size = "", budget = 150] = useWatch({
    control: form.control,
    name: ["yarnLine", "colorIds", "itemType", "size", "budget"],
  })

  const skeins = useMemo(() => (yarnLine ? YARN_LINES[yarnLine] || [] : []), [yarnLine])

  const filteredSkeins = useMemo(() => {
    const query = deferredSkeinQuery.trim().toLowerCase()
    if (!query) return skeins
    return skeins.filter((skein) => {
      const searchText = `${skein.name} ${skein.code} ${skein.brand} ${skein.line}`.toLowerCase()
      return searchText.includes(query)
    })
  }, [deferredSkeinQuery, skeins])

  const visibleSkeins = useMemo(() => {
    if (showAllSkeins || deferredSkeinQuery.trim()) return filteredSkeins
    return filteredSkeins.slice(0, 24)
  }, [deferredSkeinQuery, filteredSkeins, showAllSkeins])

  const selectedSkeins = useMemo(() => selectedIds.map((id) => YARN_BY_ID[id]).filter(Boolean), [selectedIds])
  const budgetHint = useMemo(() => getBudgetHint(budget), [budget])
  const isSubmitting = form.formState.isSubmitting

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  useEffect(() => {
    setSkeinQuery("")
    setShowAllSkeins(false)
  }, [yarnLine])

  function onPickFile(event) {
    const file = event.target.files?.[0]

    if (preview) URL.revokeObjectURL(preview)

    if (!file) {
      setInspirationFile(null)
      setPreview(null)
      return
    }

    setInspirationFile(file)
    setPreview(URL.createObjectURL(file))
  }

  function toggleSkein(id) {
    const current = form.getValues("colorIds") || []
    const isSelected = current.includes(id)

    if (isSelected) {
      form.setValue("colorIds", current.filter((value) => value !== id), { shouldValidate: true, shouldDirty: true })
      return
    }

    if (current.length >= 6) {
      toast.message("You can pick up to 6 skeins")
      return
    }

    form.setValue("colorIds", [...current, id], { shouldValidate: true, shouldDirty: true })
  }

  function resetAll() {
    if (preview) URL.revokeObjectURL(preview)
    form.reset()
    setInspirationFile(null)
    setPreview(null)
    setSkeinQuery("")
    setShowAllSkeins(false)
  }

  async function onSubmit(values) {
    const resolvedColors = (values.colorIds || []).map((id) => YARN_BY_ID[id]).filter(Boolean)
    const body = {
      ...values,
      resolvedColors,
      inspiration_name: inspirationFile?.name || null,
      inspiration_type: inspirationFile?.type || null,
    }

    try {
      const response = await fetch("/api/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data?.ok) throw new Error(data?.error || "Failed to submit")

      setOpen(true)
      resetAll()
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : "Could not submit. Please try again.")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.78fr)]"
      >
        <div className="grid gap-6">
          <Card className="paper-panel rounded-[2rem] border-0 py-0">
            <CardHeader className="px-6 pt-6 sm:px-7">
              <CardTitle className="font-display text-3xl leading-none text-[color:var(--foreground)]">
                Project details
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-7 text-foreground/66">
                Start with the type of piece, the size, the yarn family, and the feel you want. The
                clearer the starting point, the faster the quote feels useful.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-5 px-6 pb-6 sm:px-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="itemType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]">
                            <SelectValue placeholder="Select item" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ITEM_TYPES.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SIZES.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="yarnLine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yarn line</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          form.setValue("colorIds", [], { shouldValidate: true, shouldDirty: true })
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]">
                            <SelectValue placeholder="Select yarn line" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(YARN_LINES).map((line) => (
                            <SelectItem key={line} value={line}>
                              {line}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose the yarn family before picking colors.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2 rounded-[1rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-3">
                          <span className="text-sm text-foreground/60">$</span>
                          <Input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            step="10"
                            {...field}
                            onChange={(event) => field.onChange(event.target.value)}
                            className="h-11 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>{budgetHint}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="personalization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal touches</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Initials, gift note, trim detail"
                          {...field}
                          className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                        />
                      </FormControl>
                      <FormDescription>Lead time is confirmed after review.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project notes</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Describe the mood, use case, must-haves, and anything you want the finished piece to feel like."
                        {...field}
                        className="min-h-32 rounded-[1.15rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="paper-panel rounded-[2rem] border-0 py-0">
            <CardHeader className="px-6 pt-6 sm:px-7">
              <CardTitle className="flex items-center gap-2 text-xl text-[color:var(--foreground)]">
                <Palette className="h-5 w-5 text-[color:var(--primary)]" />
                Color direction
              </CardTitle>
              <CardDescription className="text-sm leading-7 text-foreground/66">
                The old picker was waiting on missing yarn image files. This version uses local,
                instant color cards so the page stays responsive and the options appear immediately.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-5 px-6 pb-6 sm:px-7">
              <FormField
                control={form.control}
                name="colorIds"
                render={() => (
                  <FormItem className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                      <div>
                        <FormLabel>Pick your skeins</FormLabel>
                        <FormDescription>
                          Choose up to 6 shades from <span className="font-medium">{yarnLine || "a yarn line first"}</span>.
                        </FormDescription>
                      </div>

                      {yarnLine ? (
                        <Input
                          value={skeinQuery}
                          onChange={(event) => setSkeinQuery(event.target.value)}
                          placeholder="Search by code or name"
                          className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)] md:w-64"
                        />
                      ) : null}
                    </div>

                    {!yarnLine ? (
                      <div className="rounded-[1.25rem] border border-dashed border-[color:var(--line-soft)] bg-[color:var(--surface-1)] p-5 text-sm leading-7 text-foreground/60">
                        Choose a yarn line above and the color cards will appear here.
                      </div>
                    ) : (
                      <>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          {visibleSkeins.map((skein) => (
                            <SkeinCard key={skein.id} skein={skein} selected={selectedIds.includes(skein.id)} onToggle={toggleSkein} />
                          ))}
                        </div>
                        {filteredSkeins.length > 24 && !deferredSkeinQuery.trim() ? (
                          <div className="flex items-center justify-between gap-3 rounded-[1.1rem] bg-[color:var(--surface-1)] px-4 py-3 text-sm text-foreground/60">
                            <span>
                              Showing {visibleSkeins.length} of {filteredSkeins.length} shades.
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setShowAllSkeins((value) => !value)}
                            >
                              {showAllSkeins ? "Show fewer" : "Show all"}
                            </Button>
                          </div>
                        ) : null}

                        <div className="rounded-[1.25rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-1)] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground/48">
                            Selected skeins
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {selectedSkeins.length === 0 ? (
                              <span className="text-sm text-foreground/55">No shades selected yet.</span>
                            ) : (
                              selectedSkeins.map((skein) => (
                                <button
                                  key={skein.id}
                                  type="button"
                                  onClick={() => toggleSkein(skein.id)}
                                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(145,90,81,0.18)] bg-[color:var(--surface-4)] px-3 py-1.5 text-sm text-[color:var(--foreground)] transition hover:border-[rgba(145,90,81,0.28)]"
                                >
                                  <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: getSkeinPalette(skein).chip }}
                                    aria-hidden="true"
                                  />
                                  {skein.code} {skein.name}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extra color notes</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Example: cream base, dusty rose trim, muted sage accents"
                        {...field}
                        className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                      />
                    </FormControl>
                    <FormDescription>Use this for balance, contrast, or placement notes.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="paper-panel rounded-[2rem] border-0 py-0">
            <CardHeader className="px-6 pt-6 sm:px-7">
              <CardTitle className="flex items-center gap-2 text-xl text-[color:var(--foreground)]">
                <Upload className="h-5 w-5 text-[color:var(--primary)]" />
                Inspiration
              </CardTitle>
              <CardDescription className="text-sm leading-7 text-foreground/66">
                Add a reference for your own preview, or paste a link in the notes field. File uploads
                are not sent with the request yet.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4 px-6 pb-6 sm:px-7">
              <div className="grid gap-2">
                <Label htmlFor="inspiration-upload">Inspiration image</Label>
                <Input
                  id="inspiration-upload"
                  type="file"
                  accept="image/*"
                  onChange={onPickFile}
                  className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                />
              </div>

              {preview ? (
                <div className="overflow-hidden rounded-[1.4rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] p-3">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem]">
                    <img src={preview} alt="Inspiration preview" className="h-full w-full object-cover" />
                  </div>
                  <p className="mt-3 text-sm text-foreground/60">{inspirationFile?.name}</p>
                </div>
              ) : (
                <div className="rounded-[1.25rem] border border-dashed border-[color:var(--line-soft)] bg-[color:var(--surface-1)] p-5 text-sm leading-7 text-foreground/60">
                  No image added yet. You can also paste links or reference notes in the project
                  details field above.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:sticky lg:top-24 lg:self-start">
          <Card className="paper-panel rounded-[2rem] border-0 py-0">
            <CardHeader className="px-6 pt-6 sm:px-7">
              <CardTitle className="font-display text-3xl leading-none text-[color:var(--foreground)]">
                Your info
              </CardTitle>
              <CardDescription className="text-sm leading-7 text-foreground/66">
                You&apos;ll get a reply with a quote, timeline, and any clarifying questions.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4 px-6 pb-6 sm:px-7">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        {...field}
                        className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        {...field}
                        className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deposit preference</FormLabel>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value === "yes")}
                      value={field.value ? "yes" : "no"}
                      className="grid gap-2 sm:grid-cols-2"
                    >
                      <Label
                        htmlFor="dep-yes"
                        className="flex cursor-pointer items-center gap-3 rounded-[1rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-4 py-3"
                      >
                        <RadioGroupItem value="yes" id="dep-yes" />
                        Deposit okay
                      </Label>
                      <Label
                        htmlFor="dep-no"
                        className="flex cursor-pointer items-center gap-3 rounded-[1rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-4 py-3"
                      >
                        <RadioGroupItem value="no" id="dep-no" />
                        No deposit
                      </Label>
                    </RadioGroup>
                    <FormDescription>Large or custom-heavy projects may need a small deposit.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactOk"
                render={({ field }) => (
                  <FormItem className="rounded-[1rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-3)] px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <FormLabel className="m-0">Allow email contact</FormLabel>
                        <FormDescription>Used only for this request and follow-up details.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="px-6 pb-6 sm:px-7">
              <div className="w-full rounded-[1.35rem] border border-[color:var(--line-soft)] bg-[color:var(--surface-1)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground/48">
                  What happens next
                </p>
                <div className="mt-4 grid gap-3 text-sm text-foreground/64">
                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-4 w-4 text-[color:var(--primary)]" />
                    <span>You&apos;ll get a review and quote after the request is checked.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 text-[color:var(--primary)]" />
                    <span>Color, size, and finishing details are confirmed before work begins.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 text-[color:var(--primary)]" />
                    <span>A Stripe invoice or checkout can be sent when the project is ready.</span>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card className="paper-panel rounded-[2rem] border-0 py-0">
            <CardHeader className="px-6 pt-6 sm:px-7">
              <CardTitle className="text-xl text-[color:var(--foreground)]">Request summary</CardTitle>
              <CardDescription className="text-sm leading-7 text-foreground/66">
                A quick check before you submit.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4 px-6 pb-6 sm:px-7">
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-3 rounded-[1rem] bg-[color:var(--surface-1)] px-4 py-3">
                  <span className="text-foreground/55">Item</span>
                  <span className="font-medium text-[color:var(--foreground)]">{findLabel(ITEM_TYPES, itemType)}</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-[1rem] bg-[color:var(--surface-1)] px-4 py-3">
                  <span className="text-foreground/55">Size</span>
                  <span className="font-medium text-[color:var(--foreground)]">{findLabel(SIZES, size)}</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-[1rem] bg-[color:var(--surface-1)] px-4 py-3">
                  <span className="text-foreground/55">Yarn line</span>
                  <span className="font-medium text-[color:var(--foreground)]">{yarnLine || "Not chosen yet"}</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-[1rem] bg-[color:var(--surface-1)] px-4 py-3">
                  <span className="text-foreground/55">Skeins</span>
                  <span className="font-medium text-[color:var(--foreground)]">{selectedIds.length} selected</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-[1rem] bg-[color:var(--surface-1)] px-4 py-3">
                  <span className="text-foreground/55">Budget</span>
                  <span className="font-medium text-[color:var(--foreground)]">${Number(budget || 0)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Submitting..." : "Submit request"}
                </Button>
                <Button type="button" variant="outline" onClick={resetAll} className="w-full">
                  Reset form
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request received</DialogTitle>
            <DialogDescription>
              Thank you for your note. We will reply by email with a plan and a quote.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  )
}
