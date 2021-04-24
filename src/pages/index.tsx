import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import styles from './home.module.scss'
import { getDataPodcastDevHouse } from '../utils/getDataPodcastDevHouse'
import { useContext } from 'react'
import { PlayerContext } from '../contexts/PlayerContext'

type Episode = {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number,
  durationAsString: string,
  url: string,
}

type HomeProps = {
  latestEpisodes: Episode[],
  allEpisodes: Episode[]
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { play } = useContext(PlayerContext)


  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          { latestEpisodes.map(episode => {
            return (
              <li key={ episode.id }>
                <Image 
                  width={192} 
                  height={192} 
                  src={ episode.thumbnail } 
                  alt={ episode.title }
                  objectFit="cover"
                />

                <div className={ styles.episodeDetails }>
                  <Link href={ `/episodes/${episode.id}` }>
                    <a >{ episode.title }</a>
                  </Link>
                  <p>{ episode.members.length > 30 ? `${episode.members.slice(0, 30)}...` : episode.members }</p>
                  <span>{ episode.publishedAt }</span>
                  <span>{ episode.durationAsString }</span>
                </div>

                <button type="button" onClick={() => play(episode)} >
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
            <tbody>
              { allEpisodes.map(episode => {
                return (
                  <tr key={episode.id}>
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
                      <Link href={ `/episodes/${episode.id}` }>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{ episode.members.length > 50 ? `${episode.members.slice(0, 50)}...` : episode.members }</td>
                    <td style={{width: 100}} >{ episode.publishedAt }</td>
                    <td>{ episode.durationAsString }</td>
                    <td>
                      <button type="button">
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
  const episodes = await getDataPodcastDevHouse()  

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
