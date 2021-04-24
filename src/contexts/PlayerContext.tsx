import { createContext, ReactNode, useState } from 'react'

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
  playList: (list: EpisodeDTO[], index: number) => void
  playNext: () => void
  playPrevious: () => void
  togglePlay: () => void
  setPlayingSate: (state:boolean) => void
}

type PlayerContextProviderProps = {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextDTO)

export function PlayerContextProvider({children}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  function play(episode: EpisodeDTO){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: EpisodeDTO[], index: number){
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function togglePlay(){
    setIsPlaying(!isPlaying)
  }

  function setPlayingSate(state: boolean) {
    setIsPlaying(state)
  }

  function playNext(){
    const nextEpisodeIndex = currentEpisodeIndex + 1

    if(nextEpisodeIndex > episodeList.length) return

    setCurrentEpisodeIndex(currentEpisodeIndex + 1)
  }

  function playPrevious(){
    if(currentEpisodeIndex > 0)
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
  }

  return(
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      play,
      playList,
      playNext,
      playPrevious,
      togglePlay,
      setPlayingSate
    }}>
      {children}      
    </PlayerContext.Provider>
  )
}