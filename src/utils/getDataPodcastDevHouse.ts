import convert from 'xml-js'
import axios from 'axios'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationTimeString } from '../utils/convertDurationToTimeString'


type Episode = {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number,
  description: string,
  url: string,
}

export const getDataPodcastDevHouse = async () => {
  const response = await axios.get('https://anchor.fm/s/5303f8b0/podcast/rss')
  const data = convert.xml2js(response.data, { compact: true })

  //@ts-ignore
  const episodes = data.rss.channel.item.map(episode => {
    const newDate = new Date(episode.pubDate._text).toISOString()
    const [publishedAt] = newDate.replace('T', ' ').split('.')

    const description = episode.description._cdata

    const [ _, allMembers ] = description.replace(/(<([^>]+)>)/gi, "").split('Hosts')
    const members = allMembers
      .replace(':', '')
      .replace('Convidados:', '')
      .replace(/\&nbsp;/g, '')
      .replace(/^\s*\n/gm, '')
      .replace(/,/gm, '')
      .split(/\n/g)
      .filter(member => member)
      .join(', ')

    

    return {
      id: episode.guid._text,
      title: episode.title._cdata,
      thumbnail: episode['itunes:image']._attributes.href,
      members,
      publishedAt: format(parseISO(publishedAt), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode['itunes:duration']._text),
      description,
      durationAsString: convertDurationTimeString(Number(episode['itunes:duration']._text)),
      url: episode.enclosure._attributes.url
    }
  })

  return episodes
}
