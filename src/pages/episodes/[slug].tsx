import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'

import styles from './episode.module.scss'
import { getDataPodcastDevHouse } from '../../utils/getDataPodcastDevHouse'
import { usePlayer } from '../../contexts/PlayerContext'
import axios from 'axios'

type Episode = {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number,
  durationAsString: string,
  description: string,
  url: string,
}

type EpisodeProps = {
  episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer()
  
  return (
    <div className={ styles.container }>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>
      <div className={ styles.episode }>
      <div className={ styles.thumbnailContainer }>
        <Link href='/'>
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar"/>
          </button>
        </Link>
        <Image 
          width={700} 
          height={160} 
          src={ episode.thumbnail } 
          objectFit="cover"  
        />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio"/>
        </button>
        </div>

        <header>
          <h1>{ episode.title }</h1>
          <span>{ episode.members.length > 70 ? `${episode.members.slice(0, 70)}...` : episode.members }</span>
          <span>{ episode.publishedAt }</span>
          <span>{ episode.durationAsString }</span>
        </header>

        <div 
          className={styles.description} 
          dangerouslySetInnerHTML={ {__html: episode.description} }
        />
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await axios.get(process.env.API_DEV_HOUSE_URL,{
    params: {
      page: 1,
      itemsByPage: 2
    }
  })

  const episodes = response.data

  const latestEpisodes = episodes

  
  const paths = latestEpisodes.map(episode => {
    return {
      params: {
        slug: episode._id
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params
  
  const response = await axios.get(process.env.API_DEV_HOUSE_URL,{
    params: {
      page: 1,
      itemsByPage: 16
    }
  })

  const episodes = response.data
  
  const episode = episodes.find(episode => episode._id === slug)
  
  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24, // 24 horas
  }
}