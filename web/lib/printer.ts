import net from "net"

export async function printEscPos(host: string, port: number, data: string) {
  return new Promise<void>((resolve, reject) => {
    const client = new net.Socket()
    const buffer = Buffer.from(data, "ascii")

    client.connect(port, host, () => {
      client.write(buffer, (err) => {
        client.destroy()
        if (err) reject(err)
        else resolve()
      })
    })

    client.on("error", (err) => {
      client.destroy()
      reject(err)
    })

    client.setTimeout(5000, () => {
      client.destroy()
      reject(new Error("Printer connection timeout"))
    })
  })
}

export function formatEscPosReceipt(opts: {
  company: string
  date: string
  invoiceNumber: number
  items: Array<{ name: string; qty: number; price: number; total: number }>
  totalGross: number
  paymentMethod: string
}): string {
  const lines: string[] = []
  lines.push("\x1B\x40")           // init
  lines.push("\x1B\x21\x10")       // double height
  lines.push(`  ${opts.company}`)
  lines.push("\x1B\x21\x00")       // normal
  lines.push("--------------------------------")
  lines.push(`${opts.date}  #${opts.invoiceNumber}`)
  lines.push("--------------------------------")

  for (const item of opts.items) {
    const name = item.name.padEnd(20).slice(0, 20)
    const qty = `${item.qty}x${item.price.toFixed(2)}`.padEnd(12)
    const total = item.total.toFixed(2).padStart(8)
    lines.push(`${name}${qty}${total}`)
  }

  lines.push("--------------------------------")
  lines.push(`TOTAL: ${opts.totalGross.toFixed(2).padStart(25)}`)
  lines.push(`Placilo: ${opts.paymentMethod}`)
  lines.push("\n\n\n")
  lines.push("\x1D\x56\x41\x03")   // cut

  return lines.join("\n")
}
