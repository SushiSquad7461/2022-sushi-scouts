import type {NextPage} from "next";
import Image from "next/image";
import AdminNav from "../../components/adminnav";
import ColorBar from "../../components/colorbar";
import styles from "../../styles/Admin.module.css";

const Analysis: NextPage = () => {
  return (
    <div className={styles.title}>
      <article>
        <ColorBar />
        <h1>ADMIN</h1>
      </article>

      <section className={styles.image}>
        <Image src="/mask.svg" alt="Mask logo" width="300vw" height="300vh"/>
      </section>

      <AdminNav />
    </div>
  );
};

export default Analysis;

