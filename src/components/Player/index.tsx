import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Slider from 'rc-slider'

import { usePlayer } from '../../contexts/PlayerContext'

import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
import { convertDurationTimeString } from '../../utils/convertDurationToTimeString'

export function Player(){
  const audioRef = useRef<HTMLAudioElement>(null)
  const [ progress, setProgress ] = useState(0)
  const [ volume, setVolume ] = useState(.5)

  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying,
    isLooping,
    isShuffling,
    isMuted,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setMutedState,
    clearPlayerState,
    playNext,
    playPrevious,
    setPlayingSate,
    hasNext,
    hasPrevious
  } = usePlayer()

  function setupProgressListener(){
    audioRef.current.currentTime = 0

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleEpisodeEnded(){
    if(hasNext){
      playNext()
    } else {
      clearPlayerState()
    }
  }

  function handleSeek(amount:number){
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function handleVolume(amount: number) {
    amount = amount / 100
    audioRef.current.volume = amount
    setVolume(amount)
  }

  function handleMuted(){
    setMutedState(true)
    audioRef.current.volume = 0
  }

  function handleDismuted(){
    setMutedState(false)
    audioRef.current.volume = volume
  }

  useEffect(() => {
    if(!audioRef.current) return

    if(isPlaying){
      audioRef.current.volume = volume
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  const episode = episodeList[currentEpisodeIndex]

  return(
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image 
            width={512}
            height={512}
            src={episode.thumbnail}
            objectFit="cover"
          />

          <strong>{episode.title}</strong>
          <span>{
            episode.members.length > 78 
              ? `${episode.members.slice(0, 78)}...`
              : episode.members
          
          }</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationTimeString(progress)}</span>
          <div className={styles.slider}>
            { episode ? (
              <Slider 
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#66faeb' }}
                railStyle={{backgroundColor: '#4ac9bc'}}
                handleStyle={{ borderColor: '#66faeb', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            ) }
          </div>
          <span>{ convertDurationTimeString(episode?.duration || 0) }</span>
        </div>
        
        {episode && (
          <audio
            src={episode.url} 
            ref={audioRef} 
            loop={isLooping}
            autoPlay
            onEnded={handleEpisodeEnded}
            onPlay={() => setPlayingSate(true)}
            onPause={() => setPlayingSate(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button 
            type="button" 
            disabled={!episode || episodeList.length <= 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}  
          >
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>
          <button 
            type="button" 
            disabled={!episode} 
            className={styles.playButton}
            onClick={togglePlay}  
          >
            { isPlaying
                ? <img src="/pause.svg" alt="Pausar"/>
                : <img src="/play.svg" alt="Tocar"/>
            }
          </button>
          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima"/>
          </button>
          <button 
            type="button" 
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir"/>
          </button>

        </div>
        <div className={styles.volumeController}>
          { isMuted
            ? <button 
                type="button" 
                disabled={!episode}
                onClick={handleDismuted}
              >
                <img src="/volume_off.svg" alt="Embaralhar"/>
              </button>
            : <button 
                type="button" 
                disabled={!episode}
                onClick={handleMuted}
              >
                <img src="/volume_up.svg" alt="Embaralhar"/>
              </button>
          }
          <Slider 
            min={0}
            max={100}
            value={volume * 100}
            onChange={handleVolume}
            trackStyle={{ backgroundColor: '#E6E8EB' }}
            railStyle={{backgroundColor: '#4ac9bc'}}
            handleStyle={{ borderColor: '#E6E8EB', borderWidth: 4 }}
          />
        </div>
      </footer>
    </div>
  )
}