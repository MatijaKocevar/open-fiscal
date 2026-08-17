import { db } from "@/lib/db"

export async function getAllUsers() {
  return db.user.findMany({ orderBy: { createdAt: "desc" } })
}
