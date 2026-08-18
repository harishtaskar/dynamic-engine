import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import type {
  BarChartWidget,
} from "../../../types/widget";

import {
  WidgetCard,
  WidgetCardHeader,
} from "../WidgetCard";

interface BarChartProps {
  widget: BarChartWidget;
}

interface TooltipEntry {
  value?: number;
  payload?: {
    label: string;
  };
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  unit?: string;
}

function ChartTooltip({
  active,
  payload,
  unit,
}: ChartTooltipProps) {
  const entry = payload?.[0];

  if (!active || !entry) {
    return null;
  }

  return (
    <div className="rounded-md border border-border bg-elevated px-2.5 py-1.5 text-xs shadow-md">
      <div className="text-muted">
        {entry.payload?.label}
      </div>

      <div className="mt-0.5 font-medium tabular-nums text-fg">
        {entry.value?.toLocaleString()}
        {unit ? ` ${unit}` : ""}
      </div>
    </div>
  );
}

export function BarChart({
  widget,
}: BarChartProps) {
  const {
    bars = [],
    unit,
  } = widget.data;

  return (
    <WidgetCard>
      <WidgetCardHeader title={widget.title} />

      {bars.length === 0 ? (
        <p className="px-5 py-4 text-xs text-muted">
          No data to chart.
        </p>
      ) : (
        <div className="min-h-40 w-full min-w-0 flex-1 px-3 pb-5">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <RechartsBarChart
              accessibilityLayer
              data={bars}
              margin={{
                top: 8,
                right: 0,
                bottom: 0,
                left: 0,
              }}
              barCategoryGap="16%"
            >
              <XAxis
                dataKey="label"
                hide
              />

              <Tooltip
                cursor={false}
                content={
                  <ChartTooltip unit={unit} />
                }
              />

              <Bar
                dataKey="value"
                name={widget.title}
                fill="var(--color-accent)"
                isAnimationActive={false}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      )}
    </WidgetCard>
  );
}
