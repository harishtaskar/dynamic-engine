import { StatusBadges } from "./StatusBadges";

import {
  useDashboardStore,
} from "../../stores/dashboard.store";

export function InvestigationHeader() {
  const dashboard =
    useDashboardStore(
      (state) => state.dashboard,
    );

  const headline =
    dashboard?.headline ??
    dashboard?.name ??
    "Generating your dashboard…";

  const subtitle =
    dashboard?.subtitle ??
    (dashboard
      ? `Prompt: “${dashboard.prompt}”`
      : "Fetching insights from the backend.");

  return (
    <section>
      <h1 className="max-w-4xl text-[30px] font-bold leading-tight tracking-tight text-fg">
        {headline}
      </h1>

      <p className="mt-2 max-w-3xl text-[13px] leading-5 text-muted">
        {subtitle}
      </p>

      <div className="mt-4">
        <StatusBadges />
      </div>
    </section>
  );
}
