import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FORMSPREE_URL = "https://formspree.io/f/xwlpnyjb";

type Status = "idle" | "sending" | "success" | "error";

export function NewsletterSignup({ dark = false }: { dark?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: new FormData(form).get("email"),
          "form-type": "kekera-newsletter",
          _subject: "New Kekera newsletter signup",
        }),
      });
      if (!response.ok) throw new Error("signup failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        className={`flex items-start gap-3 border p-5 ${dark ? "border-paper/25 bg-paper/5" : "border-foreground/25 bg-paper"}`}
        role="status"
      >
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-signal" aria-hidden="true" />
        <div>
          <p className="font-display text-lg font-semibold">You are on the list.</p>
          <p className={`mt-1 text-sm ${dark ? "text-paper/70" : "text-muted-foreground"}`}>
            The Growth Ledger lands once a month. Unsubscribe anytime.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          autoComplete="email"
          disabled={status === "sending"}
          className={`h-12 rounded-none border px-4 text-base md:text-sm ${
            dark
              ? "border-paper/35 bg-transparent text-paper placeholder:text-paper/45"
              : "border-input bg-transparent"
          }`}
        />
        <Button
          type="submit"
          variant={dark ? "inverted" : "editorial"}
          size="editorial"
          disabled={status === "sending"}
          className="shrink-0"
        >
          {status === "sending" ? "Joining…" : "Subscribe"} <ArrowRight />
        </Button>
      </div>
      {status === "error" && (
        <p className="mt-3 flex items-center gap-2 text-sm text-destructive" role="alert">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          Something went wrong. Please try again, or email us directly.
        </p>
      )}
    </form>
  );
}
