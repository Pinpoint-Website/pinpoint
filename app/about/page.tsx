import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Bridging Innovation Gaps
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Pinpoint connects businesses with real problems to entrepreneurs with innovative solutions
        </p>
      </section>

      {/* Main Value Proposition */}
      <section className="space-y-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
              For Entrepreneurs
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Build Solutions People Actually Need
            </h2>
            <p className="text-muted-foreground">
              Access valuable market insight, reduce risk, and connect with potential first customers.
              Start your entrepreneurial journey with validated problems worth solving.
            </p>
          </div>
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
              For Businesses
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Surface Creative Solutions
            </h2>
            <p className="text-muted-foreground">
              Share your business challenges and tap into the innovative minds of tomorrow&apos;s founders.
              Find creative solutions while reducing overhead costs.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold tracking-tight text-center">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-lg font-medium text-primary-foreground">
              1
            </div>
            <h3 className="text-xl font-semibold">Share Challenges</h3>
            <p className="text-muted-foreground">
              Businesses post their unsolved problems and pain points on the platform
            </p>
          </div>
          <div className="space-y-3">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-lg font-medium text-primary-foreground">
              2
            </div>
            <h3 className="text-xl font-semibold">Connect</h3>
            <p className="text-muted-foreground">
              Entrepreneurs browse challenges and find opportunities that match their skills
            </p>
          </div>
          <div className="space-y-3">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-lg font-medium text-primary-foreground">
              3
            </div>
            <h3 className="text-xl font-semibold">Build Solutions</h3>
            <p className="text-muted-foreground">
              Create solutions with validated demand and a built-in customer base
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6 bg-secondary rounded-lg p-8">
        <h2 className="text-3xl font-semibold tracking-tight">
          Ready to Start Your Journey?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join Pinpoint today and be part of a community that&apos;s reshaping how entrepreneurs solve real business problems.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/auth/sign-up">Sign Up Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
