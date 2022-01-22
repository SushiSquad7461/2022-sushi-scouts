import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ColorBar from '../components/colorbar'
import styles from '../styles/ScoutInfo.module.css'

const ScoutInfo: NextPage = () => {
    const [clicked, setClicked] = useState(0);
    const [teamNum, setTeamNum] = useState<string | undefined>(undefined);
    const comps = ["GC", "SD", "PDC"]

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
            <input type="number" placeholder="YOUR TEAM NUMBER" value={teamNum} onChange={e => setTeamNum(e.currentTarget.value)}/>

            <section>
                <article>
                    <input type="checkbox" id="1" name="comp" value="GP" checked={clicked == 0} onChange={() => setClicked(0)}/>
                    <label>GLACIER PEAK</label>
                </article>

                <article>
                    <input type="checkbox" id="1" name="comp" value="SD" checked={clicked == 1} onChange={() => setClicked(1)}/>
                    <label>SUNDOME</label>
                </article>

                <article>
                    <input type="checkbox" id="1" name="comp" value="PDC" checked={clicked == 2} onChange={() => setClicked(2)}/>
                    <label>PNW DISTRICT CHAMPIONSHIP</label>
                </article>
            </section>

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