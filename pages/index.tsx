import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import ColorBar from '../components/colorbar'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.title}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50vw"
        height="100vh"
        fill="none"
        viewBox="0 0 963 1080"
      >
        <mask
          id="mask0_6_43"
          style={{ maskType: "alpha" }}
          width="1482"
          height="1634"
          x="-518"
          y="-310"
          maskUnits="userSpaceOnUse"
        >
          <path
            fill="#56CBF9"
            d="M-161.023 -310H1002.647V1069.25H-161.023z"
            transform="rotate(15 -161.023 -310)"
          ></path>
        </mask>
        <g mask="url(#mask0_6_43)">
          <path
            fill="#56CBF9"
            d="M56.916 -310H1220.586V1069.25H56.916z"
            transform="rotate(15 56.916 -310)"
          ></path>
          <path
            fill="#FCD6F6"
            d="M-130.506 39.027H619.284V1313.637H-130.506z"
            transform="rotate(-52.514 -130.506 39.027)"
          ></path>
          <path
            fill="#FF729F"
            d="M196.072 1274.89H920.933V2260.518H196.072z"
            transform="rotate(-94.324 196.072 1274.89)"
          ></path>
          <path
            fill="#4F4F4F"
            d="M-278.465 1349.13H446.396V2334.7580000000003H-278.465z"
            transform="rotate(-73.057 -278.465 1349.13)"
          ></path>
          <path
            fill="#81F4E1"
            d="M-141.301 471.039H565.953V1496.299H-141.301z"
            transform="rotate(-117.915 -141.301 471.039)"
          ></path>
        </g>
      </svg>
      <p className={styles.text1}>SUSHI SCOUTS</p>
      <div className={styles.homecolorbar} >
        <ColorBar/>
      </div>
      <button className={styles.button1}>
        <Link href = "/scoutinfo" passHref>
          <p className={styles.text2}>Start Scouting</p>
        </Link>
      </button>
      <button className={styles.button2}>
        <Link href = "/data" passHref>
          <p className={styles.text3}>View Data</p>
        </Link>
      </button>
    </div>
  )
}

export default Home
