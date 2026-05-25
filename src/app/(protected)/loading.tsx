import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-8">
      <div className="mb-4 h-16 rounded-lg border border-line bg-surface/70" />
      <div className="grid gap-4">
        <Card className="h-28 animate-pulse" />
        <div className="grid gap-3 md:grid-cols-3">
          <Card className="h-36 animate-pulse" />
          <Card className="h-36 animate-pulse" />
          <Card className="h-36 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
