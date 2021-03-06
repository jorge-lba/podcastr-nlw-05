import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import axios from 'axios'

import styles from './home.module.scss'
import { usePlayer } from '../contexts/PlayerContext'
import { EpisodeMapper } from '../mappers/EpisodeMapper'
import { IEpisodeDTO } from '../dtos/IEpisodeDTO'
import { useEffect, useState } from 'react'


type HomeProps = {
  latestEpisodes: IEpisodeDTO[],
  allEpisodes: IEpisodeDTO[]
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const [episodesInTable, setEpisodesInTable] = useState(allEpisodes)
  const [episodeList, setEpisodeList] = useState(allEpisodes)
  const [episodesPage, setEpisodesPage] = useState(2)
  const [continueUpdateEpisodeList, setContinueUpdateEpisodeList] = useState(true)

  const { playList } = usePlayer()

  useEffect(() => {
    setEpisodeList([...latestEpisodes, ...episodesInTable])
  }, [])


  async function updateEpisodesList (e){
    const element = e.target
    const scrollHeightValueUpdate = (element.clientHeight/100)*150
    
    if(element.scrollHeight - element.scrollTop <= scrollHeightValueUpdate && continueUpdateEpisodeList){
      setEpisodesPage(episodesPage + 1)


      const response = await axios.get("https://api-devhouse-podcast.herokuapp.com/podcasts/episodes",{
        params: {
          page: episodesPage,
          itemsByPage: 12
        }
      })
      const episodes = response.data

      if(episodes.length > 0 ){
        
        setEpisodesInTable([...episodesInTable, ...episodes])
        setEpisodeList([...episodeList, ...episodes])

      }else {
        setContinueUpdateEpisodeList(false)
      }

    }
  } 


  return (
    <div className={styles.homepage} onScroll={updateEpisodesList}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          { latestEpisodes.map((episodeValue, index) => {
            
            const episode = EpisodeMapper({...episodeValue})
            
            return (
              <li key={ episode._id }>
                <Image 
                  width={192} 
                  height={192} 
                  src={ episode.thumbnail } 
                  alt={ episode.title }
                  objectFit="cover"
                />

                <div className={ styles.episodeDetails }>
                  <Link href={ `/episodes/${episode._id}` }>
                    <a >{ episode.title }</a>
                  </Link>
                  <p>{ episode.members.length > 30 ? `${episode.members.slice(0, 30)}...` : episode.members }</p>
                  <span>{ episode.published_at }</span>
                  <span>{ episode.durationAsString }</span>
                </div>

                <button type="button" onClick={() => playList(episodeList, index)} >
                  <img src="/play-green.svg" alt="Tocar episodio"/>
                </button>
              </li>
            )
          }) }
        </ul>
      </section>

      <section className={styles.allEpisodes}>
          <h2>Todos episódios</h2>

          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="episodes">
              { episodesInTable.map((episodeValue, index) => {
                const episode = EpisodeMapper({...episodeValue})
                
                return (
                  <tr key={episode._id}>
                    <td style={{width: 72}}>
                      <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <Link href={ `/episodes/${episode._id}` }>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{ episode.members.length > 50 ? `${episode.members.slice(0, 50)}...` : episode.members }</td>
                    <td style={{width: 100}} >{ episode.published_at }</td>
                    <td>{ episode.durationAsString }</td>
                    <td>
                      <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                        <img src="/play-green.svg" alt="Tocar episódio"/>
                      </button>
                    </td>
                  </tr>
                )
              }) }
            </tbody>
          </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await axios.get(process.env.API_DEV_HOUSE_URL,{
    params: {
      page: 1,
      itemsByPage: 12
    }
  })

  const episodes = response.data

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}
