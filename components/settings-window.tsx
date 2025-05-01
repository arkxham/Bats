"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, Volume2, VolumeX, Volume1 } from "lucide-react"

interface SettingsWindowProps {
  isOpen: boolean
  onClose: () => void
  initialPosition: { x: number; y: number }
  volume: number
  isMuted: boolean
  onVolumeChange: (volume: number) => void
  onMuteToggle: () => void
}

export default function SettingsWindow({
  isOpen,
  onClose,
  initialPosition,
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
}: SettingsWindowProps) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsDragging(true)
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Set up event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    } else {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  // Get volume icon based on current volume
  const getVolumeIcon = () => {
    if (isMuted) return <VolumeX size={20} />
    if (volume <= 0.5) return <Volume1 size={20} />
    return <Volume2 size={20} />
  }

  if (!isOpen) return null

  return (
    <div
      ref={windowRef}
      className="fixed bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 w-72"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Window header - draggable */}
      <div
        className="bg-gray-800 px-4 py-2 flex items-center justify-between cursor-move"
        onMouseDown={handleMouseDown}
      >
        <h3 className="text-sm font-medium text-yellow-500">Settings</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={16} />
        </button>
      </div>

      {/* Window content */}
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300">Volume</label>
            <button onClick={onMuteToggle} className="text-gray-400 hover:text-yellow-500">
              {getVolumeIcon()}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onVolumeChange(Number.parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                backgroundImage: `linear-gradient(to right, #eab308 0%, #eab308 ${volume * 100}%, #374151 ${
                  volume * 100
                }%, #374151 100%)`,
              }}
            />
            <span className="text-xs text-gray-400 w-8 text-right">{Math.round(volume * 100)}%</span>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <p className="text-xs text-gray-500">Drag this window to reposition it</p>
        </div>
      </div>
    </div>
  )
}
