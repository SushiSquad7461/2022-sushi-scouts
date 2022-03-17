import type {NextPage} from "next";
import Image from "next/image";
import Link from "next/link";
import ColorBar from "../components/colorbar";
import styles from "../styles/Admin.module.css";
import {useExcelDownloder} from "react-xls";
import {useEffect, useState} from "react";
import {currScoutingType, statsType} from "./api/getstats";

const Data: NextPage = () => {
  const {ExcelDownloder} = useExcelDownloder();
  const [data, setData] = useState<any>({"matchData": []});
  const [currMatchNum, setCurrMatchNum] = useState<number>(1);
  const [scoutMatchNum, setScoutMatchNum] = useState<number>(1);
  const [stats, setSats] = useState({"currScouting": [], "stats": []});

  /**
   * Export match data
   */
  async function exportData() {
    const serverData = await fetch("/api/getscoutingdata");
    const jsonData = await serverData.json();
    setData(jsonData);
  }

  useEffect(() => {
    getCurrentStats(currMatchNum, scoutMatchNum);
  }, [currMatchNum, scoutMatchNum]);

  /**
   * Get stats from api
   * @param {number} currNum the quals match we are getting data for`
   * @param {number } maxNum the latest quals match
   */
  async function getCurrentStats(currNum: number, maxNum: number) {
    const data = await fetch("/api/getstats?currQual=" +
      currNum +
      "&maxQual=" +
      maxNum);

    const jsonData = await data.json();
    setSats(jsonData);
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
    }
  }

  return (
    <div className={styles.title}>
      <article>
        <ColorBar />
        <h1>ADMIN</h1>
      </article>

      <section className={styles.image}>
        <Link href={"/"}>
          <Image src="/mask.svg" alt="Mask logo" width="400vw" height="400vh"/>
        </Link>
      </section>

      <section className={styles.input}>
        <article>
          <h1>CURR MATCH #</h1>
          <input type={"number"}
            onChange={(e) => {
              if (parseInt(e.target.value) > 0) {
                setCurrMatchNum(parseInt(e.target.value));
                getCurrentStats(parseInt(e.target.value), scoutMatchNum);
              } else if (e.target.value === "") {
                setCurrMatchNum(parseInt(e.target.value));
              }
            }}
            value={currMatchNum}
          />
        </article>

        <article>
          <h1>SCOUT MATCH #</h1>
          <input type={"number"}
            onChange={(e) => {
              if (parseInt(e.target.value) > 0) {
                setScoutMatchNum(parseInt(e.target.value));
                getCurrentStats(currMatchNum, parseInt(e.target.value));
              } else if (e.target.value === "") {
                setScoutMatchNum(parseInt(e.target.value));
              }
            }}
            value={scoutMatchNum}
          />
        </article>
      </section>

      <section className={styles.data}>
        <h1>DATA:</h1>

        <button onClick={uploadData}>
          Upload Local Data
        </button>

        <button onClick={exportData}>
          {data.matchData.length ? <ExcelDownloder
            data={data}
            filename={"matchdata"}
            type={"button"}
          >
              Download Data
          </ExcelDownloder> : <p>Download Data</p>}
        </button>

        <button onClick={clearLocalData}>
          Clear Local Data
        </button>
      </section>

      <section className={styles.stats}>
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

      <section className={styles.stations}>
        {
          stats["currScouting"] !== undefined &&
          stats["currScouting"].map((element: currScoutingType) => {
            return (
              <article key={element.stationId}>
                <svg className={styles.laptop} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H1c-.55 0-1 .45-1 1s.45 1 1 1h22c.55 0 1-.45 1-1s-.45-1-1-1h-3zM5 6h14c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1z"/>
                </svg>
                <p>{element.stationId}</p>
                {element.scouting ?
                  <svg className={styles.status} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4bd37b"/><path fill="#fff" d="M46 14L25 35.6l-7-7.2l-7 7.2L25 50l28-28.8z"/></svg> :
                  <svg className={styles.status} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 20"><path fill="red" d="M10 1c-5 0-9 4-9 9s4 9 9 9s9-4 9-9s-4-9-9-9zm0 16c-3.9 0-7-3.1-7-7s3.1-7 7-7s7 3.1 7 7s-3.1 7-7 7zM6 9v2h8V9H6z" className="st0"/></svg>
                }
              </article>
            );
          })
        }
      </section>

      <button className={styles.button}>
        <Link href = "/" passHref>
          <p className={styles.text}>Return</p>
        </Link>
      </button>
    </div>
  );
};

export default Data;

