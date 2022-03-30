import type {NextPage} from "next";
import Image from "next/image";
import {useEffect, useState} from "react";
import AdminNav from "../../components/adminnav";
import ColorBar from "../../components/colorbar";
import styles from "../../styles/Admin.module.css";
import datastyles from "../../styles/AdminData.module.css";

const Data: NextPage = () => {
  const [comps, setComps] = useState<Array<string>>([]);
  const [currComp, setCurrComp] = useState<string>("All");
  const [numMatches, setNumMatches] = useState<string>("NONE");
  const [highestMatch, setHighestMatch] = useState<string>("NONE");
  const [lowestMatch, setLowestMatch] = useState<string>("NONE");

  useEffect(() => {
    getAllComps();
    updateLocalDataStats();
  }, []);

  /**
   * Get all of the comps
   */
  async function getAllComps() {
    const data = await fetch("/api/getallcomps");
    const newComps: Array<string> = await data.json();
    newComps.push("All");
    setComps(newComps);
  }

  /**
   * Update the current local data stats
   */
  function updateLocalDataStats() {
    const localData = localStorage.getItem("localCompData");

    if (localData !== null && JSON.parse(localData).length > 0) {
      const data = JSON.parse(localData);
      setNumMatches(data!.length.toString());

      let min = data![0]["match info:match #"];
      let max = data![0]["match info:match #"];

      for (const i of data!) {
        if (i["match info:match #"] < min) {
          min = i["match info:match #"];
        } else if (i["match info:match #"] > max) {
          max = i["match info:match #"];
        }
      }

      setLowestMatch(min);
      setHighestMatch(max);
    }
  }

  /**
   * Upload data from client storage to server
   */
  async function uploadData() {
    let data = localStorage.getItem("localCompData");

    if (data !== null) {
      data = JSON.parse(data);
    }

    if (data !== null) {
      for (const i of data) {
        await fetch("/api/submiteventinfo", {
          body: JSON.stringify(i),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });
      }
    }
  }

  /**
   * Clear local data
   */
  async function clearLocalData() {
    if (localStorage.getItem("localCompData") !== null) {
      localStorage.setItem("localCompData", "[]");
      updateLocalDataStats();
    }
  }

  return (
    <div className={styles.title}>
      <article>
        <ColorBar />
        <h1>ADMIN</h1>
      </article>

      <section className={styles.image}>
        <Image src="/mask.svg" alt="Mask logo" width="300vw" height="300vh"/>
      </section>

      <section className={datastyles.comps}>
        <h1>COMP SELECTION</h1>

        {
          comps.map((element) => {
            return (
              <section key={element}>
                <input type="radio" name={element}
                  value={element}
                  onChange={() => setCurrComp(element)}
                  checked={currComp === element}/>
                <label>{ element }</label>
              </section>
            );
          })
        }
      </section>

      <section className={datastyles.local}>
        <h1>LOCAL DATA</h1>
        <section>
          <p># of Matches: {numMatches}</p>
          <p>Lowest Match: {lowestMatch}</p>
          <p>Highest Match: {highestMatch}</p>
        </section>
      </section>

      <section className={datastyles.data}>
        <h1>DATA</h1>

        <article>
          <button onClick={uploadData}>
          Upload Local Data
          </button>

          <button>
            <a href={"/api/getscoutingdata?comp=" + currComp}>Download Data</a>
          </button>

          <button onClick={clearLocalData}>
          Clear Local Data
          </button>
        </article>
      </section>

      <AdminNav />
    </div>
  );
};

export default Data;

