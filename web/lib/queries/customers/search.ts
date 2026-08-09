import { db } from "@/lib/db"

export async function searchCustomers(query: string) {
  return db.customer.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { vatId: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 10,
    orderBy: { name: "asc" },
  })
}
