import { Zap } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-card shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary">
          <Zap className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground font-headline">
          Lightning Layout Composer
        </h1>
      </div>
      <ThemeSwitcher />
    </header>
  );
}
