import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Link href="/" className="font-semibold tracking-tight text-lg">Pinpoint</Link>
          <p className="text-sm text-muted-foreground">Build together. Solve real problems.</p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link href="/create-post" className="hover:text-foreground transition-colors">Create</Link>
        </nav>
      </div>
    </footer>
  );
}
