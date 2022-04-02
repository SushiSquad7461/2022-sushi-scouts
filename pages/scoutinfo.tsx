import type {NextPage} from "next";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import ColorBar from "../components/colorbar";
import styles from "../styles/ScoutInfo.module.css";

const ScoutInfo: NextPage = () => {
  const [comp, setComp] = useState<number>(0);
  const [teamNum, setTeamNum] = useState<string>("");
  const [comps, setComps] = useState<Array<Array<string>>>([]);

  // Set team number and store in local storage
  const setTeamNumWrapper = (val: string) => {
    setTeamNum(val);
    localStorage.setItem("TM", val);
  };

  // Set comp number and store in local storage
  const setCompWrapper = (val: number) => {
    setComp(val);
    localStorage.setItem("C", comps[val][0]);
    console.log(comps);
  };

  /**
   * Get all of the comps
   */
  async function getAllComps() {
    const data = await fetch("/api/getallcomps");
    const compCodes: Array<string> = await data.json();
    const newComps: Array<Array<string>> = [];

    for (const i of compCodes) {
      if (i === "WASNO") {
        newComps.push([i, "GLACIER PEAK"]);
      } else if (i === "WAYAK") {
        newComps.push([i, "SUNDOME"]);
      } else if (i === "PNCMP") {
        newComps.push([i, "DISTRICTS LES GO"]);
      } else {
        newComps.push([i, i]);
      }
    }
    console.log(newComps);
    setComps(newComps);

    if (localStorage.getItem("C") !== null) {
      for (let i: number = 0; i < comps.length; ++i) {
        if (comps[i][0] === localStorage.getItem("C")) {
          setComp(i);
        }
      }
    }
  }


  useEffect(() => {
    // Get current info from local storage
    if (localStorage.getItem("TM") !== null) {
      setTeamNum(localStorage.getItem("TM") || "");
    }
    getAllComps();
  }, [teamNum]);

  return (
    <div className={styles.title}>
      <article>
        <ColorBar />
        <h1>SUSHI SCOUTS</h1>
      </article>

      <section className={styles.image}>
        <Link href={"/"}>
          <Image src="/mask.svg" alt="Mask logo" width="400vw" height="400vh"/>
        </Link>
      </section>

      <form onSubmit={(e) => e.preventDefault()}>
        <article>
          <h1>YOUR TEAM NUMBER</h1>
          <input type="number"
            value={teamNum}
            onChange={(event) => setTeamNumWrapper(event.currentTarget.value)}
          />
        </article>

        <section>
          {comps}
          { comps.length >= 1 && <article>
            <input type="checkbox"
              id="1"
              name="comp"
              value={comps[0][0]}
              checked={comp == 0}
              onChange={() => setCompWrapper(0)}
            />
            <label>{comps[0][1]}</label>
          </article> }

          { comps.length >= 2 && <article>
            <input type="checkbox"
              id="1"
              name="comp"
              value={comps[1][1]}
              checked={comp == 1}
              onChange={() => setCompWrapper(1)}
            />
            <label>{comps[1][0]}</label>
          </article> }

          { comps.length >= 3 && <article>
            <input type="checkbox"
              id="1"
              name="comp"
              value={comps[2][1]}
              checked={comp == 2}
              onChange={() => setCompWrapper(2)}
            />
            <label>{comps[2][0]}</label>
          </article> }
        </section>

        <button className={styles.button1}>
          <Link href = "/" passHref>
            <p className={styles.text3}>Return</p>
          </Link>
        </button>

        <button className={styles.button2}>
          { teamNum !== undefined ?
            <Link href={"/eventscouting?tm=" + teamNum + "&c=" +
              (comps.length > 0 ? comps[comp][0] : "")}
            passHref>
              <p className={styles.text3}>Continue</p>
            </Link> :
            <p className={styles.text3}>Continue</p> }
        </button>
      </form>
    </div>
  );
};

export default ScoutInfo;
