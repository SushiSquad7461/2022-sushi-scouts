import type {NextPage} from "next";
import Image from "next/image";
import {useState} from "react";
import AdminNav from "../../components/adminnav";
import ColorBar from "../../components/colorbar";
import Error from "../../components/error";
import styles from "../../styles/Admin.module.css";
import schedulestyles from "../../styles/AdminSchedule.module.css";

const Data: NextPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [events, setEvents] = useState<Array<{name: string,
    code: string, show: boolean}>>([]);
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<Array<string>>([]);

  /**
   * Get all of the first events
   */
  async function getEventData() {
    const params = JSON.stringify({username: username,
      password: password,
      year: new Date().getFullYear()});

    const res = await fetch("/api/eventproxy", {
      body: params,
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (res.ok) {
      const newlist = await res.json();

      for (const i of newlist) {
        i.show = true;
      }

      setEvents(newlist);
      console.log(newlist);
    } else {
      setError(["Invalid Credentials Dumbass"]);
    }
  }

  /**
   * Creates new schedule based on event code
   */
  async function newSchedule() {
    const params = JSON.stringify({username: username,
      password: password,
      year: new Date().getFullYear(),
      code: code});

    const res = await fetch("/api/newschedule", {
      body: params,
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!res.ok) {
      setError([(await res.json()).response]);
    }
  }

  return (
    <div className={styles.title}>
      {error.length > 0 && <Error error={error} setError={setError}/>}

      <article>
        <ColorBar />
        <h1>ADMIN</h1>
      </article>

      <section className={styles.image}>
        <Image src="/mask.svg" alt="Mask logo" width="300vw" height="300vh"/>
      </section>

      <section className={schedulestyles.input}>
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

        <article className={schedulestyles.code}>
          <h1>EVENT CODE</h1>
          <input type={"text"}
            onChange={(e) => {
              setCode(e.target.value);
            }}
            value={code}
          />
        </article>
      </section>

      <section className={schedulestyles.events}>
        <h1>Events</h1>

        <section>
          <article>
            <h1>SEARCH</h1>
            <input type={"text"}
              onChange={(e) => {
                setSearch(e.target.value);

                for (const i of events) {
                  if (!i.name.toLowerCase().includes(
                      e.target.value.toLowerCase()) &&
                  !i.code.toLowerCase().includes(
                      e.target.value.toLowerCase())) {
                    i.show = false;
                  } else {
                    i.show = true;
                  }
                }

                setEvents(events);
              }}
              value={search}
            />
          </article>
        </section>

        <section className={schedulestyles.eventslist}>
          {
            events.map((event) => {
              const ret = event.show ?
              (
                <p key={event.name}>{event.name} : {event.code}</p>
              ) : (<></>);
              return ret;
            })
          }
        </section>
      </section>

      <button className={schedulestyles.button2} onClick={newSchedule}>
        <p>Save Schedule</p>
      </button>

      <button className={schedulestyles.button} onClick={getEventData}>
        <p>Save Credentials</p>
      </button>

      <AdminNav />
    </div>
  );
};

export default Data;

