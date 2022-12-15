import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getShips } from "../../lib/cms_if"

export async function getServerSideProps () {
  return {
    props: {
    }
  }
}

export default function Ships(props) {
  const ships = getShips();
  const router = useRouter();
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Space Invaders - Ships</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Space Invaders, Ships
        </h1>

        <ul>
          {ships && 
            ships.map( (ship, idx) => {
              return <li key={"ship_"+idx}>
                <Link href={`${router.asPath}/${ship.id}`}>
                  {ship.shiptype}
                </Link>
              </li>
            })
          }
        </ul>

        <div><Link href="/">Return Home</Link></div>
      </main>

      <footer className={styles.footer}>
        <div>
          CS55.13 Final Project
        </div>
      </footer>
    </div>
  )
}