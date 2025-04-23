export type Profile = {
  id: string
  username: string
  password?: string
  avatar_url: string | null
  background_image: string | null
  created_at: string
  last_login: string | null
  bio: string | null
  is_admin: boolean | null
  twitter_url: string | null
  twitch_url: string | null
  github_url: string | null
  steam_url: string | null
}

export type User = {
  id: string
  email: string
  profile: Profile
}

export type File = {
  id: string
  profile_id: string
  name: string
  path: string
  type: string
  content: string | null
  favorite: boolean
  last_modified: string
}

export type Song = {
  id: string
  profile_id: string
  title: string
  artist: string
  file_path: string
  thumbnail: string | null
}

export type UserPreference = {
  id: string
  profile_id: string
  theme: string
  animations: boolean
  auto_play_music: boolean
  show_clock: boolean
}
