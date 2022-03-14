import type {NextPage} from "next";
import Link from "next/link";
import ColorBar from "../components/colorbar";
import SushiLandscape from "../components/sushilandscape";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.title}>
      <SushiLandscape />

      <p className={styles.text1}>SUSHI SCOUTS</p>

      <div className={styles.homecolorbar} >
        <ColorBar />
      </div>

      <button className={styles.button1}>
        <Link href = "/scoutinfo" passHref>
          <p className={styles.text2}>Start Scouting</p>
        </Link>
      </button>

      <button className={styles.button2}>
        <Link href = "/admin" passHref>
          <p className={styles.text3}>Admin</p>
        </Link>
      </button>
    </div>
  );
};

export default Home;
