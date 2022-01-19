import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
import scoutingConfig from "./scouting-config.js";

const Home: NextPage = () => {
  const [matchInfo, setMatchInfo] = useState(true);
  console.log(scoutingConfig);
  return (
    <div className={styles.container}>
      <Head>
        <title>Sushi Squad Scouting</title>
        <meta name="description" content="Sushi Squad Scouting" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" color="white" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" color="white" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" color="white" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <main className={styles.main}>
        {
          matchInfo && <section>
            <h1>Match Info:</h1>
            <input type="number" placeholder='Team Number'/>
            <input type="number" placeholder='Match Number'/>

          </section>
        }
      </main>

      <footer className={styles.footer}>
        <section>
        </section>
        <p>Sushi Squad Scouting</p>

        <section>

        </section>
      </footer>
    </div>
  )
}

export default Home
