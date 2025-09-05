'use client';

import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BackButton() {
  return (
    <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="-ml-2">
      <ChevronLeft className="mr-1" />
      Back
    </Button>
  );
}
