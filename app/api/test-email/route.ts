import { type NextRequest, NextResponse } from "next/server"
import { emailSender } from "@/lib/email"

// This is a test endpoint to verify email sending works
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ success: false, message: "Email parameter is required" }, { status: 400 })
    }

    const testHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2>Test Email from Baabar News</h2>
        <p>This is a test email to verify that the email sending functionality is working correctly.</p>
        <p>If you're seeing this, it means the email system is configured properly!</p>
        <p>Sent to: ${email}</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      </div>
    `

    await emailSender(email, "Test Email from Baabar News", testHtml)

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${email}`,
    })
  } catch (error: any) {
    console.error("Email test error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send test email: " + error.message,
      },
      { status: 500 },
    )
  }
}

