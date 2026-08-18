import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

import { useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import {
  ArrowDown,
  ArrowUp,
  Search,
} from "lucide-react";

import clsx from "clsx";

import type { DataTableWidget } from "../../../types/widget";

import {
  WidgetCard,
  WidgetCardHeader,
} from "../WidgetCard";

type Row = Record<string, unknown>;

interface DataTableProps {
  widget: DataTableWidget;
}

function isNumericColumn(
  rows: Row[],
  key: string,
) {
  const sample = rows.find(
    (row) => row[key] != null,
  );

  return typeof sample?.[key] === "number";
}

export function DataTable({
  widget,
}: DataTableProps) {
  const [sorting, setSorting] =
    useState<SortingState>([]);

  const [globalFilter, setGlobalFilter] =
    useState("");

  const [filterOpen, setFilterOpen] =
    useState(false);

  const scrollRef =
    useRef<HTMLDivElement>(null);

  const columns = useMemo<
    ColumnDef<Row>[]
  >(
    () =>
      widget.data.columns.map(
        (column) => ({
          accessorKey: column.key,
          header: column.label,
        }),
      ),
    [widget.data.columns],
  );

  const alignment = useMemo(() => {
    const lastIndex =
      widget.data.columns.length - 1;

    return widget.data.columns.map(
      (column, index) => ({
        numeric: isNumericColumn(
          widget.data.rows,
          column.key,
        ),
        right:
          index === lastIndex ||
          isNumericColumn(
            widget.data.rows,
            column.key,
          ),
      }),
    );
  }, [widget.data]);

  const table = useReactTable({
    data: widget.data.rows,
    columns,

    state: {
      sorting,
      globalFilter,
    },

    onSortingChange: setSorting,
    onGlobalFilterChange:
      setGlobalFilter,

    getCoreRowModel:
      getCoreRowModel(),
    getSortedRowModel:
      getSortedRowModel(),
    getFilteredRowModel:
      getFilteredRowModel(),

    globalFilterFn: "includesString",
  });

  const rows = table.getRowModel().rows;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () =>
      scrollRef.current,
    estimateSize: () => 39,
    overscan: 8,
  });

  const gridTemplate = `1.6fr repeat(${Math.max(
    columns.length - 1,
    0,
  )}, minmax(0, 1fr))`;

  return (
    <WidgetCard className="group/card">
      <WidgetCardHeader
        title={widget.title}
        action={
          <button
            type="button"
            aria-label="Filter rows"
            aria-expanded={filterOpen}
            onClick={() =>
              setFilterOpen(
                (open) => !open,
              )
            }
            className={clsx(
              "flex size-5 items-center justify-center rounded transition group-hover/card:opacity-100 focus-visible:opacity-100",
              filterOpen
                ? "text-fg opacity-100"
                : "text-muted opacity-0 hover:text-fg",
            )}
          >
            <Search className="size-3.5" />
          </button>
        }
      />

      {filterOpen && (
        <div className="px-5 pt-2">
          <input
            autoFocus
            value={globalFilter}
            onChange={(event) =>
              setGlobalFilter(
                event.target.value,
              )
            }
            placeholder="Filter rows..."
            aria-label="Filter rows"
            className="w-full rounded-lg border border-border bg-panel px-3 py-1.5 text-[13px] text-fg outline-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      )}

      <div
        ref={scrollRef}
        role="table"
        className="max-h-96 flex-1 overflow-auto pb-5"
      >
        <div
          role="rowgroup"
          className="sticky top-0 z-10 bg-card"
        >
          {table
            .getHeaderGroups()
            .map((headerGroup) => (
              <div
                key={headerGroup.id}
                role="row"
                className="grid px-5 py-2"
                style={{
                  gridTemplateColumns:
                    gridTemplate,
                }}
              >
                {headerGroup.headers.map(
                  (header, index) => {
                    const sorted =
                      header.column.getIsSorted();

                    return (
                      <div
                        key={header.id}
                        role="columnheader"
                        aria-sort={
                          sorted === "asc"
                            ? "ascending"
                            : sorted === "desc"
                              ? "descending"
                              : "none"
                        }
                        className={clsx(
                          "flex min-w-0",
                          alignment[index]
                            ?.right
                            ? "justify-end"
                            : "justify-start",
                        )}
                      >
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.08em] text-muted transition hover:text-fg"
                          >
                            {flexRender(
                              header.column
                                .columnDef
                                .header,
                              header.getContext(),
                            )}

                            {sorted === "asc" ? (
                              <ArrowUp className="size-3" />
                            ) : sorted === "desc" ? (
                              <ArrowDown className="size-3" />
                            ) : null}
                          </button>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            ))}
        </div>

        <div
          role="rowgroup"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer
            .getVirtualItems()
            .map((virtualRow) => {
              const row =
                rows[virtualRow.index];

              return (
                <div
                  key={row.id}
                  role="row"
                  className="absolute left-0 grid w-full items-center px-5 text-[13px] transition-colors hover:bg-elevated/60"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    gridTemplateColumns:
                      gridTemplate,
                  }}
                >
                  {row
                    .getVisibleCells()
                    .map((cell, index) => (
                      <div
                        key={cell.id}
                        role="cell"
                        className={clsx(
                          "truncate",
                          index === 0
                            ? "font-semibold text-fg"
                            : "text-fg/90",
                          alignment[index]?.right &&
                            "text-right",
                          alignment[index]?.numeric &&
                            "font-mono tabular-nums",
                        )}
                      >
                        {flexRender(
                          cell.column
                            .columnDef
                            .cell,
                          cell.getContext(),
                        )}
                      </div>
                    ))}
                </div>
              );
            })}

          {rows.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-muted">
              No results.
            </div>
          )}
        </div>
      </div>
    </WidgetCard>
  );
}
