import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import styles from '../styles/EventsScouting.module.css'
import scoutingConfig from "./scouting-config.js";

const EventScouting: NextPage = () => {
  const [index, setIndex] = useState(0);
  const router = useRouter()
  const {c, tm} = router.query

  function next() {
    if (index === scoutingConfig.length-1) {
      console.log("SUBMIT")
    } else {
      setIndex(index+1);
    }
  }

  useEffect(() => {
    console.log(c);
    console.log(tm);
  }, [c, tm]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
            <h1>{scoutingConfig[index].name}:</h1>

            {
              scoutingConfig[index].inputs.map((element, index) => {
                  return (
                    <input type={element.type} placeholder={element.name} key={index}/>
                  );
              })
            }

        <article>
                <button onClick={() => setIndex(index-1)} disabled={index == 0}>Back</button>
                <button onClick={next}>{ index === scoutingConfig.length-1 ? "Submit" : "Next"}</button>
        </article>
      </main>

      <footer className={styles.footer}>
        <p>Sushi Scouts</p>
      </footer>
    </div>
  )
}

export default EventScouting
