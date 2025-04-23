"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowser } from "@/lib/supabase"
import { Lock, User, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowser()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Play sound effect if available
      const audio = new Audio("/batcomputer-access.mp3")
      audio.volume = 0.3
      try {
        await audio.play()
      } catch (error) {
        console.log("Audio couldn't play automatically")
      }

      // Redirect to admin dashboard on success
      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 1000)
    } catch (error: any) {
      setError(error.message || "Failed to sign in")

      // Play error sound
      const errorAudio = new Audio("/access-denied.mp3")
      errorAudio.volume = 0.3
      try {
        await errorAudio.play()
      } catch (error) {
        console.log("Audio couldn't play automatically")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800">
        <div className="bg-yellow-600 p-4">
          <div className="flex items-center justify-center">
            <Lock className="h-8 w-8 text-gray-900" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">Admin Access</h1>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-300 text-center mb-6">Enter your credentials to access the admin panel</p>

          {error && (
            <div className="mb-4 bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-yellow-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
              >
                {loading ? "Authenticating..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Return to{" "}
              <a href="/" className="text-yellow-500 hover:text-yellow-400">
                main login
              </a>
            </p>
          </div>
        </div>

        <div className="bg-gray-950 px-6 py-4 text-center border-t border-gray-800">
          <p className="text-xs text-gray-500">Wayne Enterprises Secure System • Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  )
}
