"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getSupabaseBrowser } from "@/lib/supabase"
import type { Profile } from "@/types/database"
import {
  LogOut,
  AlertTriangle,
  CheckCircle,
  User,
  Edit,
  Twitter,
  ComputerIcon as Steam,
  Twitch,
  RefreshCw,
  Database,
  Upload,
  Music,
} from "lucide-react"

// Import the SongUpload component
import SongUpload from "./song-upload"
import SetupStorage from "./setup-storage"

// List of common video file extensions to exclude
const VIDEO_EXTENSIONS = ["mp4", "mov", "avi", "wmv", "flv", "mkv", "webm", "m4v", "3gp", "mpeg", "mpg", "ogg"]

// List of allowed audio extensions
const AUDIO_EXTENSIONS = ["mp3", "wav", "ogg", "m4a", "flac", "aac"]

// Type for user files
type UserFiles = {
  [bucket: string]: {
    name: string
    publicUrl: string
    path: string
    bucket: string
  }[]
}

export default function AdminDashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingBackground, setUploadingBackground] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [editingBio, setEditingBio] = useState(false)
  const [bio, setBio] = useState("")
  const [editingSocial, setEditingSocial] = useState(false)
  const [twitterUrl, setTwitterUrl] = useState("")
  const [twitchUrl, setTwitchUrl] = useState("")
  const [steamUrl, setSteamUrl] = useState("")
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null)
  const [songUrl, setSongUrl] = useState<string | null>(null)
  const [songName, setSongName] = useState<string | null>(null)
  const [refreshingImages, setRefreshingImages] = useState(false)
  const [settingUpStorage, setSettingUpStorage] = useState(false)
  const [userFiles, setUserFiles] = useState<UserFiles | null>(null)
  const [isDraggingBackground, setIsDraggingBackground] = useState(false)
  const backgroundDropRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowser()

  // Fetch profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/admin")
          return
        }

        // Get current user's profile
        const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id)

        if (profileError) throw profileError

        // Check if profile exists and set it
        if (profileData && profileData.length > 0) {
          const userProfile = profileData[0]
          setProfile(userProfile)
          setBio(userProfile.bio || "")
          setTwitterUrl(userProfile.twitter_url || "")
          setTwitchUrl(userProfile.twitch_url || "")
          setSteamUrl(userProfile.steam_url || "")

          // Fetch user files from API
          await fetchUserFiles(user.id)
        } else {
          // Create a default profile if none exists
          const defaultProfile = {
            id: user.id,
            username: user.email?.split("@")[0] || "batman",
            avatar_url: null,
            background_image: null,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
            bio: null,
            is_admin: false,
            twitter_url: null,
            twitch_url: null,
            github_url: null,
            steam_url: null,
          }

          // Insert the default profile
          const { error: insertError } = await supabase.from("profiles").insert([defaultProfile])

          if (insertError) {
            console.error("Error creating default profile:", insertError)
          }

          setProfile(defaultProfile)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setNotification({
          type: "error",
          message: "Failed to load profile data",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase, router])

  // Set up drag and drop event listeners for background
  useEffect(() => {
    const backgroundDropArea = backgroundDropRef.current
    if (!backgroundDropArea) return

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      setIsDraggingBackground(true)
    }

    const handleDragLeave = () => {
      setIsDraggingBackground(false)
    }

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault()
      setIsDraggingBackground(false)

      if (!e.dataTransfer?.files || e.dataTransfer.files.length === 0) return

      const file = e.dataTransfer.files[0]
      await handleBackgroundUpload(file)
    }

    backgroundDropArea.addEventListener("dragover", handleDragOver)
    backgroundDropArea.addEventListener("dragleave", handleDragLeave)
    backgroundDropArea.addEventListener("drop", handleDrop)

    return () => {
      backgroundDropArea.removeEventListener("dragover", handleDragOver)
      backgroundDropArea.removeEventListener("dragleave", handleDragLeave)
      backgroundDropArea.removeEventListener("drop", handleDrop)
    }
  }, [profile])

  // Function to fetch user files from API
  const fetchUserFiles = async (userId: string) => {
    try {
      setRefreshingImages(true)

      const response = await fetch("/api/user-files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error(`Error fetching files: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success && data.files) {
        setUserFiles(data.files)

        // Extract profile picture
        if (data.files["profile-picture"] && data.files["profile-picture"].length > 0) {
          // Find a file that starts with "pic."
          const picFile = data.files["profile-picture"].find((file: any) => file.name.startsWith("pic."))

          if (picFile) {
            setProfileImageUrl(picFile.publicUrl)
          }
        }

        // Extract background image
        if (data.files["backgrounds"] && data.files["backgrounds"].length > 0) {
          // Find a file that starts with "bg."
          const bgFile = data.files["backgrounds"].find((file: any) => file.name.startsWith("bg."))

          if (bgFile) {
            setBackgroundImageUrl(bgFile.publicUrl)
          }
        }

        // Extract song file
        if (data.files["songs"] && data.files["songs"].length > 0) {
          // Find a file that starts with "song-"
          const songFile = data.files["songs"].find((file: any) => file.name.startsWith("song-"))

          if (songFile) {
            setSongUrl(songFile.publicUrl)
            setSongName(songFile.name.replace(/^song-/, ""))
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user files:", error)
      setNotification({
        type: "error",
        message: "Failed to load user files",
      })
    } finally {
      setRefreshingImages(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin")
  }

  const handleGoToDesktop = () => {
    router.push("/desktop")
  }

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.")
      }

      const file = event.target.files[0]
      await handleAvatarUpload(file)
    } catch (error: any) {
      console.error("Error uploading avatar:", error)
      setNotification({
        type: "error",
        message: `Error uploading avatar: ${error.message}`,
      })
    }
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      setUploadingAvatar(true)

      const fileExt = file.name.split(".").pop()?.toLowerCase() || ""

      // Check if the file is a video
      if (VIDEO_EXTENSIONS.includes(fileExt)) {
        throw new Error("Video files are not allowed. Please select an image file.")
      }

      // Simplified file name: pic.{extension}
      const fileName = `pic.${fileExt}`

      // Create form data for upload
      const formData = new FormData()
      formData.append("file", file)
      formData.append("bucket", "profile-picture")
      formData.append("userId", profile?.id || "")
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

      // Refresh user files to get the new URLs
      if (profile) {
        await fetchUserFiles(profile.id)
      }

      setNotification({
        type: "success",
        message: "Profile picture updated successfully",
      })
    } catch (error: any) {
      console.error("Error uploading avatar:", error)
      setNotification({
        type: "error",
        message: `Error uploading avatar: ${error.message}`,
      })
    } finally {
      setUploadingAvatar(false)
    }
  }

  const uploadBackground = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.")
      }

      const file = event.target.files[0]
      await handleBackgroundUpload(file)
    } catch (error: any) {
      console.error("Error uploading background:", error)
      setNotification({
        type: "error",
        message: `Error uploading background: ${error.message}`,
      })
    }
  }

  const handleBackgroundUpload = async (file: File) => {
    try {
      setUploadingBackground(true)

      const fileExt = file.name.split(".").pop()?.toLowerCase() || ""

      // Check if the file is a video
      if (VIDEO_EXTENSIONS.includes(fileExt)) {
        throw new Error("Video files are not allowed. Please select an image file.")
      }

      // Simplified file name: bg.{extension}
      const fileName = `bg.${fileExt}`

      // Create form data for upload
      const formData = new FormData()
      formData.append("file", file)
      formData.append("bucket", "backgrounds")
      formData.append("userId", profile?.id || "")
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

      // Refresh user files to get the new URLs
      if (profile) {
        await fetchUserFiles(profile.id)
      }

      setNotification({
        type: "success",
        message: "Background image updated successfully",
      })
    } catch (error: any) {
      console.error("Error uploading background:", error)
      setNotification({
        type: "error",
        message: `Error uploading background: ${error.message}`,
      })
    } finally {
      setUploadingBackground(false)
    }
  }

  const updateBio = async () => {
    try {
      const { error } = await supabase.from("profiles").update({ bio }).eq("id", profile?.id)

      if (error) throw error

      setProfile({
        ...profile!,
        bio,
      })

      setEditingBio(false)
      setNotification({
        type: "success",
        message: "Bio updated successfully",
      })
    } catch (error: any) {
      console.error("Error updating bio:", error)
      setNotification({
        type: "error",
        message: `Error updating bio: ${error.message}`,
      })
    }
  }

  const updateSocialLinks = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          twitter_url: twitterUrl || null,
          twitch_url: twitchUrl || null,
          steam_url: steamUrl || null,
        })
        .eq("id", profile?.id)

      if (error) throw error

      setProfile({
        ...profile!,
        twitter_url: twitterUrl || null,
        twitch_url: twitchUrl || null,
        steam_url: steamUrl || null,
      })

      setEditingSocial(false)
      setNotification({
        type: "success",
        message: "Social links updated successfully",
      })
    } catch (error: any) {
      console.error("Error updating social links:", error)
      setNotification({
        type: "error",
        message: `Error updating social links: ${error.message}`,
      })
    }
  }

  // Function to refresh images from storage
  const refreshImages = async () => {
    try {
      setNotification({
        type: "success",
        message: "Refreshing files from storage...",
      })

      if (profile) {
        await fetchUserFiles(profile.id)
      }

      setNotification({
        type: "success",
        message: "Files refreshed successfully",
      })
    } catch (error: any) {
      console.error("Error refreshing files:", error)
      setNotification({
        type: "error",
        message: `Error refreshing files: ${error.message}`,
      })
    }
  }

  // Function to delete the current song
  const deleteSong = async () => {
    try {
      if (!profile?.id) return

      setNotification({
        type: "success",
        message: "Deleting song...",
      })

      // List files in the songs bucket
      const { data: songFiles, error: listError } = await supabase.storage.from("songs").list(profile.id)

      if (listError) {
        throw listError
      }

      if (songFiles && songFiles.length > 0) {
        // Get paths of all song files
        const filesToDelete = songFiles.map((file) => `${profile.id}/${file.name}`)

        // Delete the files
        const { error: deleteError } = await supabase.storage.from("songs").remove(filesToDelete)

        if (deleteError) {
          throw deleteError
        }

        // Refresh user files
        await fetchUserFiles(profile.id)

        setSongUrl(null)
        setSongName(null)

        setNotification({
          type: "success",
          message: "Song deleted successfully",
        })
      } else {
        setNotification({
          type: "error",
          message: "No songs found to delete",
        })
      }
    } catch (error: any) {
      console.error("Error deleting song:", error)
      setNotification({
        type: "error",
        message: `Error deleting song: ${error.message}`,
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Simple header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            BAT<span className="text-yellow-500">CONSOLE</span>
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleGoToDesktop}
              className="bg-yellow-600 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-md text-sm flex items-center"
            >
              Desktop
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm flex items-center"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div
          className={`p-3 mx-auto max-w-4xl mt-4 rounded-md
            ${notification.type === "success" ? "bg-green-900 border-l-4 border-green-500" : "bg-red-900 border-l-4 border-red-500"}`}
        >
          <div className="flex items-center">
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            )}
            <p className="text-sm">{notification.message}</p>
            <button onClick={() => setNotification(null)} className="ml-auto text-gray-400 hover:text-white">
              &times;
            </button>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Profile Management</h2>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Info */}
              <div className="md:w-1/3">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-800 border-2 border-yellow-500">
                    {profileImageUrl ? (
                      <Image
                        src={profileImageUrl || "/placeholder.svg"}
                        alt={profile?.username || "User"}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                        unoptimized // Disable Next.js image optimization to prevent caching
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-16 w-16 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-medium">{profile?.username}</h3>

                  {/* Bio section */}
                  <div className="mt-4 w-full">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-400">Bio</h4>
                      <button
                        onClick={() => setEditingBio(!editingBio)}
                        className="text-yellow-500 hover:text-yellow-400"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>

                    {editingBio ? (
                      <div className="space-y-2">
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm"
                          rows={3}
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingBio(false)}
                            className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={updateBio}
                            className="px-3 py-1 text-sm bg-yellow-600 hover:bg-yellow-500 text-black rounded"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-300 bg-gray-800 p-2 rounded min-h-[60px]">
                        {profile?.bio || "No bio provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Controls */}
              <div className="md:w-2/3 space-y-6">
                <div>
                  <h3 className="text-md font-semibold mb-3">Profile Picture</h3>
                  <div className="border border-gray-700 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Upload a new profile picture (any non-video file)</p>
                        <label className="bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer inline-block">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={uploadAvatar}
                            disabled={uploadingAvatar}
                          />
                          {uploadingAvatar ? "Uploading..." : "Select Image"}
                        </label>
                      </div>
                      {profileImageUrl && (
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                          <Image
                            src={profileImageUrl || "/placeholder.svg"}
                            alt="Current avatar"
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-3">Background Image</h3>
                  <div
                    ref={backgroundDropRef}
                    className={`border ${isDraggingBackground ? "border-yellow-500 bg-gray-800/50" : "border-gray-700"} 
                      p-4 rounded-md transition-colors relative`}
                  >
                    {isDraggingBackground && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md z-10">
                        <div className="text-yellow-500 flex flex-col items-center">
                          <Upload className="h-8 w-8 mb-2" />
                          <p>Drop to upload</p>
                        </div>
                      </div>
                    )}

                    <div className="mb-3">
                      {backgroundImageUrl ? (
                        <div className="h-24 w-full rounded overflow-hidden">
                          <Image
                            src={backgroundImageUrl || "/placeholder.svg"}
                            alt="Background"
                            width={400}
                            height={100}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="h-24 w-full bg-gray-800 rounded flex items-center justify-center">
                          <p className="text-gray-500">No background image</p>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      Upload a new background image (drag & drop or select a file)
                    </p>
                    <label className="bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer inline-block">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={uploadBackground}
                        disabled={uploadingBackground}
                      />
                      {uploadingBackground ? "Uploading..." : "Select Image"}
                    </label>
                  </div>
                </div>

                {/* Song Upload Section */}
                <SongUpload
                  userId={profile?.id || ""}
                  onUploadComplete={() => {
                    setNotification({
                      type: "success",
                      message: "Song uploaded successfully",
                    })
                    if (profile) {
                      fetchUserFiles(profile.id)
                    }
                  }}
                  onError={(message) => {
                    setNotification({
                      type: "error",
                      message,
                    })
                  }}
                />

                {/* Current Song Display */}
                {songUrl && (
                  <div className="border border-gray-700 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Music className="h-5 w-5 text-yellow-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium">Current Song</p>
                          <p className="text-xs text-gray-400">{songName || "Unknown"}</p>
                        </div>
                      </div>
                      <button
                        onClick={deleteSong}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {/* Social Media Links */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-md font-semibold">Social Media</h3>
                    <button
                      onClick={() => setEditingSocial(!editingSocial)}
                      className="text-yellow-500 hover:text-yellow-400"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>

                  {editingSocial ? (
                    <div className="border border-gray-700 p-4 rounded-md space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Twitter URL</label>
                        <div className="flex items-center">
                          <Twitter className="h-4 w-4 text-blue-400 mr-2" />
                          <input
                            type="text"
                            value={twitterUrl}
                            onChange={(e) => setTwitterUrl(e.target.value)}
                            placeholder="https://twitter.com/username"
                            className="flex-1 bg-gray-800 border border-gray-700 rounded p-2 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Twitch URL</label>
                        <div className="flex items-center">
                          <Twitch className="h-4 w-4 text-purple-400 mr-2" />
                          <input
                            type="text"
                            value={twitchUrl}
                            onChange={(e) => setTwitchUrl(e.target.value)}
                            placeholder="https://twitch.tv/username"
                            className="flex-1 bg-gray-800 border border-gray-700 rounded p-2 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Steam URL</label>
                        <div className="flex items-center">
                          <Steam className="h-4 w-4 text-gray-400 mr-2" />
                          <input
                            type="text"
                            value={steamUrl}
                            onChange={(e) => setSteamUrl(e.target.value)}
                            placeholder="https://steamcommunity.com/id/username"
                            className="flex-1 bg-gray-800 border border-gray-700 rounded p-2 text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingSocial(false)}
                          className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={updateSocialLinks}
                          className="px-3 py-1 text-sm bg-yellow-600 hover:bg-yellow-500 text-black rounded"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-gray-700 p-4 rounded-md space-y-3">
                      <div className="flex items-center">
                        <Twitter className="h-4 w-4 text-blue-400 mr-2" />
                        <p className="text-sm text-gray-300">{twitterUrl || "No Twitter link"}</p>
                      </div>
                      <div className="flex items-center">
                        <Twitch className="h-4 w-4 text-purple-400 mr-2" />
                        <p className="text-sm text-gray-300">{twitchUrl || "No Twitch link"}</p>
                      </div>
                      <div className="flex items-center">
                        <Steam className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-300">{steamUrl || "No Steam link"}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Refresh Images Button */}
            <div className="mt-6">
              <button
                onClick={refreshImages}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm flex items-center"
                disabled={refreshingImages}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {refreshingImages ? "Refreshing..." : "Refresh Files"}
              </button>
            </div>

            {/* Setup Storage Button */}
            <div className="mt-6">
              <button
                onClick={() => setSettingUpStorage(true)}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm flex items-center"
              >
                <Database className="h-4 w-4 mr-2" />
                Setup Storage
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Setup Storage Modal */}
      {settingUpStorage && <SetupStorage onClose={() => setSettingUpStorage(false)} />}

      {/* Audio Player */}
      {songUrl && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 p-4 border-t border-gray-800">
          <audio controls ref={audioRef} src={songUrl} className="w-full"></audio>
        </div>
      )}
    </div>
  )
}
