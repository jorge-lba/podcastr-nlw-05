import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../../services/api'
import { convertDurationTimeString } from '../../utils/convertDurationToTimeString'

import styles from './episode.module.scss'

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
          <span>{ episode.members }</span>
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
  
  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url      
  }

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24, // 24 horas
  }
}