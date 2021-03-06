import type {NextPage} from "next";
import {ChangeEvent, useEffect, useState} from "react";
import ColorBar from "../components/colorbar";
import styles from "../styles/EventsScouting.module.css";
import {scoutingConfig} from "../data/scouting-config";
import Image from "next/image";
import ScoutingPage from "../components/scoutingpage";
import {NextRouter, useRouter} from "next/router";
import Link from "next/link";
import Error from "../components/error";
import Sparkie from "../components/sparkie";

export type ScoutingInput = {
  "name": string, // Name of input
  "type": string, // Type of input
  "values": string[], // if applicable, if not leave as empty array)
  "className": string // "" for no className
}

export type ScoutingData = {
  [index: string]: string | number,
}

const dbName = "localCompData";

const EventScouting: NextPage = () => {
  const [index, setIndex] = useState(0);
  const [matchData, setMatchData] = useState<ScoutingData>({});
  const [matchNum, setMatchNum] = useState(1);
  const router: NextRouter = useRouter();
  const [error, setError] = useState<Array<string>>([]);
  const [success, setSuccess] = useState(false);

  /**
   * Moves to next scouting page
   */
  function next() {
    if (index === 0) {
      console.log(localStorage.getItem("C"));
      fetch("/api/logscouting?matchNum=" +
        matchNum +
        "&matchType=" +
              getData("match type") +
              "&station=" +
              getData("station id") +
        "&code=" +
        (localStorage.getItem("C") === null ?
        "" : localStorage.getItem("C")));
    }

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
   * validate that all felids are valid
   * @return {string} error message
   */
  function verifyData() {
    const errors = [];

    for (const i of scoutingConfig) {
      for (const element of i.inputs) {
        const key = i.name.toLowerCase() + ":" + element.name.toLowerCase();

        console.log(key + ":" + matchData[key] + ":" + typeof(matchData[key]));

        if (key === "match info:match #" && matchData[key].toString() === "0") {
          errors.push("Invalid Match Number");
        } else if (key === "match info:team # you're scouting" &&
        (matchData[key].toString() === "0" ||
        matchData[key].toString() === "0000")) {
          errors.push("Invalid Team Number");
        } else if (key === "match info:match type" &&
          matchData[key] === "no option selected") {
          errors.push("No match type selected");
        } else if (key === "end game:climb type" &&
        matchData["end game:climb"] !== "no climb" &&
        matchData[key] === "no option selected") {
          errors.push("No Climb Type Selected");
        } else if ((element.type === "select" || element.type === "radio") &&
          matchData[key] === "no option selected" &&
          key !== "end game:climb type") {
          errors.push("No option selected for: " +
            element.name.toLowerCase());
        } else if (element.type === "string" && matchData[key] === "") {
          error.push("Please enter in a value for: " +
            element.name.toLowerCase());
        }
      }
    }

    return errors;
  }

  /**
   * Submit form data
   * @param {React.FormEvent<HTMLFormElement>} event form event
   */
  async function sendData(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(matchData);
    const errors = verifyData();

    if (errors.length > 0) {
      setError(errors);
      return;
    }

    const res = await fetch("/api/submiteventinfo", {
      body: JSON.stringify(matchData),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (res.ok) {
      setIndex(0);
      setMatchNum(matchNum + 1);
      localStorage.setItem("MN", (matchNum+1).toString());
      // Wait for localStorage to update
      setTimeout(() => resetMatchData(), 0);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(["Could not submit"]);
    }

    if (localStorage.getItem(dbName) === null) {
      const data = [matchData];
      localStorage.setItem(dbName, JSON.stringify(data));
    } else {
      const data = [...JSON.parse(localStorage.getItem(dbName)!.toString()),
        matchData];
      localStorage.setItem(dbName, JSON.stringify(data));
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
      const compName = queryParams[1].split("=")[1];

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

        if (key === "match info:match #") {
          matchData[key] = localStorage.getItem("MN") === null ?
            1 : parseInt(localStorage.getItem("MN")?.toString()!);
        } else if (key === "match info:station id") {
          const stationVal = localStorage.getItem("STATION");
          matchData[key] = stationVal !== null ? stationVal.toString() : "R1";
        } else if (key === "match info:match type") {
          const matchType = localStorage.getItem("MT");
          matchData[key] = matchType !== null ? matchType.toString().
              toLowerCase() : "no option selected";
          console.log(matchData[key]);
        } else if (element.type === "checkbox") {
          matchData[key] = "off";
        } else if (element.type === "number") {
          matchData[key] = 0;
        } else if (element.type === "radio") {
          matchData[key] = "no option selected";
        } else if (element.type === "button") {
          matchData[key] = 0;
        } else if (element.type === "textarea") {
          matchData[key] = "";
        } else if (element.type === "select") {
          matchData[key] = "no option selected";
        } else if (key === "match info:ur name") {
          const name = localStorage.getItem("NAME");
          matchData[key] = name !== null ? name.toString().
              toLowerCase() : "";
        } else if (element.type === "string") {
          matchData[key] = "";
        }
      }
    }
    console.log("Reseting data");
    console.log(matchData);
  }

  /**
   * Update match data
   * @param {ChangeEvent<HTMLInputElement>} event change event
   * @param {string} name name of input
   */
  function updateMatchData(
      event: ChangeEvent<HTMLInputElement> |
        ChangeEvent<HTMLTextAreaElement> |
        ChangeEvent<HTMLSelectElement>,
      name: string) {
    matchData[scoutingConfig[index].
        name.toLowerCase() + ":" + name.toLowerCase()] = event.target.value;
    setMatchData(matchData);
    console.log("update data ");
    console.log(matchData);
  }
  /**
   * Update match data
   * @param {string} newVal new val
   * @param {string} name name of input
   */
  function updateMatchDataFromVal(newVal: string, name: string) {
    matchData[scoutingConfig[index].
        name.toLowerCase() + ":" + name.toLowerCase()] = newVal;
    setMatchData(matchData);
    console.log("Data from val ");
    console.log(matchData);
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

  /**
   * Gets value from key
   * @param {string} name key
   * @return {string} value
   */
  function getData(name: string) {
    return matchData[scoutingConfig[index].
        name.toLowerCase() + ":" + name.toLowerCase()];
  }

  return (
    <div className={styles.container}>
      {error.length > 0 && <Error error={error} setError={setError}/>}
      {success && <Sparkie />}

      <article>
        <ColorBar />
        <h1>{scoutingConfig[index].name}</h1>
      </article>

      <section className={styles.image}>
        <Link href={"/"}>
          <Image src="/mask.svg" alt="Mask logo" width="400vw" height="400vh"/>
        </Link>
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
          updateMatchDataFromVal={updateMatchDataFromVal}
        />

        { index > 0 &&
        <button className={styles.button1} type="button" onClick={prev}>
          <p className={styles.text3}>Back</p>
        </button> }

        {
           index == scoutingConfig.length-1 ?
           <button className={styles.button2} type="submit" onClick={next} >
             <p className={styles.text3}> Submit</p>
           </button> : <button className={styles.button2}
             type={"button" }
             onClick={next} >
             <p className={styles.text3}>{index === 0 ? "Start": "Continue"}</p>
           </button>
        }

      </form>
    </div>
  );
};

export default EventScouting;
