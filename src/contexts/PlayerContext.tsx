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
  play: (episode: EpisodeDTO) => void
} 

export const PlayerContext = createContext({} as PlayerContextDTO)