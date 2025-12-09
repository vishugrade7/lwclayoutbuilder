'use client';

import { ThemeSwitcher } from './layout-composer/ThemeSwitcher';

export function Header() {

  return (
    <header className="px-4 sm:px-6 py-3 bg-card/80 border-b backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold font-headline text-foreground whitespace-nowrap">
          Layout Composer
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
      </div>
    </header>
  );
}
