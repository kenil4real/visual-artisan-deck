import { useState, type FormEvent } from "react";

const FORMSPREE_URL = "https://formspree.io/f/xwlpnyjb";

type Status = "idle" | "sending" | "success" | "error";

export function NewsletterSignup() {
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
      <div className="nl-success" role="status">
        <p className="nl-success-title">You are on the list.</p>
        <p className="micro">The Growth Ledger lands once a month. Unsubscribe anytime.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="audit-form nl-form" noValidate={false}>
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder="you@company.com"
        autoComplete="email"
        disabled={status === "sending"}
        aria-label="Email address"
      />
      <button className="btn btn-accent" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Joining…" : "Subscribe"}
      </button>
      {status === "error" && (
        <p className="micro nl-error" role="alert">
          Something went wrong. Please try again, or email us directly.
        </p>
      )}
    </form>
  );
}
