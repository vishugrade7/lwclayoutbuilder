'use client';

import { Button } from './ui/button';
import { ThemeSwitcher } from './layout-composer/ThemeSwitcher';
import { FileCode } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="px-4 sm:px-6 py-3 bg-card/80 border-b backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold font-headline text-foreground whitespace-nowrap">
          Layout Composer
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="https://lwcformbuilder.codbbit.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" size="sm">
            <FileCode className="h-4 w-4 mr-2" />
            LWC Form Builder
          </Button>
        </Link>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
