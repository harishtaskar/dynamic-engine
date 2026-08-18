import { DashboardModel } from "../models/dashboard.model";
import { templates } from "../data/demo-dashboard";

export async function seedDashboards() {
  console.log("Seeding dashboards...");

  await DashboardModel.deleteMany({});

  const dashboards = templates.map(
    (template) => ({
      name: template.name,
      prompt: template.prompt,
      headline: template.headline,
      subtitle: template.subtitle,
      layout: "grid-3-col" as const,
      theme: "dark" as const,
      widgets: template.widgets,
    }),
  );

  await DashboardModel.insertMany(
    dashboards,
  );

  console.log(
    `Seeded ${dashboards.length} dashboard(s)`,
  );
}
