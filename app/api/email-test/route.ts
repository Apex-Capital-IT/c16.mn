import { type NextRequest, NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/email"

// This is a test endpoint to verify email sending works
// You should remove this in production
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ success: false, message: "Email parameter is required" }, { status: 400 })
    }

    const result = await sendWelcomeEmail(email)

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${email}`,
      details: result,
    })
  } catch (error: any) {
    console.error("Email test error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send test email",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

