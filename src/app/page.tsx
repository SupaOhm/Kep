import { Camera, ChartNoAxesColumnIncreasing, ShieldCheck } from "lucide-react";
import { GoogleSignInButton } from "@/features/auth/google-sign-in-button";

export default async function LandingPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const nextPath =
    params.next?.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : "/dashboard";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 font-bold text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-black text-slate-950">
            K
          </span>
          <span>Kep</span>
        </div>
      </nav>

      <section className="grid flex-1 items-center gap-10 py-12 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-4 inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
            Thai-first expense tracking
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-ink sm:text-6xl">
            Know where
            <br />
            <span className="text-accent">your money</span>
            <br />
            went.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            Upload Thai bank slips, confirm with OCR, and stay on top of daily
            spending — all in your browser.
          </p>
          <div className="mt-8 max-w-xs">
            <GoogleSignInButton nextPath={nextPath} />
            {params.error ? (
              <p className="mt-3 text-sm text-danger">{params.error}</p>
            ) : null}
            <p className="mt-3 text-xs leading-5 text-muted">
              Signed in with Google via Supabase Auth. No slip images stored by
              default.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-line/60 bg-surface p-5 shadow-soft">
          <div className="rounded-xl bg-elevated p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted">
                  Today
                </p>
                <p className="mt-1.5 tabular-nums text-3xl font-bold tracking-tight text-ink">
                  ฿420.00
                </p>
              </div>
              <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                ฿580 left
              </span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-line">
              <div className="h-full w-[42%] rounded-full bg-accent" />
            </div>
            <p className="mt-2 text-xs text-muted">of ฿1,000.00 daily limit</p>
          </div>

          <div className="mt-4 grid gap-2">
            {[
              {
                icon: Camera,
                title: "Thai bank slip OCR",
                text: "Upload a slip, review the draft, then save."
              },
              {
                icon: ChartNoAxesColumnIncreasing,
                title: "Daily · Weekly · Monthly",
                text: "Leftover or exceeded — always visible."
              },
              {
                icon: ShieldCheck,
                title: "Privacy-first",
                text: "No paid APIs. No slip storage by default."
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-xl border border-line/60 bg-canvas/50 p-3"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    <p className="mt-0.5 text-xs text-muted">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
