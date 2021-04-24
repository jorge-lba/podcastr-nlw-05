import { createContext } from 'react'

type EpisodeDTO = {
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

type PlayerContextDTO = {
  episodeList: EpisodeDTO[]
  currentEpisodeIndex: number
  isPlaying: boolean
  play: (episode: EpisodeDTO) => void
  togglePlay: () => void
} 

export const PlayerContext = createContext({} as PlayerContextDTO)