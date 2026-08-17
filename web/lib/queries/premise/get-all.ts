import { db } from "@/lib/db"

export async function getAllPremises() {
  return db.premise.findMany()
}
