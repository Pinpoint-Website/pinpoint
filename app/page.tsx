import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <NavBar />
      <h1> This is the homepage (not much here yet) </h1>
    </main>
  );
}
