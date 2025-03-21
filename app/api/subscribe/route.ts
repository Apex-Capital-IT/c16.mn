import { type NextRequest, NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 })
    }

    // In a real application, you would store the email in your database
    // For example:
    // await db.insert('subscribers', { email, subscribed_at: new Date() });

    // Send welcome email using the provided emailSender function
    try {
      await sendWelcomeEmail(email)

      return NextResponse.json({
        success: true,
        message: "Subscription successful! Check your email for confirmation.",
      })
    } catch (emailError: any) {
      console.error("Failed to send welcome email:", emailError)
      return NextResponse.json(
        { success: false, message: "Failed to send welcome email: " + emailError.message },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Subscription error:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred while processing your request: " + error.message },
      { status: 500 },
    )
  }
}

