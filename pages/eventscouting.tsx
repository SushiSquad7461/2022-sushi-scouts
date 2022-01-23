import type { NextPage } from 'next'
import { NextRouter, useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import styles from '../styles/EventsScouting.module.css'
import scoutingConfig from "./scouting-config.js";

const EventScouting: NextPage = () => {
  const [index, setIndex] = useState(0);
  const router: NextRouter = useRouter();

  function next() {
    if (index === scoutingConfig.length-1) {
      console.log("SUBMIT")
    } else {
      setIndex(index+1);
    }
  }

  useEffect(() => {
    let query_params: string = window.location.search;
    if (query_params.length == 0 || 
      query_params.substring(1, query_params.length).split("&")[0].substring(0,2) != "tm" ||
      query_params.substring(1, query_params.length).split("&").length <= 1 ||
      query_params.substring(1, query_params.length).split("&")[1][0] != "c") {
      router.push({
        pathname: '/scoutinfo'
      });
    } else {
      localStorage.setItem("TM", query_params.substring(1, query_params.length).split("&")[0].split("=")[1]);
      localStorage.setItem("C", query_params.substring(1, query_params.length).split("&")[1].split("=")[1]);
  
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
            <h1>{scoutingConfig[index].name}:</h1>

            {
              scoutingConfig[index].inputs.map((element, index) => {
                  if (element.type === "number") {
                      return (
                        <input type={element.type} placeholder={element.name} key={index}/>
                      );
                  } else {
                      return (
                        <div>
                          <p>{element.name}</p>
                          <input type={element.type} placeholder={element.name} key={index}/>
                        </div>
                      );
                  }
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
