import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getLevels } from "../../lib/cms_if"

export async function getServerSideProps () {
  return {
    props: {
    }
  }
}

export default function Levels(props) {
  const levels = getLevels();
  const router = useRouter();
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Space Invaders - Game Levels</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Space Invaders, Game Levels
        </h1>

        <ul>
          {levels && 
            levels.map( (level, idx) => {
              return <li key={"level_"+idx}>
                <Link href={`${router.asPath}/${level.id}`}>
                  {level.level_name}
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