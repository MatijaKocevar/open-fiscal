import { db } from "@/lib/db"

export async function getLowStockProducts(threshold = 10) {
  return db.product.findMany({
    where: { isActive: true, stockQty: { lte: threshold } },
    orderBy: { stockQty: "asc" },
  })
}
