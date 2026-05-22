import { ArrowRight, Camera, ChartNoAxesColumnIncreasing, ShieldCheck } from "lucide-react";
import { GoogleSignInButton } from "@/features/auth/google-sign-in-button";

export default async function LandingPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-sm font-bold text-canvas">
            K
          </span>
          Kep
        </div>
      </nav>
      <section className="grid flex-1 items-center gap-10 py-12 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-3 text-sm font-medium text-accent">Thai-first expense tracking</p>
          <h1 className="text-5xl font-semibold tracking-tight text-ink sm:text-6xl">Kep</h1>
          <p className="mt-4 max-w-xl text-xl leading-8 text-muted">Know where your money went.</p>
          <div className="mt-8 max-w-sm">
            <GoogleSignInButton />
            {params.error ? <p className="mt-3 text-sm text-danger">{params.error}</p> : null}
            <p className="mt-3 text-xs leading-5 text-muted">
              Sign in with Google through Supabase Auth. Slip images are processed in your browser and are not
              stored by default.
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-surface p-4 shadow-soft">
          <div className="rounded-lg bg-elevated p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Today</p>
                <p className="mt-1 text-3xl font-semibold text-ink">฿420.00</p>
              </div>
              <span className="rounded-full bg-accent/15 px-3 py-1 text-sm font-medium text-accent">
                ฿580 left
              </span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-line">
              <div className="h-full w-[42%] rounded-full bg-accent" />
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {[
              { icon: Camera, title: "Thai bank slip OCR", text: "Upload a slip, review the draft, then save." },
              {
                icon: ChartNoAxesColumnIncreasing,
                title: "Daily, weekly, monthly budgets",
                text: "Track leftover or exceeded spending without rollover complexity."
              },
              { icon: ShieldCheck, title: "Privacy-first MVP", text: "No paid APIs and no slip image storage by default." }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-3 rounded-lg border border-line bg-elevated p-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="font-medium text-ink">{item.title}</p>
                    <p className="mt-1 text-sm text-muted">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-muted">
            Ready for verification APIs later <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </section>
    </main>
  );
}
