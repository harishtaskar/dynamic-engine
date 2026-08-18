import { DashboardModel } from "../models/dashboard.model.js";

import type {
  DashboardGenerationEvent,
} from "../schemas/dashboard-generation.schema";

import { pickTemplate } from "../data/demo-dashboard";

const LAYOUT = "grid-3-col" as const;
const THEME = "dark" as const;

export async function* generateDashboard(
  prompt: string,
): AsyncGenerator<DashboardGenerationEvent> {
  const template = pickTemplate(prompt);
  const seed = Date.now();

  const widgets = template.widgets.map(
    (widget, index) => ({
      ...widget,
      id: `${widget.id}_${seed}_${index}`,
    }),
  );

  // Every widget lands in the dashboard grid, so the placeholder count the
  // client reserves is simply how many are still on the way.
  const contentCount = widgets.length;

  const dashboard = await DashboardModel.create({
    name: template.name,
    prompt,
    headline: template.headline,
    subtitle: template.subtitle,
    layout: LAYOUT,
    theme: THEME,
    widgets: [],
  });

  yield {
    type: "meta",
    dashboardId: dashboard._id.toString(),
    name: template.name,
    prompt,
    layout: LAYOUT,
    theme: THEME,
    headline: template.headline,
    subtitle: template.subtitle,
    contentCount,
  };

  for (const widget of widgets) {
    await delay(500);

    dashboard.widgets.push(widget);
    await dashboard.save();

    yield {
      type: "widget",
      widget,
    };
  }

  yield {
    type: "done",
  };
}

function delay(
  ms: number,
) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms),
  );
}
