import nodemailer from "nodemailer"
import { db } from "./db"

interface SmtpConfig {
  host: string
  port: number
  user: string
  pass: string
  from: string
}

async function getSmtpConfig(): Promise<SmtpConfig | null> {
  const settings = await db.settings.findMany({
    where: {
      key: { in: ["smtp_host", "smtp_port", "smtp_user", "smtp_pass", "smtp_from"] }
    }
  })
  const map = Object.fromEntries(settings.map(s => [s.key, s.value]))
  if (!map.smtp_host || !map.smtp_user) return null
  return {
    host: map.smtp_host,
    port: parseInt(map.smtp_port || "587"),
    user: map.smtp_user,
    pass: map.smtp_pass || "",
    from: map.smtp_from || map.smtp_user,
  }
}

export async function sendReceipt(to: string, subject: string, pdfBuffer: Buffer) {
  const config = await getSmtpConfig()
  if (!config) throw new Error("SMTP not configured")

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
  })

  await transporter.sendMail({
    from: config.from,
    to,
    subject,
    text: "Prejmite vaš račun v priponki.",
    attachments: [
      {
        filename: `racun.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  })
}
