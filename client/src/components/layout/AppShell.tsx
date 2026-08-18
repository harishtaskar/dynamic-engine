import type { ReactNode } from "react";
import { TopBar } from "../dashboard/TopBar";

interface AppShellProps {
  sidebar: ReactNode;
  children: ReactNode;
  history?: ReactNode;
  prompt?: ReactNode;
}

/**
 * Three floating plates on a lit canvas.
 *
 * The sidebar runs the full height; the top bar is deliberately transparent so
 * the ambient glow behind the app reads across it, and the workspace plate
 * starts below it. The prompt is passed in rather than stacked underneath —
 * it docks *inside* the workspace plate so it floats over the content.
 */
export function AppShell({
  sidebar,
  children,
  history,
  prompt,
}: AppShellProps) {
  return (
    <div className="app-ambient relative flex h-screen gap-5 overflow-hidden bg-canvas p-2 text-fg">
      <div className="relative z-10 flex min-w-0 flex-1 gap-5">
        {sidebar}

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />

          <div className="flex min-h-0 flex-1 gap-5">
            <main className="panel-glow relative min-w-0 flex-1 overflow-hidden rounded-2xl bg-panel">
              <div className="relative h-full overflow-y-auto">
                {children}
              </div>

              {prompt}
            </main>

            {history}
          </div>
        </div>
      </div>
    </div>
  );
}
