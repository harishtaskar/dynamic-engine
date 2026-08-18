import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";

interface Props {
  children: ReactNode;
  widgetType: string;
}

interface State {
  hasError: boolean;
}

export class WidgetErrorBoundary extends Component<
  Props,
  State
> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(
    error: Error,
    errorInfo: ErrorInfo,
  ) {
    console.error(
      "Widget rendering error:",
      error,
      errorInfo,
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full rounded-xl border border-dashed border-border bg-card p-5 text-fg">
          <div className="text-[13px] font-semibold">
            Widget unavailable
          </div>

          <div className="mt-1 text-xs text-muted">
            The {this.props.widgetType} widget
            could not be rendered.
          </div>

          <button
            type="button"
            className="mt-4 rounded-lg bg-elevated px-3 py-1.5 text-[13px] font-semibold transition hover:brightness-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() =>
              this.setState({
                hasError: false,
              })
            }
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}