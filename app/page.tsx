import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/navigation/nav-bar";
import { Posts } from "@/components/posts";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <NavBar />
      <h1> This is the homepage (not much here yet) </h1>
      <Posts />
    </main>
  );
}
