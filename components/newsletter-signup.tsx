"use client"

import type React from "react"

import { useState } from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      setEmail("")
    }, 1000)
  }

  return (
    <div className="bg-blue-600 text-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-5 w-5" />
        <h3 className="text-xl font-bold">Newsletter</h3>
      </div>

      {isSubmitted ? (
        <div className="text-center py-4">
          <p className="font-medium mb-2">Thank you for subscribing!</p>
          <p className="text-sm text-blue-100">You'll receive our latest news directly to your inbox.</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-blue-100">Stay updated with our latest news. Subscribe to our newsletter.</p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Button type="submit" className="w-full bg-white text-blue-600 hover:bg-white/90" disabled={isLoading}>
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

