"use client";

import { useEffect, useRef } from "react";
import { incrementViewCount } from "@/lib/actions/increment-view-count";

// This component has no UI. It's just for running a client-side effect.
export default function ViewTracker({ postId }: { postId: string }) {
  const hasIncremented = useRef(false);
  
  useEffect(() => {
    // only run the effect once
    if (!hasIncremented.current) {
      // then mark it as ran
      hasIncremented.current = true;

      // call the server action 
      // The empty dependency array [] ensures this effect runs
      // ONLY ONCE when the component first mounts on the client.
      incrementViewCount(postId);
    }
  }, [postId]); // Add postId to dependency array as a best practice

  return null; // It renders nothing.
}