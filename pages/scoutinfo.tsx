import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SetStateAction, useEffect, useMemo, useState } from 'react'
import ColorBar from '../components/colorbar'
import styles from '../styles/ScoutInfo.module.css'

const ScoutInfo: NextPage = () => {
    const [clicked, setClicked] = useState<number>(0);
    const [teamNum, setTeamNum] = useState<string>("");
    const setTeamNumWrapper = (val: string) => {
        setTeamNum(val);
        localStorage.setItem("TM", val);
    };
    const setClickedWrapper = (val: number) => {
        setClicked(val);
        localStorage.setItem("C", comps[val]);
    }
    const comps : Array<string> = useMemo(() => { return ["GC", "SD", "PDC"]; }, []);

    useEffect(() => {
        if (localStorage.getItem("TM") !== null) {
            // Or in their because typescript is dumb and thinks localStorage can be null
            setTeamNum(localStorage.getItem("TM") || "");
        }

        if (localStorage.getItem("C") !== null) {
            for (let i: number = 0; i < comps.length; ++i) {
                if (comps[i] === localStorage.getItem("C")) {
                    setClicked(i);
                }
            }
        }
    }, [comps, teamNum]);

    return (
      <div className={styles.title}>
          <article>
            <ColorBar />
            <h1>SUSHI SCOUTS</h1>
          </article>

          <section className={styles.image}>
            <Image src="/mask.svg" alt="Mask logo" width="400vw" height="400vh"/>
          </section>

          <form onSubmit={e => e.preventDefault()}>
            <article>
                <h1>YOUR TEAM NUMBER</h1>
                <input type="number" value={teamNum} onChange={e => setTeamNumWrapper(e.currentTarget.value)}/>
            </article>

            <section>
                <article>
                    <input type="checkbox" id="1" name="comp" value="GP" checked={clicked == 0} onChange={() => setClickedWrapper(0)}/>
                    <label>GLACIER PEAK</label>
                </article>

                <article>
                    <input type="checkbox" id="1" name="comp" value="SD" checked={clicked == 1} onChange={() => setClickedWrapper(1)}/>
                    <label>SUNDOME</label>
                </article>

                <article>
                    <input type="checkbox" id="1" name="comp" value="PDC" checked={clicked == 2} onChange={() => setClickedWrapper(2)}/>
                    <label>PNW DISTRICT CHAMPIONSHIP</label>
                </article>
            </section>

        <button className={styles.button1}>
            <Link href = "/" passHref>
                <p className={styles.text3}>Return</p>
            </Link>
        </button>

            <button className={styles.button2}>
                { teamNum !== undefined ? <Link href={"/eventscouting?tm=" + teamNum + "&c=" + comps[clicked]} passHref>
                    <p className={styles.text3}>Continue</p>
                </Link> : <p className={styles.text3}>Continue</p> }
            </button>



          </form>
      </div>
    )
}

export default ScoutInfo;