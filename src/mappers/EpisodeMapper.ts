import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { IEpisodeDTO } from "../dtos/IEpisodeDTO"
import { convertDurationTimeString } from '../utils/convertDurationToTimeString'

interface IEpisode {
  _id:string
  title: string
  thumbnail: string
  members: string
  published_at: string
  duration: number
  durationAsString: string
  description: string
  url: string
}

const EpisodeMapper = (episode: IEpisodeDTO): IEpisode => {
  // console.log(episode.published_at)
  const [year, month, day] = episode.published_at.split('T')[0].split('-')
 
  const published_at = format(new Date(Number(year), Number(month), Number(day)), 'd MMM yy', { locale: ptBR })

  return Object.assign(episode, {
    published_at,
    durationAsString: convertDurationTimeString(Number(episode.duration)),
  }) as IEpisode
}

export { EpisodeMapper }