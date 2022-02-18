import type { NextPage } from 'next'
import { NextRouter, useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react'
import ColorBar from '../components/colorbar';
import styles from '../styles/EventsScouting.module.css'
import { scoutingConfig } from "../data/scouting-config";
import Image from 'next/image';

import ButtonInput from '../components/buttoninput';

export type ScoutingInput = {
  "name": string, // Name of input
  "type": string, // Type of input
  "values": string[], // if applicable, if not leave as empty array)
  "className": string // "" for no className
}

type ScoutingData = {
  [index: string]: string | number,
}

const EventScouting: NextPage = () => {
  const [index, setIndex] = useState(0);
  const router: NextRouter = useRouter();
  const [matchData, setMatchData] = useState<ScoutingData>({});
  const [climbOn, setClimbOn] = useState(false);
  const [matchType, setMatchType] = useState<string>("");
  const [matchNum, setMatchNum] = useState(0);
  // Team number that is being scouted
  const [teamNum, setTeamNum] = useState<string>("");

  function next() {
    if (index !== scoutingConfig.length-1) {
      setTimeout(() => setIndex(index+1), 0);
    }
  }

  function prev() {
    if (index !== 0) {
      setTimeout(() => setIndex(index-1), 0);
    }
  }

  async function sendData(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const res = await fetch("/api/submiteventinfo", {
      body: JSON.stringify(matchData),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    if (res.ok) {
      setIndex(0);
      localStorage.setItem("MN", (matchNum + 1).toString());
      setMatchNum(matchNum + 1);
      resetMatchData();
    }
  }

  useEffect(() => {
    let query_params: Array<string> = window.location.search.substring(1,  window.location.search.length).split("&");
    let matchNumber = localStorage.getItem("MN");
    let matchType = localStorage.getItem("MT");

    if (query_params.length == 0 ||
      query_params[0].substring(0,2) != "tm" ||
      query_params.length <= 1 ||
      query_params[1][0] != "c") {
      router.push({
        pathname: '/scoutinfo'
      });
    } else {
      let teamNumber = query_params[0].split("=")[1];
      let compName = query_params[0].split("=")[1];

      localStorage.setItem("TM", teamNumber);
      localStorage.setItem("C", compName);

      matchData.teamNumber = teamNumber;
      matchData.comp = compName;
      setMatchData(matchData);
    }

    if (matchType !== null) {
      setMatchType(matchType);
    }

    if (matchNumber !== null) {
      setMatchNum(parseInt(matchNumber));
    }

  }, [router, matchData]);

  useEffect(() => {
    resetMatchData();
  }, [matchData]);


  function resetMatchData() {
    for (let i of scoutingConfig) {
      for (let element of i.inputs) {
        if (element.type === "checkbox") {
          matchData[i.name.toLowerCase() + ":" + element.name.toLowerCase()] = "off";
        } else if (element.type === "number") {
          matchData[i.name.toLowerCase() + ":" + element.name.toLowerCase()] = 0;
        } else if (element.type === "radio") {
          matchData[i.name.toLowerCase() + ":" + element.name.toLowerCase()] = "no option selected";
        } else if (element.type === "button") {
          matchData[i.name.toLowerCase() + ":" + element.name.toLowerCase()] = 0;
        } else if (element.type === "textarea") {
          matchData[i.name.toLowerCase() + ":" + element.name.toLowerCase()] = "";
        }
      }
    }
  }

  function updateMatchData(event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> , name: string) {
    matchData[scoutingConfig[index].name.toLowerCase() + ":" + name.toLowerCase()] = event.target.value;
    setMatchData(matchData);
  }


  function updateDataFromButton(count: number, name: string) {
    matchData[scoutingConfig[index].name.toLowerCase() + ":" + name.toLowerCase()] = count;
    setMatchData(matchData);
  }

  async function getTeamNumber(currMatchNum: number, currMatchType: String) {
    if (!isNaN(currMatchNum)) {
      const data = await fetch("/api/getteamnum?matchNum=" + currMatchNum + "&matchType=" + currMatchType);
      setTeamNum(await data.text());
    }
  }

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
          scoutingConfig[index].inputs.map((element: ScoutingInput)  => {
            if (element.type === "number") {
              return (
                <article key={element.name} className={element.className}>
                  <h1>{element.name}</h1>
                  <input type={element.type} name={element.name} onChange={e => { 
                    updateMatchData(e, element.name)

                    if (element.name === "MATCH #") {
                      localStorage.setItem("MN", e.target.value);
                      setMatchNum(parseInt(e.target.value));
                      getTeamNumber(parseInt(e.target.value), matchType);
                    } else if (element.name === "TEAM # YOU'RE SCOUTING") {
                      setTeamNum((e.target.value));
                    }
                  }}
                    value={element.name === "MATCH #" ? matchNum : (element.name === "TEAM # YOU'RE SCOUTING" ? teamNum : undefined)}/>
                </article>
              );
            } else if (element.type === "radio" && element.values.length !== 0 && (climbOn || element.name !== "CLIMB TYPE")) {
              return (
                <section key={element.name} className={element.className}>
                  {
                    element.values.map((checkbox: string) => {
                      return (
                        <section key={checkbox}>
                          <input type="radio" name={element.name} value={checkbox.toLowerCase()} onChange={e => {
                              updateMatchData(e, element.name)

                              if (checkbox === "ATTEMPTED CLIMB" || checkbox === "FAILED CLIMB") {
                                setClimbOn(true);
                              } else if (checkbox === "NO CLIMB") {
                                setClimbOn(false);
                              } else if (element.name === "MATCH TYPE") {
                                localStorage.setItem("MT", checkbox);
                                setMatchType(checkbox);

                                localStorage.setItem("MN", "0");
                                setMatchNum(1);

                                getTeamNumber(1, checkbox);
                              }
                          }} defaultChecked={(matchData[scoutingConfig[index].name.toLowerCase() + ":" + element.name.toLowerCase()]) === checkbox.toLowerCase()} checked={element.name === "MATCH TYPE" ? (matchType === checkbox) : undefined}/>
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
                  <input type={element.type} name={element.name} defaultChecked={(matchData[scoutingConfig[index].name.toLowerCase() + ":" + element.name.toLowerCase()]) === "on"} onChange={e => updateMatchData(e, element.name)}/>
                  <label>{ element.name } </label>
                </section>
              );
            } else if (element.type === "button") {
              return (
                <ButtonInput default={matchData[scoutingConfig[index].name.toLowerCase() + ":" + element.name.toLowerCase()]} name={element.name} key={element.name + scoutingConfig[index].name} extraClass={element.className} update={updateDataFromButton}/>
              );
            } else if (element.type === "textarea") {
              return (
                <textarea defaultValue={(matchData[scoutingConfig[index].name.toLowerCase() + ":" + element.name.toLowerCase()])} key={element.name} className={element.className} name={element.name} onChange={e => updateMatchData(e, element.name)} placeholder={element.name} autoComplete="off" rows={4} cols={50}/>
              );
            }
          })
        }

        <button className={styles.button1} type="button" onClick={prev}>
                <p className={styles.text3}>Back</p>
        </button>

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
