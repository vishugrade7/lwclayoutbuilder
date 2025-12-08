import { LayoutComposerPage } from '@/components/layout-composer/LayoutComposerPage';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <p className="text-lg text-foreground">Loading Composer...</p>
        </div>
      }
    >
      <LayoutComposerPage />
    </Suspense>
  );
}
