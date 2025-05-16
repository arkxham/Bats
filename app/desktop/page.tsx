"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getSupabaseBrowser } from "@/lib/supabase"
// Add this near the top of the file, after the imports
import { apiRequest } from "@/lib/api-client"
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
  Loader2,
} from "lucide-react"

// Add this import at the top with the other imports
import SettingsWindow from "@/components/settings-window"

// Update the DEFAULT_PROFILE_PIC constant to use a more reliable URL
const DEFAULT_PROFILE_PIC = "/dark-knight-profile.png"

// Initial profile data with descriptions and social media links
const initialProfiles = [
  {
    id: "9bc522da-2723-4e71-a4d1-781d791ca1fd",
    username: "Fasshn",
    display_name: "Fasshn",
    avatar_url: null,
    background_image: null,
    description: "",
    twitter_url: "https://twitter.com/Fasshn",
    twitch_url: "https://twitch.tv/Fasshn",
    github_url: "https://github.com/Fasshon",
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
  {
    id: "18d38ba4-f85f-4763-98a2-d433b2b46344",
    username: "Scorpy",
    display_name: "Scorpy",
    avatar_url: null,
    background_image: null,
    description: "",
    twitter_url: "https://twitter.com/ScorpyL2",
    twitch_url: "https://twitch.tv/ScorpyL2",
    github_url: "https://github.com/80dropz",
    steam_url: "https://steamcommunity.com/id/scorpy/",
  },
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

// Add this at the top of the component
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second
const SUPABASE_URL = "https://cgggsudeipsyfcszouil.supabase.co"

export default function DesktopPage() {
  const [profiles, setProfiles] = useState(initialProfiles)
  const [selectedProfile, setSelectedProfile] = useState(initialProfiles[0])
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
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowser()

  // Add these state variables inside the DesktopPage component, near the other state variables
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settingsPosition, setSettingsPosition] = useState({ x: 100, y: 100 })
  const [volume, setVolume] = useState(0.2) // Default volume
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingStatus, setLoadingStatus] = useState("Initializing...")

  // Set default profile images immediately on component mount
  useEffect(() => {
    const defaultImages: Record<string, string> = {}
    profiles.forEach((profile) => {
      defaultImages[profile.id] = DEFAULT_PROFILE_PIC
    })
    setProfileImages(defaultImages)
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

  // Replace the fetchAllUserFiles function with this improved version
  const fetchAllUserFiles = async (retryCount = 0) => {
    setRefreshing(true)
    setApiError(null)
    setLoading(true)
    setLoadingProgress(0)
    setLoadingStatus("Initializing profiles...")

    try {
      // Fetch files for each profile
      const newProfileImages: Record<string, string> = {}
      const newBackgroundImages: Record<string, string> = {}
      const newProfileSongs: Record<string, string> = {}
      const newUserFiles: Record<string, UserFiles> = {}

      // Set default profile images for all profiles as a fallback
      profiles.forEach((profile) => {
        newProfileImages[profile.id] = DEFAULT_PROFILE_PIC
      })

      // Calculate progress increment per profile
      const progressIncrement = 100 / profiles.length

      for (let i = 0; i < profiles.length; i++) {
        const profile = profiles[i]
        try {
          setLoadingStatus(`Loading profile: ${profile.username}`)
          console.log(`Fetching files for user: ${profile.id}`)

          // Always use GET requests since we're on GitHub Pages which doesn't support POST
          const data = await apiRequest(`/api/user-files?userId=${profile.id}`, {
            method: "GET",
          }).catch(async (error) => {
            console.log(`GET request failed for user ${profile.id}, trying fallback API...`)
            setLoadingStatus(`Trying fallback API for ${profile.username}...`)

            // Try the fallback API on Vercel
            return await apiRequest(`/api/fallback`, {
              method: "GET",
            }).catch((error) => {
              console.log(`Fallback API also failed for user ${profile.id}, using default...`)
              setLoadingStatus(`Using default data for ${profile.username}`)
              // Return a minimal fallback response
              return {
                success: true,
                files: {
                  "profile-picture": [],
                  backgrounds: [],
                  songs: [],
                },
              }
            })
          })

          if (data.success && data.files) {
            newUserFiles[profile.id] = data.files

            // Extract profile picture
            if (data.files["profile-picture"] && data.files["profile-picture"].length > 0) {
              // Find a file that starts with "pic."
              const picFile = data.files["profile-picture"].find((file: any) => file.name.startsWith("pic."))

              if (picFile) {
                newProfileImages[profile.id] = picFile.publicUrl
              }
            }

            // Extract background image
            if (data.files["backgrounds"] && data.files["backgrounds"].length > 0) {
              // Find a file that starts with "bg."
              const bgFile = data.files["backgrounds"].find((file: any) => file.name.startsWith("bg."))

              if (bgFile) {
                newBackgroundImages[profile.id] = bgFile.publicUrl
              }
            }

            // Extract song file
            if (data.files["songs"] && data.files["songs"].length > 0) {
              // Find any song file (they should start with "song.")
              const songFile = data.files["songs"].find((file: any) => file.name.startsWith("song"))

              if (songFile) {
                newProfileSongs[profile.id] = songFile.publicUrl

                // If this is the currently selected profile, update the audio player
                if (selectedProfile && profile.id === selectedProfile.id) {
                  setCurrentSongName(songFile.name.replace(/^song-/, "").replace(/\.[^/.]+$/, ""))

                  // If we already have an audio element, update its source
                  if (audioRef.current) {
                    audioRef.current.src = songFile.publicUrl
                    if (isPlaying) {
                      audioRef.current.play().catch((err) => console.log("Could not autoplay:", err))
                    }
                  } else {
                    // Create a new audio element
                    const audio = new Audio(songFile.publicUrl)
                    audio.volume = volume
                    audioRef.current = audio
                    if (isPlaying) {
                      audio.play().catch((err) => console.log("Could not autoplay:", err))
                    }
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching files for user ${profile.id}:`, error)
          // Continue with the next profile instead of breaking the entire loop
        }

        // Update progress after each profile is processed
        const newProgress = Math.min(100, Math.round((i + 1) * progressIncrement))
        setLoadingProgress(newProgress)
        setLoadingStatus(`Loading profiles: ${newProgress}% complete`)
      }

      // Update state with all fetched files
      setUserFiles(newUserFiles)
      setProfileImages((prevImages) => ({ ...prevImages, ...newProfileImages }))
      setBackgroundImages((prevBgs) => ({ ...prevBgs, ...newBackgroundImages }))
      setProfileSongs((prevSongs) => ({ ...prevSongs, ...newProfileSongs }))

      // Auto-play song for the initially selected profile
      if (selectedProfile && newProfileSongs[selectedProfile.id]) {
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

      setLoadingStatus("Loading complete!")
      // Add a small delay before hiding the loading indicator to ensure users see the completion
      setTimeout(() => {
        setLoading(false)
      }, 500)
    } catch (error: any) {
      console.error("Error fetching user files:", error)
      setLoadingStatus("Error loading profiles. Retrying...")

      // Implement retry logic
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying fetchAllUserFiles (${retryCount + 1}/${MAX_RETRIES})...`)
        setTimeout(
          () => {
            fetchAllUserFiles(retryCount + 1).catch((error) => {
              console.error(`Retry ${retryCount + 1} failed:`, error)
            })
          },
          RETRY_DELAY * (retryCount + 1),
        )
      } else {
        // If all retries fail, use default profiles
        setLoadingStatus("Failed to load profiles. Using defaults.")
        setTimeout(() => {
          setLoading(false)
        }, 1000)
        handleApiError(error)
      }
    } finally {
      setRefreshing(false)
    }
  }

  // Initial fetch of user files
  useEffect(() => {
    fetchAllUserFiles().catch((error) => {
      console.error("Failed to fetch user files:", error)
      handleApiError(error)
    })
  }, [])

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

  const handleProfileSelect = (profile: typeof selectedProfile) => {
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

        // Replace this conditional with automatic playing
        audioRef.current.play().catch((err) => console.log("Could not autoplay:", err))
        setIsPlaying(true)
      } else {
        // Replace this code in the handleProfileSelect function:
        // const audio = new Audio(profileSongs[profile.id])
        // audio.volume = 0.2
        // audioRef.current = audio

        // And replace with:
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

        // Replace this conditional with automatic playing
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

  const handleSocialClick = (url: string | null) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  // Update the getProfileImageUrl function to ensure it always returns a valid URL
  const getProfileImageUrl = (profileId: string) => {
    if (!profileId) return DEFAULT_PROFILE_PIC
    return profileImages[profileId] || DEFAULT_PROFILE_PIC
  }

  // Get background image URL (from storage or null)
  const getBackgroundImageUrl = (profileId: string) => {
    return backgroundImages[profileId] || null
  }

  // Get current background for the selected profile
  const currentBackground = getBackgroundImageUrl(selectedProfile?.id)

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Toggle mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted)
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

      {/* Loading overlay - much more noticeable */}
      {loading && (
        <>
          {/* Semi-transparent overlay */}
          <div className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center">
            {/* Batman-themed loading container */}
            <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg p-6 max-w-md w-full shadow-lg shadow-yellow-500/20">
              {/* Spinner and status */}
              <div className="flex items-center justify-center mb-4">
                <Loader2 className="h-8 w-8 text-yellow-500 mr-3 animate-spin" />
                <h2 className="text-xl font-bold text-yellow-500">BATCOMPUTER</h2>
              </div>

              <div className="text-center mb-4 text-yellow-300">{loadingStatus}</div>

              {/* Progress bar */}
              <div className="h-4 bg-gray-800 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-yellow-500 transition-all duration-300 ease-out relative"
                  style={{ width: `${loadingProgress}%` }}
                >
                  {/* Animated pulse effect */}
                  <div className="absolute inset-0 bg-yellow-400/50 animate-pulse"></div>
                </div>
              </div>

              {/* Percentage display */}
              <div className="text-center text-lg font-mono text-yellow-500">{loadingProgress}% COMPLETE</div>
            </div>
          </div>

          {/* Top bar loading indicator */}
          <div className="fixed top-0 left-0 w-full z-40">
            <div className="h-2 bg-gray-800">
              <div
                className="h-full bg-yellow-500 transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          </div>
        </>
      )}

      {/* Top profile bar - fixed at the top */}
      <div className="bg-black/80 p-1 border-b border-gray-800 sticky top-0 z-30">
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
                        {/* Update the Image components to handle errors better */}
                        <Image
                          src={getProfileImageUrl(profile.id) || "/placeholder.svg"}
                          alt={profile.username}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                          unoptimized
                          onError={() => {
                            // If image fails to load, update the state with the default image
                            setProfileImages((prev) => ({
                              ...prev,
                              [profile.id]: DEFAULT_PROFILE_PIC,
                            }))
                          }}
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
                {/* Update the Image components to handle errors better */}
                <Image
                  src={getProfileImageUrl(selectedProfile?.id) || "/placeholder.svg"}
                  alt={selectedProfile?.username || "User"}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                  unoptimized
                  onError={() => {
                    if (selectedProfile) {
                      setProfileImages((prev) => ({
                        ...prev,
                        [selectedProfile.id]: DEFAULT_PROFILE_PIC,
                      }))
                    }
                  }}
                />
              </div>
              <h2 className="text-2xl font-bold text-yellow-400">
                {selectedProfile?.display_name || selectedProfile?.username}
              </h2>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-8 text-lg">{selectedProfile?.description}</p>

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
                {/* Update the Image components to handle errors better */}
                <Image
                  src={getProfileImageUrl(selectedProfile?.id) || "/placeholder.svg"}
                  alt={selectedProfile?.username || "User"}
                  width={24}
                  height={24}
                  className="object-cover w-full h-full"
                  unoptimized
                  onError={() => {
                    if (selectedProfile) {
                      setProfileImages((prev) => ({
                        ...prev,
                        [selectedProfile.id]: DEFAULT_PROFILE_PIC,
                      }))
                    }
                  }}
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
