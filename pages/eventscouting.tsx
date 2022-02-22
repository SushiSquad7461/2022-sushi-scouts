import type {NextPage} from "next";
import {ChangeEvent, useEffect, useState} from "react";
import ColorBar from "../components/colorbar";
import styles from "../styles/EventsScouting.module.css";
import {scoutingConfig} from "../data/scouting-config";
import Image from "next/image";
import ScoutingPage from "../components/scoutingpage";
import {NextRouter, useRouter} from "next/router";

export type ScoutingInput = {
  "name": string, // Name of input
  "type": string, // Type of input
  "values": string[], // if applicable, if not leave as empty array)
  "className": string // "" for no className
}

export type ScoutingData = {
  [index: string]: string | number,
}

const EventScouting: NextPage = () => {
  const [index, setIndex] = useState(0);
  const [matchData, setMatchData] = useState<ScoutingData>({});
  const [matchNum, setMatchNum] = useState(0);
  const router: NextRouter = useRouter();

  /**
   * Moves to next scouting page
   */
  function next() {
    if (index !== scoutingConfig.length-1) {
      setTimeout(() => setIndex(index+1), 0);
    }
  }

  /**
   * Moves to previous page
   */
  function prev() {
    if (index !== 0) {
      setTimeout(() => setIndex(index-1), 0);
    }
  }

  /**
   * Submit form data
   * @param {React.FormEvent<HTMLFormElement>} event form event
   */
  async function sendData(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const res = await fetch("/api/submiteventinfo", {
      body: JSON.stringify(matchData),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (res.ok) {
      setIndex(0);
      localStorage.setItem("MN", (matchNum + 1).toString());
      setMatchNum(matchNum + 1);
      resetMatchData();
    }
  }

  useEffect(() => {
    const queryParams: Array<string> = window.location.search.substring(
        1, window.location.search.length).split("&");

    if (queryParams.length == 0 ||
      queryParams[0].substring(0, 2) != "tm" ||
      queryParams.length <= 1 ||
      queryParams[1][0] != "c") {
      router.push({
        pathname: "/scoutinfo",
      });
    } else {
      const teamNumber = queryParams[0].split("=")[1];
      const compName = queryParams[0].split("=")[1];

      localStorage.setItem("TM", teamNumber);
      localStorage.setItem("C", compName);

      matchData.teamNumber = teamNumber;
      matchData.comp = compName;
      setMatchData(matchData);
    }

    resetMatchData();
  }, [matchData]);


  /**
   * Reset all scouting data
   */
  function resetMatchData() {
    for (const i of scoutingConfig) {
      for (const element of i.inputs) {
        const key = i.name.toLowerCase() + ":" + element.name.toLowerCase();
        if (element.type === "checkbox") {
          matchData[key] = "off";
        } else if (element.type === "number") {
          matchData[key] = 0;
        } else if (element.type === "radio") {
          matchData[key] = "no option selected";
        } else if (element.type === "button") {
          matchData[key] = 0;
        } else if (element.type === "textarea") {
          matchData[key] = "";
        }
      }
    }
  }

  /**
   * Update match data
   * @param {ChangeEvent<HTMLInputElement>} event change event
   * @param {string} name name of input
   */
  function updateMatchData(
      event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
      name: string) {
    matchData[scoutingConfig[index].
        name.toLowerCase() + ":" + name.toLowerCase()] = event.target.value;
    setMatchData(matchData);
  }

  /**
   * Update match data
   * @param {number} count new input
   * @param {string} name name of input
   */
  function updateDataFromButton(count: number, name: string) {
    matchData[scoutingConfig[index].
        name.toLowerCase() + ":" + name.toLowerCase()] = count;
    setMatchData(matchData);
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

      <form onSubmit={sendData}
        className={"scoutingform"}>

        <ScoutingPage index={index}
          updateMatchData={updateMatchData}
          updateDataFromButton={updateDataFromButton}
          currMatchData={matchData}
          class={scoutingConfig[index].parentClassName}
          matchNum={matchNum}
          setMatchNum={setMatchNum}
        />

        <button className={styles.button1} type="button" onClick={prev}>
          <p className={styles.text3}>Back</p>
        </button>

        {
           index == scoutingConfig.length-1 ?
           <button className={styles.button2} type="submit" onClick={next} >
             <p className={styles.text3}> Submit</p>
           </button> : <button className={styles.button2}
             type={"button" }
             onClick={next} >
             <p className={styles.text3}>Continue</p>
           </button>
        }

      </form>

    </div>
  );
};

export default EventScouting;
