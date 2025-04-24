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
} from "lucide-react"

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
    description: "66",
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
    username: "N333mo",
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
    description: "Mercury",
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
    twitter_url: "https://twitter.com/lydeli",
    twitch_url: "https://twitch.tv/lydeli",
    github_url: "https://github.com/80dropz",
    steam_url: "https://steamcommunity.com/id/8inchDeli/",
  },
  {
    id: "0d69999e-11f1-41d0-b625-58445a06c63c",
    username: "Rtmonly",
    display_name: "RTMONLY",
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
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowser()
  const [descriptions, setDescriptions] = useState<Record<string, string>>({})
  const [profileBios, setProfileBios] = useState<Record<string, string>>({})

  // Fetch all user files from the API
  const fetchAllUserFiles = async () => {
    setRefreshing(true)

    try {
      // Fetch files for each profile
      const newProfileImages: Record<string, string> = {}
      const newBackgroundImages: Record<string, string> = {}
      const newProfileSongs: Record<string, string> = {}
      const newUserFiles: Record<string, UserFiles> = {}

      for (const profile of profiles) {
        try {
          const response = await fetch("/api/user-files", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: profile.id }),
          })

          if (!response.ok) {
            throw new Error(`Error fetching files: ${response.statusText}`)
          }

          const data = await response.json()

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
                    audio.volume = 0.2
                    audioRef.current = audio
                    if (isPlaying) {
                      audio.play().catch((err) => console.log("Could not autoplay:", err))
                    }
                  }
                }
              }
            }

            // Extract bio file
            if (data.files["descriptions"] && data.files["descriptions"].length > 0) {
              // Find the bio file
              const bioFile = data.files["descriptions"].find((file: any) => file.name === "bio.txt")

              if (bioFile) {
                // Download the bio file content
                try {
                  const bioResponse = await fetch(bioFile.publicUrl)
                  if (bioResponse.ok) {
                    const bioText = await bioResponse.text()
                    // Store the bio text
                    const newDescriptions = { ...descriptions }
                    newDescriptions[profile.id] = bioText
                    setDescriptions(newDescriptions)
                  }
                } catch (error) {
                  console.error(`Error downloading bio for ${profile.id}:`, error)
                }
              }
            }

            // Extract description file
            if (data.files["descriptions"] && data.files["descriptions"].length > 0) {
              // Find the description file
              const descFile = data.files["descriptions"].find((file: any) => file.name === "description.txt")

              if (descFile) {
                // Download the description file content
                try {
                  const descResponse = await fetch(descFile.publicUrl)
                  if (descResponse.ok) {
                    const descText = await descResponse.text()
                    newUserFiles[profile.id] = {
                      ...newUserFiles[profile.id],
                      description: descText,
                    }

                    // Store the description text
                    descriptions[profile.id] = descText
                  }
                } catch (error) {
                  console.error(`Error downloading description for ${profile.id}:`, error)
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching files for user ${profile.id}:`, error)
        }
      }

      // Update state with all fetched files
      setUserFiles(newUserFiles)
      setProfileImages(newProfileImages)
      setBackgroundImages(newBackgroundImages)
      setProfileSongs(newProfileSongs)

      // Auto-play song for the initially selected profile
      if (selectedProfile && profileSongs[selectedProfile.id]) {
        if (!audioRef.current) {
          const audio = new Audio(profileSongs[selectedProfile.id])
          audio.volume = 0.2
          audioRef.current = audio

          // Get the song name
          if (userFiles[selectedProfile.id] && userFiles[selectedProfile.id]["songs"]) {
            const songFile = userFiles[selectedProfile.id]["songs"].find(
              (file) => file.publicUrl === profileSongs[selectedProfile.id],
            )
            if (songFile) {
              setCurrentSongName(songFile.name.replace(/^song-/, "").replace(/\.[^/.]+$/, ""))
            }
          }

          audio.play().catch((err) => console.log("Could not autoplay:", err))
          setIsPlaying(true)
        }
      }
    } catch (error) {
      console.error("Error fetching user files:", error)
    } finally {
      setRefreshing(false)
    }
  }

  // Initial fetch of user files
  useEffect(() => {
    fetchAllUserFiles()
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
        // Create a new audio element
        const audio = new Audio(profileSongs[profile.id])
        audio.volume = 0.2
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

  const handleAdminClick = () => {
    router.push("/admin/dashboard")
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
          <div className="flex flex-col items-center">
            <User className="text-purple-500 w-8 h-8" />
            <span className="text-xs mt-1">Profiles</span>
          </div>
          <div className="flex flex-col items-center">
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
                  src={getProfileImageUrl(selectedProfile?.id) || "/placeholder.svg"}
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

            {/* Description */}
            {descriptions[selectedProfile?.id] && (
              <p className="text-gray-300 mb-8 text-lg">{descriptions[selectedProfile?.id]}</p>
            )}

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
                  src={getProfileImageUrl(selectedProfile?.id) || "/placeholder.svg"}
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
    </div>
  )
}
