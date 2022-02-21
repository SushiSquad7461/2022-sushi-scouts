import type {NextPage} from "next";
import Image from "next/image";
import Link from "next/link";
import ColorBar from "../components/colorbar";
import styles from "../styles/ScoutInfo.module.css";

const Data: NextPage = () => {
  return (
    <div className={styles.title}>
      <article>
        <ColorBar />
        <h1>DATA</h1>
      </article>

      <section className={styles.image}>
        <Image src="/mask.svg" alt="Mask logo" width="400vw" height="400vh"/>
      </section>

      <section className={styles.note}>
        <p className={styles.text3}>
            Unfortunately we do not have data viewing from the web yet.
            Hopefully we will have this feature in the near future to
            use in matches (or even sooner if you give Alex a cookie)
        </p>
      </section>

      <button className={styles.button2}>
        <Link href = "/" passHref>
          <p className={styles.text3}>Return</p>
        </Link>
      </button>
    </div>
  );
};

export default Data;
