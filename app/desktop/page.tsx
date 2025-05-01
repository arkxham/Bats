"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getSupabaseBrowser } from "@/lib/supabase"
import {
  Folder,
  User,
  Settings,
  FolderOpen,
  Lock,
  Play,
  Pause,
  Clock,
  Twitter,
  ComputerIcon as Steam,
  Twitch,
  RefreshCw,
  Volume2,
  VolumeX,
  AlertCircle,
  Bug,
} from "lucide-react"

// Add this import at the top with the other imports
import SettingsWindow from "@/components/settings-window"

// Default profile picture URL
const DEFAULT_PROFILE_PIC = "https://th.bing.com/th/id/OIP.t8GsH1Q3v-NLfvTKIHIc3QHaHa?w=199&h=199&c=7&r=0&o=5&pid=1.7"

// Initial profile data with descriptions and social media links
const initialProfiles = [
  {
    id: "9bc522da-2723-4e71-a4d1-781d791ca1fd",
    username: "arkham",
    display_name: "arkham",
    avatar_url: null,
    background_image: null,
    description: "",
    twitter_url: "https://twitter.com/arkxham_",
    twitch_url: "https://bats.rip",
    github_url: "https://github.com/arkxham",
    steam_url: "https://steamcommunity.com/id/arkxham/",
  },
  {
    id: "f82a2a4c-82f3-4e6e-be73-743f2eb83447",
    username: "Trystin",
    display_name: "Trystin",
    avatar_url: null,
    background_image: null,
    description: "",
    twitter_url: "https://twitter.com/Trystin002",
    twitch_url: "https://twitch.tv/y0imTrystin",
    github_url: "https://github.com/80dropz",
    steam_url: "https://steamcommunity.com/id/trystin/",
  },
  // Scorpy removed as requested
  {
    id: "7306d120-20c9-4db9-8673-91402084f42e",
    username: "Gekk",
    display_name: "Gekk",
    avatar_url: null,
    background_image: null,
    description: "",
    twitter_url: "https://twitter.com/GEKKSKI",
    twitch_url: "https://twitch.tv/gekk",
    github_url: "https://github.com/gekk",
    steam_url: "https://steamcommunity.com/id/gekk-",
  },
  {
    id: "12b49464-de99-40f6-b869-a21a8cfc0d11",
    username: "Slos",
    display_name: "Slos",
    avatar_url: null,
    background_image: null,
    description: "",
    twitter_url: "https://twitter.com/slosgpx",
    twitch_url: "https://twitch.tv/sl0s",
    github_url: "https://github.com/80dropz",
    steam_url: "https://steamcommunity.com/id/slosgpx/",
  },
  {
    id: "75b11267-26c3-4ae2-82bb-bd6ace06dbcd",
    username: "Said",
    display_name: "Said",
    avatar_url: null,
    background_image: null,
    description: "",
    twitter_url: "https://twitter.com/_saidd1",
    twitch_url: "https://twitch.tv/said1",
    github_url: "https://github.com/80dropz",
    steam_url: "https://steamcommunity.com/id/said3q/",
  },
  {
    id: "5688fe08-2150-49f5-ae25-1c35528a8fd1",
    username: "N333MO",
    display_name: "N333MO",
    avatar_url: null,
    background_image: null,
    description: "",
    twitter_url: "https://twitter.com/n333mo_",
    twitch_url: "https://twitch.tv/n333mo_",
    github_url: "https://github.com/n333mo",
    steam_url: "https://steamcommunity.com/id/n333mo/",
  },
  {
    id: "481ca4c5-d885-4aee-be2d-2bcc38f9061c",
    username: "Mocha",
    display_name: "Mocha",
    avatar_url: null,
    background_image: null,
    description: "",
    twitter_url: "https://twitter.com/MochaFNBR",
    twitch_url: "https://twitch.tv/1m0cha",
    github_url: "https://github.com/80dropz",
    steam_url: "https://steamcommunity.com/id/mochafn/",
  },
  {
    id: "5ff14b37-907e-4f88-a3ec-8bd7c858f118",
    username: "Clipzy",
    display_name: "Clipzy",
    avatar_url: null,
    background_image: null,
    description: "",
    twitter_url: "https://twitter.com/clpzy",
    twitch_url: "https://twitch.tv/clipzy",
    github_url: "https://github.com/clipzy",
    steam_url: "https://steamcommunity.com/id/8cs/",
  },
  {
    id: "38a65afc-6bf4-402b-994f-b7a34130cb7d",
    username: "Jack",
    display_name: "Jack",
    avatar_url: null,
    background_image: null,
    description: "",
    twitter_url: "https://twitter.com/UpdateStable",
    twitch_url: "https://twitch.tv/freedm_",
    github_url: "https://github.com/jack",
    steam_url: "https://steamcommunity.com/id/freedm_/",
  },
  {
    id: "b7b311bd-9260-45ef-afb7-fe06f7aa52ad",
    username: "Junz",
    display_name: "Junz",
    avatar_url: null,
    background_image: null,
    description: "",
    twitter_url: "https://twitter.com/Junzlol_",
    twitch_url: "https://twitch.tv/junzioi",
    github_url: "https://github.com/80dropz",
    steam_url: "https://steamcommunity.com/profiles/76561199119147695",
  },
  {
    id: "ec7c47c8-19c6-4fe4-9448-85036cc14746",
    username: "Outlaw",
    display_name: "Outlaw",
    avatar_url: null,
    background_image: null,
    description: "",
    twitter_url: "https://twitter.com/akaoutlaw",
    twitch_url: "https://twitch.tv/akaoutlaw",
    github_url: "https://github.com/arkxham",
    steam_url: "https://steamcommunity.com/profiles/76561199189690553",
  },
  {
    id: "4220428f-b980-4a1f-92bb-4422589f1066",
    username: "Lydell",
    display_name: "Lydell",
    avatar_url: null,
    background_image: null,
    description: "",
    twitter_url: "https://twitter.com/lydeli_",
    twitch_url: "https://twitch.tv/lydeli",
    github_url: "https://github.com/80dropz",
    steam_url: "https://steamcommunity.com/id/8inchDeli/",
  },
  {
    id: "0d69999e-11f1-41d0-b625-58445a06c63c",
    username: "RTMONLY",
    display_name: "rtmonly",
    avatar_url: null,
    background_image: null,
    description: "",
    twitter_url: "https://twitter.com/rtmonly",
    twitch_url: "https://twitch.tv/rtmonly",
    github_url: "https://github.com/rtmonly",
    steam_url: "https://steamcommunity.com/id/rtmonly/",
  },
]

