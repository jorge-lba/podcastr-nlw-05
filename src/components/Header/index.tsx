import Image from "next/image"

import format from 'date-fns/format'
import ptBr from 'date-fns/locale/pt-BR'

import styles from './styles.module.scss'


export function Header(){
  const currentDate = format(new Date(), 'EEEEEE, d, MMM', {
    locale: ptBr
  })

  return(
    <header className={styles.headerContainer}>
      <Image 
      height={"80px"}
      width={"150px"}
      src="/logo-dev-house.svg" 
      alt="Dev House"/>

      <p>O melhor para você ouvir, sempre!</p>

      <span>{currentDate}</span>
    </header>
  )
}