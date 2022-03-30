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
        <Link href = "/admin/data" passHref>
          <p className={styles.text3}>Admin</p>
        </Link>
      </button>

      <svg onClick={() => {
        localStorage.getItem("MODE") === null ||
        localStorage.getItem("MODE") === "light" ?
        localStorage.setItem("MODE", "dark") :
        localStorage.setItem("MODE", "light"); location.reload();
      } }
      className={styles.toggle} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="none" stroke="none" /><path fill="currentColor" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>
    </div>
  );
};

export default Home;
