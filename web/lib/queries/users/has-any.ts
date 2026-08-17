import { db } from "@/lib/db"

export async function hasAnyUser() {
  const count = await db.user.count()
  return count > 0
}
