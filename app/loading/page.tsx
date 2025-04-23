"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"

export default function LoadingPage() {
  const [progress, setProgress] = useState(0)
  const [systemReady, setSystemReady] = useState(false)
  const [logMessages, setLogMessages] = useState<string[]>([])
  const [scanLines, setScanLines] = useState(true)
  const [glitch, setGlitch] = useState(false)
  const router = useRouter()
  const logRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const messages = [
    "Initializing Batcomputer v4.3.2...",
    "Loading security protocols...",
    "Checking Batcave subsystems...",
    "Scanning for unauthorized access...",
    "Establishing secure connection to Wayne Enterprises...",
    "Activating defense systems...",
    "Analyzing Gotham City crime data...",
    "Updating Batmobile navigation systems...",
    "Checking Batsuit integrity...",
    "Loading criminal database...",
    "System ready. Welcome, Bruce Wayne.",
  ]

  // Matrix effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = []

    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#0fa"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)

    return () => clearInterval(interval)
  }, [])

  // Loading progress
  useEffect(() => {
    let currentMessage = 0
    const interval = setInterval(() => {
      if (currentMessage < messages.length) {
        setLogMessages((prev) => [...prev, messages[currentMessage]])
        currentMessage++
      }
    }, 800)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1.5
        if (newProgress >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            setSystemReady(true)
            setTimeout(() => {
              router.push("/desktop")
            }, 2000)
          }, 1000)
          return 100
        }
        return newProgress
      })
    }, 100)

    // Glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitch(true)
        setTimeout(() => setGlitch(false), 150)
      }
    }, 2000)

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval)
      clearInterval(glitchInterval)
    }
  }, [router, messages])

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [logMessages])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Matrix background */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-20" />

      {/* Scan lines */}
      {scanLines && <div className="absolute inset-0 bg-scan-lines pointer-events-none"></div>}

      {/* Glitch effect */}
      {glitch && <div className="absolute inset-0 bg-cyan-500/10 z-10 animate-pulse"></div>}

      <div className={`w-32 h-32 mb-8 relative ${glitch ? "animate-glitch" : ""}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-cyan-500 animate-pulse">
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
          <path d="m7 16 10-8-4 8H7z" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="60" height="30" viewBox="0 0 40 20" fill="currentColor" className="text-black">
            <path d="M20 0C12 0 6 4 0 10C6 16 12 20 20 20C28 20 34 16 40 10C34 4 28 0 20 0ZM20 15C17.2 15 15 12.8 15 10C15 7.2 17.2 5 20 5C22.8 5 25 7.2 25 10C25 12.8 22.8 15 20 15Z" />
          </svg>
        </div>
      </div>

      <h2 className={`text-cyan-500 text-3xl font-mono mb-6 ${glitch ? "animate-glitch" : ""}`}>
        INITIALIZING BATCOMPUTER...
      </h2>

      <div className="w-full max-w-md mb-8">
        <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-cyan-300/30 animate-pulse"></div>
          </div>
        </div>
        <div className="mt-2 text-gray-400 text-right font-mono text-sm">
          {systemReady ? "System ready" : `${Math.floor(progress)}%`}
        </div>
      </div>

      <div
        ref={logRef}
        className="w-full max-w-md h-64 bg-black border border-cyan-900/50 rounded p-4 font-mono text-sm overflow-y-auto relative"
      >
        {logMessages.map((msg, index) => (
          <div key={index} className="text-green-500 mb-1">
            &gt; {msg}
          </div>
        ))}
        {!systemReady && <div className="text-green-500 inline-block animate-pulse">_</div>}

        {/* Terminal decorations */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-900/0 via-cyan-500/20 to-cyan-900/0"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-900/0 via-cyan-500/20 to-cyan-900/0"></div>
      </div>

      {/* Audio */}
      <audio src="/batcomputer-startup.mp3" autoPlay />
    </div>
  )
}
