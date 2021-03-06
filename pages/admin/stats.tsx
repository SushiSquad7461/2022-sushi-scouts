import type {NextPage} from "next";
import Image from "next/image";
import {useEffect, useState} from "react";
import AdminNav from "../../components/adminnav";
import ColorBar from "../../components/colorbar";
import styles from "../../styles/Admin.module.css";
import statstyles from "../../styles/AdminStats.module.css";
import {currScoutingType, statsType} from "../api/getstats";

const Stats: NextPage = () => {
  const [scoutMatchNum, setScoutMatchNum] = useState<number>(1);
  const [code, setCode] = useState("");
  const [stats, setSats] = useState({"currScouting": [], "stats": []});

  useEffect(() => {
    setCode(localStorage.getItem("C") === null ? "" :
      localStorage.getItem("C")!);

    getCurrentStats(scoutMatchNum, scoutMatchNum,
      localStorage.getItem("C") === null ? "" :
      localStorage.getItem("C")!);
  }, []);

  /**
   * Get stats from api
   * @param {number} currNum the quals match we are getting data for`
   * @param {number} maxNum the latest quals match
   * @param {string} code event code
   */
  async function getCurrentStats(currNum: number,
      maxNum: number, code: string) {
    const data = await fetch("/api/getstats?currQual=" +
      currNum +
      "&maxQual=" +
      maxNum +
      "&code=" +
      code);

    const jsonData = await data.json();
    setSats(jsonData);
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

      <section className={statstyles.input}>
        <article>
          <h1>SCOUT MATCH #</h1>
          <input type={"number"}
            onChange={(e) => {
              if (parseInt(e.target.value) > 0) {
                setScoutMatchNum(parseInt(e.target.value));
                getCurrentStats(parseInt(e.target.value),
                    parseInt(e.target.value), code);
              } else if (e.target.value === "") {
                setScoutMatchNum(parseInt(e.target.value));
              }
            }}
            value={scoutMatchNum}
          />
        </article>

        <article>
          <h1>EVENT CODE</h1>
          <input type={"text"}
            onChange={(e) => {
              setCode(e.target.value);
              getCurrentStats(scoutMatchNum, scoutMatchNum,
                  e.target.value);
            }}
            value={code}
          />
        </article>
      </section>

      <section className={statstyles.stats}>
        <h1>STATS:</h1>
        { stats["stats"].map((element: statsType) => {
          return (
            <p key={Object.keys(element)[0]}>
              {Object.keys(element)[0]}:
              {Object.values(element)[0]}
            </p>
          );
        })
        }
      </section>

      <section className={statstyles.stations}>
        {
          stats["currScouting"] !== undefined &&
          stats["currScouting"].map((element: currScoutingType) => {
            return (
              <article key={element.stationId}>
                <svg className={statstyles.laptop} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H1c-.55 0-1 .45-1 1s.45 1 1 1h22c.55 0 1-.45 1-1s-.45-1-1-1h-3zM5 6h14c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1z"/>
                </svg>
                <p className={element.submitted ?
                  statstyles.submitted:
                  statstyles.notsubmitted}>
                  {element.stationId}
                </p>
                {element.scouting ?
                  <svg className={statstyles.status} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4bd37b"/><path fill="#fff" d="M46 14L25 35.6l-7-7.2l-7 7.2L25 50l28-28.8z"/></svg> :
                  <svg className={statstyles.status} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 20"><path fill="red" d="M10 1c-5 0-9 4-9 9s4 9 9 9s9-4 9-9s-4-9-9-9zm0 16c-3.9 0-7-3.1-7-7s3.1-7 7-7s7 3.1 7 7s-3.1 7-7 7zM6 9v2h8V9H6z" className="st0"/></svg>
                }
              </article>
            );
          })
        }
      </section>

      <AdminNav />
    </div>
  );
};

export default Stats;

