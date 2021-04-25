import { createContext, ReactNode, useContext, useState } from 'react'

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
  isLooping: boolean
  isShuffling: boolean
  isMuted:boolean
  hasNext: boolean
  hasPrevious: boolean
  play: (episode: EpisodeDTO) => void
  clearPlayerState: () => void
  playList: (list: EpisodeDTO[], index: number) => void
  playNext: () => void
  playPrevious: () => void
  togglePlay: () => void
  toggleLoop: () => void
  toggleShuffle: () => void
  setMutedState: (state:boolean) => void
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
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  const [isMuted, setIsMuted] = useState(false)



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

  function toggleLoop(){
    setIsLooping(!isLooping)
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling)
  }

  function setMutedState(state: boolean){
    setIsMuted(state)
  }

  function setPlayingSate(state: boolean) {
    setIsPlaying(state)
  }

  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length
  const hasPrevious = currentEpisodeIndex > 0

  function playNext(){
    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if(hasNext){
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function clearPlayerState(){
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  function playPrevious(){
    if(hasPrevious)
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
  }

  return(
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      isLooping,
      isShuffling,
      isMuted,
      play,
      clearPlayerState,
      playList,
      playNext,
      playPrevious,
      togglePlay,
      toggleLoop,
      toggleShuffle,
      setMutedState,
      setPlayingSate,
      hasNext,
      hasPrevious
    }}>
      {children}      
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}