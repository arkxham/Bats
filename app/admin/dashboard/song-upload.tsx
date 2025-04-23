"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Music, Upload } from "lucide-react"

interface SongUploadProps {
  userId: string
  onUploadComplete: () => void
  onError: (message: string) => void
}

export default function SongUpload({ userId, onUploadComplete, onError }: SongUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  // Set up drag and drop event listeners
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (!e.dataTransfer?.files || e.dataTransfer.files.length === 0) return

    const file = e.dataTransfer.files[0]
    await handleSongUpload(file)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    await handleSongUpload(file)
  }

  const handleSongUpload = async (file: File) => {
    try {
      setUploading(true)

      // Validate file type
      const fileExt = file.name.split(".").pop()?.toLowerCase() || ""
      if (fileExt !== "mp3") {
        throw new Error("Only MP3 files are allowed")
      }

      // Create a standardized file name: song-{original_name}.mp3
      // Keep the original name for display purposes
      const fileName = `song-${file.name}`

      // Create form data for upload
      const formData = new FormData()
      formData.append("file", file)
      formData.append("bucket", "songs")
      formData.append("userId", userId)
      formData.append("fileName", fileName)

      // Upload using the API route
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || "Upload failed")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Upload failed")
      }

      // Notify parent component
      onUploadComplete()
    } catch (error: any) {
      console.error("Error uploading song:", error)
      onError(`Error uploading song: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <h3 className="text-md font-semibold mb-3">Profile Song</h3>
      <div
        ref={dropRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border ${isDragging ? "border-yellow-500 bg-gray-800/50" : "border-gray-700"} 
          p-4 rounded-md transition-colors relative`}
      >
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md z-10">
            <div className="text-yellow-500 flex flex-col items-center">
              <Upload className="h-8 w-8 mb-2" />
              <p>Drop to upload</p>
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="flex items-center mb-3">
            <Music className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-sm text-gray-300">Upload an MP3 file for this profile</p>
          </div>

          <p className="text-sm text-gray-400 mb-2">Drag & drop an MP3 file or select one below</p>
          <label className="bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer inline-block">
            <input
              type="file"
              accept=".mp3,audio/mp3"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {uploading ? "Uploading..." : "Select MP3"}
          </label>
        </div>
      </div>
    </div>
  )
}
