import type {NextPage} from "next";
import Image from "next/image";
import Link from "next/link";
import ColorBar from "../components/colorbar";
import styles from "../styles/Data.module.css";
import {useExcelDownloder} from "react-xls";
import {useEffect, useState} from "react";

const Data: NextPage = () => {
  const {ExcelDownloder, Type} = useExcelDownloder();
  const [data, setData] = useState<any>();

  /**
   * Export match data
   */
  async function exportData() {
    const data = await fetch("/api/getscoutingdata");
    const jsonData = await data.json();
    setData(jsonData);
  }

  useEffect(() => {
    exportData();
  }, []);

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
        <p className={styles.text}>
          To export the match data please click button labeled export
          bellow. This button will export the matchdata in a csv file
        </p>
      </section>

      <button className={styles.export} onClick={exportData}>
        <ExcelDownloder
          data={data}
          filename={"matchdata"}
          type={Type.Button} // or type={'button'}
        >
        Export
        </ExcelDownloder>
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
