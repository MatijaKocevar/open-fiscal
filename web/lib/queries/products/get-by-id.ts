import { db } from "@/lib/db"

export async function getProductById(id: string) {
  return db.product.findUnique({ where: { id } })
}
