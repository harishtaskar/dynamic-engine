export interface GenerateDashboardEvent {
  type:
    | "meta"
    | "widget"
    | "error"
    | "done";

  dashboardId?: string;

  name?: string;

  prompt?: string;

  layout?: string;

  theme?: string;

  headline?: string;

  subtitle?: string;

  contentCount?: number;

  widget?: unknown;

  message?: string;
}

export async function generateDashboard(
  prompt: string,
  onEvent: (
    event: GenerateDashboardEvent,
  ) => void,
) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/generate-dashboard`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        prompt,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Generation failed: ${response.status}`,
    );
  }

  if (!response.body) {
    throw new Error(
      "Streaming is not supported by this response.",
    );
  }

  const reader =
    response.body.getReader();

  const decoder =
    new TextDecoder();

  let buffer = "";

  while (true) {
    const { value, done } =
      await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(
      value,
      {
        stream: true,
      },
    );

    const lines =
      buffer.split("\n");

    buffer =
      lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) {
        continue;
      }

      try {
        const event =
          JSON.parse(line) as GenerateDashboardEvent;

        onEvent(event);
      } catch (error) {
        console.error(
          "Invalid stream event:",
          line,
          error,
        );
      }
    }
  }
}