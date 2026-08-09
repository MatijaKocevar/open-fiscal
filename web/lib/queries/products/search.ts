import { db } from "@/lib/db"

export async function searchProducts(query: string) {
  return db.product.findMany({
    where: {
      isActive: true,
      name: { contains: query, mode: "insensitive" },
    },
    take: 20,
    orderBy: { name: "asc" },
  })
}
