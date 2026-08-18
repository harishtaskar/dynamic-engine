import { useMutation } from "@tanstack/react-query";

import {
  executeWidgetAction,
} from "../api/widget.api";

export function useWidgetAction() {
  return useMutation({
    mutationFn: executeWidgetAction,
  });
}