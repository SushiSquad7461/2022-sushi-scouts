import type {NextPage} from "next";
import Image from "next/image";
import {useEffect, useState} from "react";
import AdminNav from "../../components/adminnav";
import ColorBar from "../../components/colorbar";
import styles from "../../styles/Admin.module.css";
import analysisstyles from "../../styles/AdminAnalyze.module.css";
import Error from "../../components/error";

const Analysis: NextPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<Array<string>>([]);
  const [averageAccuracy, setAverageAccuracy] = useState("");

  /**
   * Get data analysis from api
   */
  async function analyzeData() {
    const params = JSON.stringify({username: username,
      password: password,
      year: new Date().getFullYear(),
      code: code});

    const res = await fetch("/api/analyzedata", {
      body: params,
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!res.ok) {
      setError([(await res.json()).response]);
    } else {
      const data: Array<Array<string>> = Object.entries(await res.json());
      console.log(data);
      let sum = 0;

      for (const i of data) {
        if (i[1] !== "NaN") sum += parseFloat(i[1]);
      }

      console.log(sum);

      setAverageAccuracy((sum / data.length * 100).toString() + "%");
    }
  }

  useEffect(() => {
    setCode(localStorage.getItem("C") === null ? "" :
      localStorage.getItem("C")!);
  }, []);

  return (
    <div className={styles.title}>
      <article>
        <ColorBar />
        <h1>ADMIN</h1>
      </article>

      {error.length > 0 && <Error error={error} setError={setError}/>}

      <section className={styles.image}>
        <Image src="/mask.svg" alt="Mask logo" width="300vw" height="300vh"/>
      </section>

      <section className={analysisstyles.input}>
        <article>
          <h1>USERNAME</h1>
          <input type={"text"}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </article>

        <article>
          <h1>PASSWORD</h1>
          <input type={"text"}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </article>

        <article className={analysisstyles.code}>
          <h1>EVENT CODE</h1>
          <input type={"text"}
            onChange={(e) => {
              setCode(e.target.value);
            }}
            value={code}
          />
        </article>
      </section>

      <button className={analysisstyles.button} onClick={analyzeData}>
        <p>Analyze Data</p>
      </button>

      <h1 className={analysisstyles.text}>
        AVERAGE ACCURACY: {averageAccuracy}
      </h1>

      <AdminNav />
    </div>
  );
};

export default Analysis;
