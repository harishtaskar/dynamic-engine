import {
  useMemo,
  useState,
} from "react";

import {
  ArrowUp,
  Atom,
  ChevronDown,
  Globe,
  Mic,
  Paperclip,
  Settings2,
  Sparkles,
} from "lucide-react";

const suggestions = [
  "High risk accounts review",
  "Real-time system analytics",
  "Sales performance overview",
  "Fraud monitoring dashboard",
  "Web traffic and engagement",
  "API latency by region",
  "Show critical accounts by region",
];

const roundButtonClass =
  "flex size-8 shrink-0 items-center justify-center rounded-full bg-elevated text-fg transition hover:brightness-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const pillClass =
  "flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-elevated px-3 text-xs font-semibold text-fg transition hover:brightness-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

interface PromptBarProps {
  onSubmit: (
    prompt: string,
  ) => void | Promise<void>;
  isGenerating: boolean;
}

export function PromptBar({
  onSubmit,
  isGenerating,
}: PromptBarProps) {
  const [prompt, setPrompt] =
    useState("");

  const [focused, setFocused] =
    useState(false);

  const [activeIndex, setActiveIndex] =
    useState(-1);

  const filtered = useMemo(() => {
    const query = prompt
      .trim()
      .toLowerCase();

    if (!query) {
      return suggestions;
    }

    return suggestions.filter(
      (item) =>
        item
          .toLowerCase()
          .includes(query),
    );
  }, [prompt]);

  const open =
    focused && filtered.length > 0;

  const submitPrompt = async (
    value: string,
  ) => {
    if (
      !value.trim() ||
      isGenerating
    ) {
      return;
    }

    setFocused(false);
    setActiveIndex(-1);
    setPrompt("");

    await onSubmit(value);
  };

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();
    await submitPrompt(prompt);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent,
  ) => {
    if (!open) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) =>
        index + 1 >= filtered.length
          ? 0
          : index + 1,
      );
    } else if (
      event.key === "ArrowUp"
    ) {
      event.preventDefault();
      setActiveIndex((index) =>
        index <= 0
          ? filtered.length - 1
          : index - 1,
      );
    } else if (event.key === "Enter") {
      if (activeIndex >= 0) {
        event.preventDefault();
        void submitPrompt(
          filtered[activeIndex],
        );
      }
    } else if (
      event.key === "Escape"
    ) {
      setFocused(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center px-8">
      <div className="pointer-events-auto relative w-full max-w-[700px]">
        {open && (
          <ul
            role="listbox"
            className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-2xl border border-border bg-elevated py-1 shadow-2xl"
          >
            {filtered.map(
              (item, index) => (
                <li
                  key={item}
                  role="option"
                  aria-selected={
                    index === activeIndex
                  }
                >
                  <button
                    type="button"
                    onMouseEnter={() =>
                      setActiveIndex(index)
                    }
                    onMouseDown={(event) => {
                      event.preventDefault();
                      void submitPrompt(item);
                    }}
                    className={`flex w-full items-center gap-2 px-4 py-2 text-left text-[13px] transition ${
                      index === activeIndex
                        ? "bg-card text-fg"
                        : "text-muted hover:bg-card hover:text-fg"
                    }`}
                  >
                    <Sparkles className="size-3.5 shrink-0 opacity-60" />
                    {item}
                  </button>
                </li>
              ),
            )}
          </ul>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-[22px] bg-card/95 px-3.5 pt-5 pb-4 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.8)] ring-1 ring-border backdrop-blur-xl focus-within:ring-ring/40"
        >
          <input
            value={prompt}
            onChange={(event) => {
              setPrompt(event.target.value);
              setActiveIndex(-1);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Type your request here..."
            aria-label="Describe your dashboard"
            className="mb-5 block w-full bg-transparent px-1.5 text-sm leading-5 text-fg outline-none placeholder:text-muted"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Attach a file"
              className={roundButtonClass}
            >
              <Paperclip className="size-4" />
            </button>

            <button
              type="button"
              className={pillClass}
            >
              Full Analysis
              <ChevronDown className="size-3 text-muted" />
            </button>

            <button
              type="button"
              aria-label="Analysis settings"
              className={roundButtonClass}
            >
              <Settings2 className="size-4" />
            </button>

            <button
              type="button"
              aria-label="Choose model"
              className={roundButtonClass}
            >
              <Atom className="size-4" />
            </button>

            <button
              type="button"
              className={pillClass}
            >
              <Globe className="size-3.5" />
              EN
              <ChevronDown className="size-3 text-muted" />
            </button>

            <div className="flex-1" />

            <button
              type="button"
              aria-label="Dictate"
              className={roundButtonClass}
            >
              <Mic className="size-4" />
            </button>

            <button
              type="submit"
              disabled={isGenerating}
              aria-label="Generate dashboard"
              className={`${roundButtonClass} disabled:opacity-50`}
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
