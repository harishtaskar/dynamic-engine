import { Suspense } from "react";

import { motion } from "framer-motion";

import type {
  DashboardWidget,
} from "../types/widget";

import { WidgetSkeleton } from "../components/skeletons/WidgetSkeleton";
import { UnknownWidget } from "./UnknownWidget";
import { WidgetErrorBoundary } from "./WidgetErrorBoundary";
import { widgetRegistry } from "./widget-registry";

interface WidgetRendererProps {
  dashboardId: string;

  widget:
    | DashboardWidget
    | {
        id: string;
        type: string;
        title?: string;
      };
}

export function WidgetRenderer({
  dashboardId,
  widget,
}: WidgetRendererProps) {
  const Component =
    widgetRegistry[
      widget.type as keyof typeof widgetRegistry
    ];

  const content = !Component ? (
    <UnknownWidget
      type={widget.type}
      id={widget.id}
    />
  ) : (
    <WidgetErrorBoundary
      widgetType={widget.type}
    >
      <Suspense
        fallback={<WidgetSkeleton />}
      >
        <Component
          dashboardId={dashboardId}
          widget={
            widget as DashboardWidget
          }
        />
      </Suspense>
    </WidgetErrorBoundary>
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="h-full"
    >
      {content}
    </motion.div>
  );
}
