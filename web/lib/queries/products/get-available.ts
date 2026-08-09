import { db } from "@/lib/db"

export async function getAvailableProducts() {
  return db.product.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  })
}
