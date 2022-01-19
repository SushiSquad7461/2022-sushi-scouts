import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { DEFAULT_MAX_VERSION } from 'tls'
import styles from '../styles/Home.module.css'
import scoutingConfig from "./scouting-config.js";

const Home: NextPage = () => {
  const [index, setIndex] = useState(0);

  console.log(scoutingConfig);

  function next() {
    if (index === scoutingConfig.length-1) {
      console.log("SUBMIT")
    } else {
      setIndex(index+1);
    }
  }

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
            <h1>{scoutingConfig[index].name}:</h1>

            {
              scoutingConfig[index].inputs.map((element, index) => {
                  return (
                    <input type={element.type} placeholder={element.name} key={index} defaultValue={element.default}/>
                  );
              })
            }

            
        <article>
                <button onClick={() => setIndex(index-1)} disabled={index == 0}>Back</button>
                <button onClick={next}>{ index === scoutingConfig.length-1 ? "Submit" : "Next"}</button>
        </article>
      </main>

      <footer className={styles.footer}>
        <section>
        </section>
        <p>Sushi Scouts</p>

        <section>

        </section>
      </footer>
    </div>
  )
}

export default Home
