import { toast } from "sonner"

export function showError(message: string, duration = 6000) {
  toast.error(message, { duration, position: "bottom-right" })
}

export function showSuccess(message: string) {
  toast.success(message, { position: "bottom-right" })
}
