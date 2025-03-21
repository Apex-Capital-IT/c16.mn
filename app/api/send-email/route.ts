import { type NextRequest, NextResponse } from "next/server"
import { emailSender } from "@/lib/email"

// This endpoint mimics your Express route for sending emails
export async function POST(request: NextRequest) {
  try {
    const { sendEmail, subject, html } = await request.json()

    if (!sendEmail || !subject || !html) {
      return NextResponse.json(
        { success: false, message: "Email, subject, and HTML content are required" },
        { status: 400 },
      )
    }

    await emailSender(sendEmail, subject, html)

    return NextResponse.json({
      success: true,
      message: "Successfully sent email",
    })
  } catch (error: any) {
    console.error("Email sending error:", error)
    return NextResponse.json({ success: false, message: "Failed to send email: " + error.message }, { status: 500 })
  }
}

