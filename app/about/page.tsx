import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-16">
      {/* Hero Section: REFRAMED
        The headline is now worker-centric, focusing on their experience and voice.
        The sub-headline clearly states what the platform is: an anonymous, professional community.
      */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          From the Front Lines to the Bottom Line
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Pinpoint is the anonymous platform where verified professionals share
          the real story about the technology shaping their industries.
        </p>
      </section>

      <hr />

      {/* Main Value Proposition: RESTRUCTURED
        The audience is now split between the "data creators" (workers) and the
        "data consumers" (investors). The primary focus is on the workers' benefits.
      */}
      <section className="space-y-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
              For Professionals & Workers
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Share What Really Works (and What Doesn&apos;t)
            </h2>
            <p className="text-muted-foreground">
              Vent about buggy software, praise a tool that saves you hours, and
              discuss tech frustrations with peers who get it. Your identity is
              always anonymous, so you can speak freely.
            </p>
          </div>
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
              For Analysts & Investors
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Access a Real-Time Economic Signal
            </h2>
            <p className="text-muted-foreground">
              Leverage our AI-powered tools to tap into an unfiltered, real-time
              stream of insights on tech adoption, market gaps, and company
              performance—straight from the people on the ground.
            </p>
          </div>
        </div>
      </section>

      <hr />

      {/* How It Works: REWRITTEN
        The steps are now focused on the worker's journey and are transparent
        about how their contribution creates value.
      */}
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold tracking-tight text-center">
          How It Works
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-lg font-medium text-primary-foreground">
              1
            </div>
            <h3 className="text-xl font-semibold">Join Anonymously</h3>
            <p className="text-muted-foreground">
              Verify your employment to join private, industry-specific
              discussions. Your identity and personal information are never
              revealed or shared.
            </p>
          </div>
          <div className="space-y-3">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-lg font-medium text-primary-foreground">
              2
            </div>
            <h3 className="text-xl font-semibold">Share Your Experience</h3>
            <p className="text-muted-foreground">
              Discuss the tools, software, and tech challenges you face every
              day. Find community and validation with peers who understand your
              struggles.
            </p>
          </div>
          <div className="space-y-3">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-lg font-medium text-primary-foreground">
              3
            </div>
            <h3 className="text-xl font-semibold">Power Real Insight</h3>
            <p className="text-muted-foreground">
              Our AI aggregates the collective conversation into powerful,
              anonymized insights that reveal market trends and drive smarter
              investment decisions.
            </p>
          </div>
        </div>
      </section>

      <hr />

      {/* Call to Action: REFOCUSED
        The language is now about empowerment and joining a community, not an
        entrepreneurial "journey". The button text is also more specific.
      */}
      <section className="text-center space-y-6 bg-secondary rounded-lg p-8">
        <h2 className="text-3xl font-semibold tracking-tight">
          Make Your Voice Heard
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join a secure community of your peers and help shape the future of
          your industry. Your perspective is the missing data point.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/auth/sign-up">Sign Up Anonymously</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
