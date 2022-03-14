import {NextPage} from "next";
import {ChangeEvent, useEffect, useState} from "react";
import {scoutingConfig} from "../data/scouting-config";
import {ScoutingData, ScoutingInput} from "../pages/eventscouting";
import ButtonInput from "./buttoninput";

type PropsData = {
    index: number,
    updateMatchData:(
        event: ChangeEvent<HTMLInputElement> |
          ChangeEvent<HTMLTextAreaElement> |
          ChangeEvent<HTMLSelectElement>,
        name: string) => void,
    updateDataFromButton: (count: number, name: string) => void,
    currMatchData: ScoutingData,
    class: string,
    matchNum: number,
    setMatchNum: any,
    updateMatchDataFromVal: (newVal: string, name: string) => void
};

const ScoutingPage: NextPage<PropsData> = (props: PropsData) => {
  const [climbOn, setClimbOn] = useState(false);
  const [matchType, setMatchType] = useState<string>("no option selected");
  const [teamNum, setTeamNum] = useState<string>("");
  const [stationId, setStationId] = useState<string>("");

  useEffect(() => {
    const stationData = localStorage.getItem("STATION");
    setStationId(stationData !== null ? stationData.toString() : "R1");
  }, []);

  /**
   * Get team scouting assigment
   * @param {number} currMatchNum current match number
   * @param {string} currMatchType current match type
   * @param {string} stationId station id (r1, r2, etc)
   */
  async function getTeamNumber(currMatchNum: number, currMatchType: string,
      stationId: string) {
    console.log("in1" + currMatchNum + currMatchType);
    if (!isNaN(currMatchNum) && currMatchType !== "no option selected") {
      console.log("in2");
      const data = await fetch(
          "/api/getteamnum?matchNum=" +
              currMatchNum +
              "&matchType=" +
              currMatchType +
              "&station=" +
              stationId,
      );
      const jsonData = await data.json();
      setTeamNum(jsonData.num);
      props.updateMatchDataFromVal(jsonData.num,
          "team # you're scouting");
    }
  }

  return (
    <div className={props.class}>
      {
        scoutingConfig[props.index].inputs.map((element: ScoutingInput) => {
          if (element.type === "number") {
            return (
              <article key={element.name} className={element.className}>
                <h1>{element.name}</h1>
                <input type={element.type}
                  name={element.name}
                  onChange={(e) => {
                    props.updateMatchData(e, element.name);

                    if (element.name === "MATCH #") {
                      localStorage.setItem("MN", e.target.value);
                      console.log("changing match num");
                      props.setMatchNum(parseInt(e.target.value));
                      getTeamNumber(parseInt(e.target.value), matchType,
                          stationId);
                    } else if (element.name === "TEAM # YOU'RE SCOUTING") {
                      setTeamNum((e.target.value));
                    }
                  }}
                  value={element.name === "MATCH #" ? props.matchNum :
                  (element.name === "TEAM # YOU'RE SCOUTING" ?
                  teamNum : undefined)}
                />
              </article>
            );
          } else if (element.type === "radio" &&
                       element.values.length !== 0 &&
                       (climbOn || element.name !== "CLIMB TYPE")) {
            return (
              <section key={element.name} className={element.className}>
                {
                  element.values.map((checkbox: string) => {
                    return (
                      <section key={checkbox}>
                        <input type="radio" name={element.name}
                          value={checkbox.toLowerCase()} onChange={(e) => {
                            props.updateMatchData(e, element.name);

                            if (checkbox === "ATTEMPTED CLIMB" ||
                                  checkbox === "FAILED CLIMB") {
                              setClimbOn(true);
                            } else if (checkbox === "NO CLIMB") {
                              setClimbOn(false);
                            } else if (element.name === "MATCH TYPE") {
                              localStorage.setItem("MT", checkbox);
                              setMatchType(checkbox);

                              console.log("setting match num to 1 bad");
                              localStorage.setItem("MN", "1");
                              props.setMatchNum(1);

                              getTeamNumber(1, checkbox, stationId);
                            }
                          }} defaultChecked={element.name === "MATCH TYPE" ?
                            undefined : (
                              props.currMatchData[scoutingConfig[props.index].
                                  name.toLowerCase() + ":" +
                              element.name.toLowerCase()]) ===
                              checkbox.toLowerCase()}
                          checked={element.name === "MATCH TYPE" ?
                            (matchType === checkbox) : undefined}/>
                        <label>{ checkbox }</label>
                      </section>
                    );
                  })
                }
              </section>
            );
          } else if (element.type === "checkbox") {
            return (
              <section className={element.className} key={element.name}>
                <input type={element.type}
                  name={element.name}
                  defaultChecked={(props.currMatchData[scoutingConfig[
                      props.index].name.toLowerCase() +
                      ":" + element.name.toLowerCase()]) ===
                        "on"
                  }
                  onChange={(e) => props.updateMatchData(e, element.name)}
                />
                <label>{ element.name } </label>
              </section>
            );
          } else if (element.type === "button") {
            return (
              <ButtonInput default={props.currMatchData[scoutingConfig[props.
                  index].name.toLowerCase() + ":" +
                  element.name.toLowerCase()]
              }
              name={element.name}
              key={element.name + scoutingConfig[props.index].name}
              extraClass={element.className}
              update={props.updateDataFromButton}
              />
            );
          } else if (element.type === "textarea") {
            return (
              <textarea
                defaultValue={(props.currMatchData[scoutingConfig[props.
                    index].name.toLowerCase() +
                    ":" + element.name.toLowerCase()])
                }
                key={element.name}
                className={element.className}
                name={element.name}
                onChange={(e) => props.updateMatchData(e, element.name)}
                placeholder={element.name}
                autoComplete="off"
                rows={4}
                cols={50}
              />
            );
          } else if (element.type === "select") {
            return (
              <article key={element.name} className={element.className}>
                <h1>{element.name}</h1>
                <select name={element.name}
                  onChange={(e) => {
                    props.updateMatchData(e, element.name);

                    if (element.name === "STATION ID") {
                      localStorage.setItem("STATION", e.target.value);
                      console.log("Get team num from station id");
                      getTeamNumber(props.matchNum, matchType,
                          e.target.value);
                      setStationId(e.target.value);
                    }
                  }}
                  value={stationId}
                >
                  {
                    element.values.map((checkbox: string) => {
                      return (
                        <option value={checkbox} key={checkbox}>
                          {checkbox}
                        </option>
                      );
                    })
                  }
                </select>
              </article>
            );
          }
        })
      }
    </div>
  );
};

export default ScoutingPage;
