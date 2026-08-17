import { db } from "@/lib/db"

export async function getUserById(id: string) {
  return db.user.findUnique({ where: { id } })
}
