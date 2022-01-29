import type { NextPage } from 'next'
import { NextRouter, useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import ColorBar from '../components/colorbar';
import styles from '../styles/EventsScouting.module.css'
import scoutingConfig from "./scouting-config.js";
import Image from 'next/image';
import ButtonInput from '../components/buttoninput';

const EventScouting: NextPage = () => {
  const [index, setIndex] = useState(0);
  const router: NextRouter = useRouter();
  const [matchData, setMatchData] = useState({});

  function next() {
    if (index !== scoutingConfig.length-1) {
      setTimeout(() => setIndex(index+1), 0);
    }
  }

  async function sendData(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log(matchData);

    const res = await fetch("/api/submiteventinfo", {
      body: { matchData },
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    const result = await res.json()
  }

  useEffect(() => {
    let query_params: Array<string> = window.location.search.substring(1,  window.location.search.length).split("&");
    if (query_params.length == 0 ||
      query_params[0].substring(0,2) != "tm" ||
      query_params.length <= 1 ||
      query_params[1][0] != "c") {
      router.push({
        pathname: '/scoutinfo'
      });
    } else {
      localStorage.setItem("TM", query_params[0].split("=")[1]);
      localStorage.setItem("C", query_params[1].split("=")[1]);
      matchData.teamNumber = localStorage.getItem("TM");
      matchData.comp = localStorage.getItem("C");
      setMatchData(matchData);
    }
  }, [router, matchData]);

  useEffect(() => {
    for (let i of scoutingConfig) {
      for (let element of i.inputs) {
        if (element.type === "checkbox") {
          matchData[i.name.toLowerCase() + ":" + element.name.toLowerCase()] = "off";
        }
      }
    }
  }, []);

  function updateMatchData(event: React.FormEvent<HTMLFormElement>, name: string) {
    matchData[scoutingConfig[index].name.toLowerCase() + ":" + name.toLowerCase()] = event.target.value;
    setMatchData(matchData);
  }

  function addToMatchData<datatype>(name: string, defualtval: datatype) {
    matchData[scoutingConfig[index].name.toLowerCase() + ":" + name.toLowerCase()] = defualtval;
    setMatchData(matchData);
  }

  function updateDataFromButton(count: number, name: string) {
    matchData[scoutingConfig[index].name.toLowerCase() + ":" + name.toLowerCase()] = count;
    setMatchData(matchData);
  }

  // useEffect(() => addToMatchData<string>(element.name, "off"), [element.name, addToMatchData]);


  return (
    <div className={styles.container}>
      <article>
        <ColorBar />
        <h1>{scoutingConfig[index].name}</h1>
      </article>

      <section className={styles.image}>
        <Image src="/mask.svg" alt="Mask logo" width="400vw" height="400vh"/>
      </section>

      <form onSubmit={sendData} className={scoutingConfig[index].parentClassName}>
        {
          scoutingConfig[index].inputs.map(element => {
            if (element.type === "number") {
              return (
                <article key={element.name} className={element.className}>
                  <h1>{element.name}</h1>
                  <input type={element.type} name={element.name} onChange={e => updateMatchData(e, element.name)} />
                </article>
              );
            } else if (element.type === "radio" && element.values.length !== 0) {
              return (
                <section key={element.name} className={element.className}>
                  {
                    element.values.map(checkbox => {
                      return (
                        <section key={checkbox}>
                          <input type={ element.type } name={element.name} value={checkbox.toLowerCase()} onChange={e => updateMatchData(e, element.name)}/>
                          <label>{ checkbox }</label>
                        </section>
                      );
                    })
                  }
                </section>
              );
            } else if (element.type === "checkbox") {
              return (
                <section className={element.className} key={element.name}>
                  <input type={element.type} name={element.name} onChange={e => updateMatchData(e, element.name)}/>
                  <label>{ element.name } </label>
                </section>
              );
            } else if (element.type === "button") {
              return (
                <ButtonInput name={element.name} key={element.name + scoutingConfig[index].name} extraClass={element.className} update={updateDataFromButton}/>
              );
            } else if (element.type === "textarea") {
              return (
                <input type={element.type} key={element.name} className={element.className} name={element.name} onChange={e => updateMatchData(e, element.name)}/>
              );
            }
          })
        }

         {
           index == scoutingConfig.length-1 ?
           <button className={styles.button2} type="submit" onClick={next} >
            <p className={styles.text3}> Submit</p>
          </button> :  <button className={styles.button2} type={"button" } onClick={next} >
            <p className={styles.text3}>Continue</p>
          </button>
         }
      </form>

    </div>
  )
}

export default EventScouting;
