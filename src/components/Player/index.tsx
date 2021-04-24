import Image from 'next/image'
import { useEffect, useRef } from 'react'
import Slider from 'rc-slider'

import { usePlayer } from '../../contexts/PlayerContext'

import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'

export function Player(){
  const audioRef = useRef<HTMLAudioElement>(null)

  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    setPlayingSate,
    hasNext,
    hasPrevious
  } = usePlayer()

  useEffect(() => {
    if(!audioRef.current) return

    if(isPlaying){
      audioRef.current.volume = .2
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
          <span>00:00</span>
          <div className={styles.slider}>
            { episode ? (
              <Slider 
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{backgroundColor: '#9f75ff'}}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            ) }
          </div>
          <span>00:00</span>
        </div>
        
        {episode && (
          <audio
            src={episode.url} 
            ref={audioRef} 
            autoPlay
            onPlay={() => setPlayingSate(true)}
            onPause={() => setPlayingSate(false)}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
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
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="Repetir"/>
          </button>
        </div>
      </footer>
    </div>
  )
}