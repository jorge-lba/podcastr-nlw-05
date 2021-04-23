import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../../services/api'
import { convertDurationTimeString } from '../../utils/convertDurationToTimeString'

import styles from './episode.module.scss'
import { getDataPodcastDevHouse } from '../../utils/getDataPodcastDevHouse'

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
  return (
    <div className={ styles.container }>
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
        <button type="button">
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
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params

  const episodes = await getDataPodcastDevHouse()
  const data = episodes.find(episode => episode.id === slug)
   
  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.publishedAt), 'd MMM yy', { locale: ptBR }),
    duration: Number(data.duration / 1000),
    durationAsString: convertDurationTimeString(Number(data.duration )),
    description: data.description,
    url: data.url      
  }

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24, // 24 horas
  }
}