import type {NextPage} from "next";
import Image from "next/image";
import Link from "next/link";
import ColorBar from "../components/colorbar";
import styles from "../styles/Data.module.css";
import {useExcelDownloder} from "react-xls";
import {useState} from "react";

const Data: NextPage = () => {
  const {ExcelDownloder} = useExcelDownloder();
  const [data, setData] = useState<any>(undefined);

  /**
   * Export match data
   */
  async function exportData() {
    const data = await fetch("/api/getscoutingdata");
    const jsonData = await data.json();
    console.log(jsonData);
    setData(jsonData);
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

      <section className={styles.note}>
        <p className={styles.text}>
          To export the match data please click button labeled export
          bellow. This button will export the matchdata in a csv file
        </p>
      </section>

      <button className={styles.export} onClick={exportData}>
        { data === undefined ? <p>Get Data</p> : <ExcelDownloder
          data={data}
          filename={"matchdata"}
        >
        Export
        </ExcelDownloder>}
      </button>

      <button className={styles.button}>
        <Link href = "/" passHref>
          <p className={styles.text}>Return</p>
        </Link>
      </button>
    </div>
  );
};

export default Data;
