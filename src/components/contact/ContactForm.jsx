"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getCookieConsentChoice } from "@/lib/cookie-consent"

const Schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  topic: z.string().min(1, "Choose a topic"),
  message: z.string().min(10, "Please share a little more"),
  website: z.string().optional().default(""),
})

const TOPICS = [
  { value: "feedback", label: "Site feedback" },
  { value: "custom-idea", label: "Custom idea" },
  { value: "product-question", label: "Product question" },
  { value: "general-note", label: "General note" },
]

export default function ContactForm() {
  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: "",
      email: "",
      topic: "",
      message: "",
      website: "",
    },
  })

  async function onSubmit(values) {
    const consent = getCookieConsentChoice()

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          cookieConsent: consent?.choice,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Could not send your note.")
      }

      toast.success("Your note has been sent.")
      form.reset()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not send your note."
      )
    }
  }

  return (
    <Card className="paper-panel rounded-[2rem] border-0 py-0">
      <CardHeader className="px-6 pt-6 sm:px-7">
        <CardTitle className="font-display text-3xl leading-none text-[color:var(--foreground)]">
          Share a note
        </CardTitle>
        <CardDescription className="text-sm leading-7 text-foreground/66">
          Send feedback, ask a question, or tell Kevonne what kind of handmade crochet piece you
          would love to see next.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-6 sm:px-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <input
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
              {...form.register("website")}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your name"
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
                        {...field}
                        placeholder="you@example.com"
                        className="h-11 rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full rounded-[1rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]">
                        <SelectValue placeholder="Choose a topic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TOPICS.map((topic) => (
                        <SelectItem key={topic.value} value={topic.value}>
                          {topic.label}
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
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={6}
                      placeholder="Tell Kevonne what you think, what you would love to wear, or what would make the site feel even more helpful."
                      className="min-h-32 rounded-[1.15rem] border-[color:var(--line-soft)] bg-[color:var(--surface-3)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
              {form.formState.isSubmitting ? "Sending..." : "Send note"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