// Type for user files
type UserFiles = {
  [bucket: string]: {
    name: string
    publicUrl: string
    path: string
    bucket: string
  }[]
}

// Add this type to the existing types
type ProfileDescriptions = Record<string, string>

// Add this at the top of the component
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

export default function DesktopPage() {
  // Use client-side only state initialization to avoid hydration errors
  const [profiles] = useState(initialProfiles)
  const [selectedProfile, setSelectedProfile] = useState<(typeof initialProfiles)[0] | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [profileImages, setProfileImages] = useState<Record<string, string>>({})
  const [backgroundImages, setBackgroundImages] = useState<Record<string, string>>({})
  const [profileSongs, setProfileSongs] = useState<Record<string, string>>({})
  const [currentSongName, setCurrentSongName] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [userFiles, setUserFiles] = useState<Record<string, UserFiles>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>({})
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowser()

  // Add these state variables inside the DesktopPage component, near the other state variables
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settingsPosition, setSettingsPosition] = useState({ x: 100, y: 100 })
  const [volume, setVolume] = useState(0.2) // Default volume

  // Add this state variable with the other state variables
  const [profileDescriptions, setProfileDescriptions] = useState<ProfileDescriptions>({})

  // Initialize selected profile after component mounts to avoid hydration errors
  useEffect(() => {
    // Set default profile images for all profiles
    const defaultProfileImages: Record<string, string> = {}
    profiles.forEach((profile) => {
      defaultProfileImages[profile.id] = DEFAULT_PROFILE_PIC
    })
    setProfileImages(defaultProfileImages)

    // Set the first profile as selected
    setSelectedProfile(initialProfiles[0])
    setIsLoaded(true)

    // Enable debug mode with keyboard shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setDebugMode((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Add this function inside the DesktopPage component
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  // Add this function to the desktop page component
  const handleApiError = (error: any) => {
    console.error("API error occurred:", error)
    setApiError(`API Error: ${error.message || "Unknown error"}. Using default profiles.`)

    // Continue showing the UI with default profile images
    const defaultProfileImages: Record<string, string> = {}

    // Set default profile images for all profiles
    profiles.forEach((profile) => {
      defaultProfileImages[profile.id] = DEFAULT_PROFILE_PIC
    })

    // Update state with default values
    setProfileImages(defaultProfileImages)
  }

  // Dismiss error message
  const dismissError = () => {
    setApiError(null)
  }

  // Function to fetch user files with multiple fallback methods
  const fetchUserFiles = async (userId: string, retryCount = 0) => {
    try {
      console.log(`Fetching files for user: ${userId}`)
      setDebugInfo((prev) => ({ ...prev, [`fetchStart_${userId}`]: new Date().toISOString() }))

      // Import dynamically to reduce initial load time
      const { getApiBaseUrl } = await import("@/lib/api-client")
      const baseUrl = getApiBaseUrl()
      setDebugInfo((prev) => ({ ...prev, baseUrl }))

      // Try the fallback API first (which we know works)
      try {
        console.log("Trying fallback API...")
        const fallbackResponse = await fetch(`${baseUrl}/api/fallback`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        })

        setDebugInfo((prev) => ({
          ...prev,
          fallbackStatus: fallbackResponse.status,
          fallbackStatusText: fallbackResponse.statusText,
        }))

        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json()
          console.log("Fallback API succeeded", data)
          setDebugInfo((prev) => ({ ...prev, fallbackSuccess: true, fallbackData: data }))
          return data
        } else {
          console.log(`Fallback API failed: ${fallbackResponse.status} ${fallbackResponse.statusText}`)
          setDebugInfo((prev) => ({ ...prev, fallbackSuccess: false }))
        }
      } catch (error) {
        console.error("Fallback API error:", error)
        setDebugInfo((prev) => ({ ...prev, fallbackError: String(error) }))
      }

      // Try direct GET request with URL parameters
      try {
        console.log("Trying GET request with URL parameters...")
        const getResponse = await fetch(`${baseUrl}/api/user-files?userId=${encodeURIComponent(userId)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest", // Add this to help identify AJAX requests
          },
          cache: "no-store",
        })

        setDebugInfo((prev) => ({
          ...prev,
          getStatus: getResponse.status,
          getStatusText: getResponse.statusText,
        }))

        if (getResponse.ok) {
          const data = await getResponse.json()
          console.log("GET request succeeded", data)
          setDebugInfo((prev) => ({ ...prev, getSuccess: true }))
          return data
        } else {
          console.log(`GET request failed: ${getResponse.status} ${getResponse.statusText}`)
          setDebugInfo((prev) => ({ ...prev, getSuccess: false }))
        }
      } catch (error) {
        console.error("GET request error:", error)
        setDebugInfo((prev) => ({ ...prev, getError: String(error) }))
      }

      // If GET fails, try POST
      try {
        console.log("Trying POST request...")
        const postResponse = await fetch(`${baseUrl}/api/user-files`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest", // Add this to help identify AJAX requests
          },
          body: JSON.stringify({ userId }),
          cache: "no-store",
        })

        setDebugInfo((prev) => ({
          ...prev,
          postStatus: postResponse.status,
          postStatusText: postResponse.statusText,
        }))

        if (postResponse.ok) {
          const data = await postResponse.json()
          console.log("POST request succeeded", data)
          setDebugInfo((prev) => ({ ...prev, postSuccess: true }))
          return data
        } else {
          console.log(`POST request failed: ${postResponse.status} ${postResponse.statusText}`)
          setDebugInfo((prev) => ({ ...prev, postSuccess: false }))
        }
      } catch (error) {
        console.error("POST request error:", error)
        setDebugInfo((prev) => ({ ...prev, postError: String(error) }))
      }

      // If all methods fail, return a default structure
      console.log("All API methods failed, returning default structure")
      setDebugInfo((prev) => ({ ...prev, allMethodsFailed: true }))

      return {
        success: true,
        files: {
          "profile-picture": [],
          backgrounds: [],
          songs: [],
          descriptions: [],
        },
      }
    } catch (error) {
      console.error(`Error fetching files for user ${userId}:`, error)
      setDebugInfo((prev) => ({ ...prev, [`fetchError_${userId}`]: String(error) }))

      // Retry logic
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying (${retryCount + 1}/${MAX_RETRIES})...`)
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)))
        return fetchUserFiles(userId, retryCount + 1)
      }

      // Return default data structure if all retries fail
      return {
        success: true,
        files: {
          "profile-picture": [],
          backgrounds: [],
          songs: [],
          descriptions: [],
        },
      }
    }
  }

  // Replace the fetchAllUserFiles function with this improved version
  const fetchAllUserFiles = async () => {
    setRefreshing(true)
    setApiError(null)
    setDebugInfo({ fetchAllStarted: new Date().toISOString() })

    try {
      // Set default profile images for all profiles as a fallback
      const defaultProfileImages: Record<string, string> = {}
      profiles.forEach((profile) => {
        defaultProfileImages[profile.id] = DEFAULT_PROFILE_PIC
      })
      setProfileImages((prev) => ({ ...prev, ...defaultProfileImages }))

      // Fetch files for each profile
      const newProfileImages: Record<string, string> = {}
      const newBackgroundImages: Record<string, string> = {}
      const newProfileSongs: Record<string, string> = {}
      const newUserFiles: Record<string, UserFiles> = {}
      const newProfileDescriptions: ProfileDescriptions = {}

      // Process profiles in smaller batches to avoid overwhelming the API
      const batchSize = 3
      for (let i = 0; i < profiles.length; i += batchSize) {
        const batch = profiles.slice(i, i + batchSize)
        setDebugInfo((prev) => ({ ...prev, currentBatch: i / batchSize + 1, batchSize }))

        // Process batch in parallel
        await Promise.all(
          batch.map(async (profile) => {
            try {
              const data = await fetchUserFiles(profile.id)
              setDebugInfo((prev) => ({ ...prev, [`profileData_${profile.id}`]: "fetched" }))

              if (data && data.success && data.files) {
                // Ensure all expected buckets exist
                const files = {
                  "profile-picture": data.files["profile-picture"] || [],
                  backgrounds: data.files.backgrounds || [],
                  songs: data.files.songs || [],
                  descriptions: data.files.descriptions || [],
                }

                newUserFiles[profile.id] = files

                // Extract profile picture
                if (files["profile-picture"] && files["profile-picture"].length > 0) {
                  const picFile = files["profile-picture"].find((file: any) => file.name.startsWith("pic."))
                  if (picFile) {
                    newProfileImages[profile.id] = picFile.publicUrl
                  }
                }

                // Extract background image
                if (files.backgrounds && files.backgrounds.length > 0) {
                  const bgFile = files.backgrounds.find((file: any) => file.name.startsWith("bg."))
                  if (bgFile) {
                    newBackgroundImages[profile.id] = bgFile.publicUrl
                  }
                }

                // Extract song file
                if (files.songs && files.songs.length > 0) {
                  const songFile = files.songs.find((file: any) => file.name.startsWith("song"))
                  if (songFile) {
                    newProfileSongs[profile.id] = songFile.publicUrl
                  }
                }

                // Extract description file
                if (files.descriptions && files.descriptions.length > 0) {
                  const bioFile = files.descriptions.find((file: any) => file.name === "bio.txt")
                  if (bioFile) {
                    try {
                      const response = await fetch(bioFile.publicUrl)
                      if (response.ok) {
                        const bioText = await response.text()
                        newProfileDescriptions[profile.id] = bioText
                      }
                    } catch (error) {
                      console.error(`Error fetching bio text for ${profile.id}:`, error)
                    }
                  }
                }
              }
            } catch (error) {
              console.error(`Error processing profile ${profile.id}:`, error)
              setDebugInfo((prev) => ({ ...prev, [`profileError_${profile.id}`]: String(error) }))
            }
          }),
        )

        // Small delay between batches to avoid overwhelming the API
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Update state with all fetched files
      setUserFiles(newUserFiles)
      setProfileImages((prevImages) => ({ ...prevImages, ...newProfileImages }))
      setBackgroundImages((prevBgs) => ({ ...prevBgs, ...newBackgroundImages }))
      setProfileSongs((prevSongs) => ({ ...prevSongs, ...newProfileSongs }))
      setProfileDescriptions((prevDescriptions) => ({ ...prevDescriptions, ...newProfileDescriptions }))

      setDebugInfo((prev) => ({
        ...prev,
        fetchAllCompleted: new Date().toISOString(),
        profileImagesCount: Object.keys(newProfileImages).length,
        backgroundImagesCount: Object.keys(newBackgroundImages).length,
        profileSongsCount: Object.keys(newProfileSongs).length,
        profileDescriptionsCount: Object.keys(newProfileDescriptions).length,
      }))

      // Setup audio for selected profile if available
      if (selectedProfile && newProfileSongs[selectedProfile.id]) {
        if (!audioRef.current) {
          const audio = new Audio(newProfileSongs[selectedProfile.id])
          audio.volume = volume
          audioRef.current = audio

          // Get the song name
          if (newUserFiles[selectedProfile.id] && newUserFiles[selectedProfile.id]["songs"]) {
            const songFile = newUserFiles[selectedProfile.id]["songs"].find(
              (file) => file.publicUrl === newProfileSongs[selectedProfile.id],
            )
            if (songFile) {
              setCurrentSongName(songFile.name.replace(/^song-/, "").replace(/\.[^/.]+$/, ""))
            }
          }

          audio.play().catch((err) => console.log("Could not autoplay:", err))
          setIsPlaying(true)
        }
      }
    } catch (error: any) {
      console.error("Error fetching user files:", error)
      setDebugInfo((prev) => ({ ...prev, fetchAllError: String(error) }))
      handleApiError(error)
    } finally {
      setRefreshing(false)
    }
  }

  // Initial fetch of user files - only after component is mounted
  useEffect(() => {
    if (isLoaded) {
      fetchAllUserFiles().catch((error) => {
        console.error("Failed to fetch user files:", error)
        handleApiError(error)
      })
    }
  }, [isLoaded])

  // Clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log("Could not play:", err))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  // Handle mute/unmute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  // Update the handleProfileSelect function to also set the description
  const handleProfileSelect = (profile: (typeof initialProfiles)[0]) => {
    setSelectedProfile(profile)

    // Play a selection sound
    const audio = new Audio("/batcomputer-access.mp3")
    audio.volume = 0.2
    try {
      audio.play()
    } catch (error) {
      console.log("Audio couldn't play automatically")
    }

    // Check if the profile has a song
    if (profileSongs[profile.id]) {
      // If we already have an audio element, update its source
      if (audioRef.current) {
        audioRef.current.src = profileSongs[profile.id]

        // Get the song name from userFiles
        if (userFiles[profile.id] && userFiles[profile.id]["songs"]) {
          const songFile = userFiles[profile.id]["songs"].find((file) => file.publicUrl === profileSongs[profile.id])
          if (songFile) {
            setCurrentSongName(songFile.name.replace(/^song-/, "").replace(/\.[^/.]+$/, ""))
          }
        }

        audioRef.current.play().catch((err) => console.log("Could not autoplay:", err))
        setIsPlaying(true)
      } else {
        const audio = new Audio(profileSongs[profile.id])
        audio.volume = volume
        audioRef.current = audio

        // Get the song name from userFiles
        if (userFiles[profile.id] && userFiles[profile.id]["songs"]) {
          const songFile = userFiles[profile.id]["songs"].find((file) => file.publicUrl === profileSongs[profile.id])
          if (songFile) {
            setCurrentSongName(songFile.name.replace(/^song-/, "").replace(/\.[^/.]+$/, ""))
          }
        }

        audio.play().catch((err) => console.log("Could not autoplay:", err))
        setIsPlaying(true)
      }
    } else {
      // No song for this profile
      setCurrentSongName(null)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
        setIsPlaying(false)
      }
    }
  }

  // Modify the handleAdminClick function to:
  const handleAdminClick = () => {
    router.push("/admin/dashboard")
  }

  // Add this function to toggle the settings window
  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen)
  }

  // Toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode(!debugMode)
  }

  const handleSocialClick = (url: string | null) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  // Get profile image URL (from storage or default)
  const getProfileImageUrl = (profileId: string) => {
    return profileImages[profileId] || DEFAULT_PROFILE_PIC
  }

  // Get background image URL (from storage or null)
  const getBackgroundImageUrl = (profileId: string) => {
    return backgroundImages[profileId] || null
  }

  // Get current background for the selected profile
  const currentBackground = selectedProfile ? getBackgroundImageUrl(selectedProfile.id) : null

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Toggle mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // If not loaded yet, show a simple loading state to avoid hydration errors
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-black text-white flex flex-col"
      style={{
        backgroundImage: currentBackground ? `url(${currentBackground})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Error notification */}
      {apiError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-900/80 text-white px-4 py-3 rounded-md shadow-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-red-300" />
          <span className="mr-4">{apiError}</span>
          <button onClick={dismissError} className="text-white hover:text-red-300">
            &times;
          </button>
        </div>
      )}

      {/* Debug button - only visible in corner */}
      <button
        onClick={toggleDebugMode}
        className="fixed bottom-2 right-2 z-50 bg-gray-800 p-1 rounded opacity-50 hover:opacity-100"
        title="Toggle Debug Mode (Ctrl+Shift+D)"
      >
        <Bug size={16} />
      </button>

      {/* Debug panel */}
      {debugMode && (
        <div className="fixed top-4 right-4 z-50 bg-black/90 border border-yellow-500 p-4 rounded-md shadow-lg max-w-md max-h-[80vh] overflow-auto">
          <h3 className="text-yellow-500 font-bold mb-2 flex justify-between">
            Debug Information
            <button onClick={toggleDebugMode} className="text-gray-400 hover:text-white">
              &times;
            </button>
          </h3>
          <div className="text-xs font-mono">
            <pre className="whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Top profile bar - fixed at the top */}
      <div className="bg-black/80 p-1 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center">
            {/* Clock on the left */}
            <div className="flex items-center space-x-2 min-w-[180px]">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div className="text-sm font-mono">{formatTime(currentTime)}</div>
            </div>

            {/* Centered profiles */}
            <div className="flex-1 flex justify-center">
              <div className="overflow-x-auto scrollbar-thin">
                <div className="flex items-center space-x-3 py-1 px-2 min-w-max">
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      onClick={() => handleProfileSelect(profile)}
                      className={`flex flex-col items-center cursor-pointer transition-all ${
                        selectedProfile?.id === profile.id
                          ? "scale-110 text-yellow-400"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full overflow-hidden border-2 ${
                          selectedProfile?.id === profile.id ? "border-yellow-400" : "border-transparent"
                        }`}
                      >
                        <Image
                          src={getProfileImageUrl(profile.id) || "/placeholder.svg"}
                          alt={profile.username}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                          unoptimized // Disable Next.js image optimization to prevent caching
                        />
                      </div>
                      <span className="text-xs mt-1 font-medium">{profile.username}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Refresh button on the right */}
            <div className="min-w-[180px] flex justify-end">
              <button
                onClick={fetchAllUserFiles}
                disabled={refreshing}
                className="text-yellow-500 hover:text-yellow-400 flex items-center"
                title="Refresh Images"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-24 bg-black/70 border-r border-gray-800 flex flex-col items-center py-4 space-y-8">
          <div className="flex flex-col items-center">
            <Folder className="text-yellow-500 w-8 h-8" />
            <span className="text-xs mt-1">Documents</span>
          </div>
          <div className="flex flex-col items-center">
            <Folder className="text-yellow-500 w-8 h-8" />
            <span className="text-xs mt-1">Pictures</span>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-110 hover:text-yellow-400"
            onClick={() => window.open("https://twitch.tv/team/bat", "_blank", "noopener,noreferrer")}
          >
            <User className="text-purple-500 w-8 h-8" />
            <span className="text-xs mt-1">Team</span>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-110 hover:text-yellow-400"
            onClick={toggleSettings}
          >
            <Settings className="text-gray-400 w-8 h-8" />
            <span className="text-xs mt-1">Settings</span>
          </div>
          <div className="flex flex-col items-center">
            <FolderOpen className="text-yellow-500 w-8 h-8" />
            <span className="text-xs mt-1">Directory</span>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer hover:text-yellow-400 transition-colors"
            onClick={handleAdminClick}
          >
            <Lock className="text-yellow-500 w-8 h-8" />
            <span className="text-xs mt-1">Admin</span>
          </div>
        </div>

        {/* Main area - centered content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-black/60 p-6 rounded-lg max-w-md w-full text-center">
            {/* Profile header */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-yellow-500/50">
                <Image
                  src={selectedProfile ? getProfileImageUrl(selectedProfile.id) : DEFAULT_PROFILE_PIC}
                  alt={selectedProfile?.username || "User"}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                  unoptimized // Disable Next.js image optimization to prevent caching
                />
              </div>
              <h2 className="text-2xl font-bold text-yellow-400">
                {selectedProfile?.display_name || selectedProfile?.username}
              </h2>
            </div>

            {/* Description - Updated to use the file content */}
            <p className="text-gray-300 mb-8 text-lg">
              {selectedProfile ? profileDescriptions[selectedProfile.id] || selectedProfile.description || "" : ""}
            </p>

            {/* Social Media Buttons - Centered */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => handleSocialClick(selectedProfile?.twitter_url)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-md transition-colors ${
                  selectedProfile?.twitter_url
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!selectedProfile?.twitter_url}
              >
                <Twitter size={20} />
                <span>Twitter</span>
              </button>

              <button
                onClick={() => handleSocialClick(selectedProfile?.twitch_url)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-md transition-colors ${
                  selectedProfile?.twitch_url
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!selectedProfile?.twitch_url}
              >
                <Twitch size={20} />
                <span>Twitch</span>
              </button>

              <button
                onClick={() => handleSocialClick(selectedProfile?.steam_url)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-md transition-colors ${
                  selectedProfile?.steam_url
                    ? "bg-gray-600 hover:bg-gray-700 text-white"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!selectedProfile?.steam_url}
              >
                <Steam size={20} />
                <span>Steam</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-black/80 border-t border-gray-800 p-2">
        <div className="flex items-center justify-between">
          <button className="bg-gray-800 hover:bg-gray-700 px-4 py-1 rounded flex items-center space-x-2">
            <span className="text-yellow-500 font-bold">Start</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="bg-gray-800 px-3 py-1 rounded flex items-center space-x-2">
              <button onClick={togglePlayPause} className="text-white hover:text-yellow-400">
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button onClick={toggleMute} className="text-white hover:text-yellow-400 ml-2">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <span className="text-xs">{currentSongName ? currentSongName : "No song available"}</span>
            </div>
            <div className="px-4 flex items-center">
              <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                <Image
                  src={selectedProfile ? getProfileImageUrl(selectedProfile.id) : DEFAULT_PROFILE_PIC}
                  alt={selectedProfile?.username || "User"}
                  width={24}
                  height={24}
                  className="object-cover w-full h-full"
                  unoptimized // Disable Next.js image optimization to prevent caching
                />
              </div>
              {selectedProfile?.username}
            </div>
          </div>
        </div>
      </div>
      <SettingsWindow
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialPosition={settingsPosition}
        volume={volume}
        isMuted={isMuted}
        onVolumeChange={handleVolumeChange}
        onMuteToggle={toggleMute}
      />
    </div>
  )
}
