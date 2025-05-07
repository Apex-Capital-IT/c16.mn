"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Mail, Check, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function EmailSubscription() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  // Clear subscription status after 3 seconds
  useEffect(() => {
    if (subscriptionStatus) {
      const timer = setTimeout(() => {
        setSubscriptionStatus(null);
      }, 3000); // 3000ms = 3 seconds

      // Cleanup the timer if the component unmounts or status changes
      return () => clearTimeout(timer);
    }
  }, [subscriptionStatus]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    setIsSubmitting(true);
    setSubscriptionStatus(null);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      setSubscriptionStatus({
        success: data.success,
        message: data.message,
      });

      if (data.success) {
        setEmail("");
      }
    } catch (error) {
      setSubscriptionStatus({
        success: false,
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-white border-[1px] mb-12 border-black py-6">
      <div className="container text-black mx-auto px-4">
        <div className="flex flex-col md:flex-row text-black items-center justify-between">
          <div className="flex items-center mb-4 text-black md:mb-0">
            <div className="text-black mr-8">
              <Image alt="C16 Logo" width={55} height={35} src={"/Logo.png"} className="w-auto" />
              <p className="text-sm text-black">
                Имэйл хаягаа бичээд шинээр орж буй нийтлэлийг
                <br />
                цаг алдалгүй имэйлээр авааpай
              </p>
            </div>
            <div className="bg-white text-black p-3 rounded-full mr-4 hidden md:block">
              <Mail size={24} className="text-black" />
            </div>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="w-full md:w-auto flex flex-col  md:flex-row items-center"
          >
            <div className="flex flex-col w-full md:w-auto">
              <div className="flex flex-col md:flex-row items-center">
                <input
                  type="email"
                  placeholder="Таны имэйл хаяг"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-[1px] border-black md:w-64 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2 md:mb-0 md:mr-2"
                  required
                />
                <button
                  type="submit"
                  className="w-full md:w-auto text-black border-[1px] border-black  font-medium px-6 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Илгээж байна..." : "Бүртгүүлэх"}
                </button>
              </div>
              {subscriptionStatus && (
                <div
                  className={`mt-2 p-2 rounded-md text-center ${
                    subscriptionStatus.success
                      ? "bg-green-900/30 text-green-200 border border-green-800"
                      : "bg-red-900/30 text-red-200 border border-red-800"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    {subscriptionStatus.success ? (
                      <Check size={16} className="mr-1 flex-shrink-0" />
                    ) : (
                      <AlertCircle size={16} className="mr-1 flex-shrink-0" />
                    )}
                    <span className="text-xs">
                      {subscriptionStatus.message}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="text-xs text-black mt-2 text-center md:text-left">
          Бид таны хувийн мэдээлэл хамгаалж, спам илгээхгүй
        </div>
      </div>
    </section>
  );
}
