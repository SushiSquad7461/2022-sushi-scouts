import {NextPage} from "next";
import {ChangeEvent, useEffect, useState} from "react";
import {scoutingConfig} from "../data/scouting-config";
import {ScoutingData, ScoutingInput} from "../pages/eventscouting";
import ButtonInput from "./buttoninput";

type PropsData = {
    index: number,
    updateMatchData:(
        event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
        name: string) => void,
    updateDataFromButton: (count: number, name: string) => void,
    currMatchData: ScoutingData,
    class: string,
    matchNum: number,
    setMatchNum: any,
};

const ScoutingPage: NextPage<PropsData> = (props: PropsData) => {
  const [climbOn, setClimbOn] = useState(false);
  const [matchType, setMatchType] = useState<string>("");
  const [teamNum, setTeamNum] = useState<string>("");

  useEffect(() => {
    const matchNumber = localStorage.getItem("MN");
    const matchType = localStorage.getItem("MT");

    if (matchType !== null) {
      setMatchType(matchType);
    }

    if (matchNumber !== null) {
      props.setMatchNum(parseInt(matchNumber));
    } else {
      props.setMatchNum(1);
    }
  }, []);

  /**
   * Get team scouting assigment
   * @param {number} currMatchNum current match number
   * @param {string} currMatchType current match type
   */
  async function getTeamNumber(currMatchNum: number, currMatchType: String) {
    if (!isNaN(currMatchNum)) {
      const data = await fetch(
          "/api/getteamnum?matchNum=" +
              currMatchNum +
              "&matchType=" +
              currMatchType,
      );
      setTeamNum(await data.text());
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
                      props.setMatchNum(parseInt(e.target.value));
                      getTeamNumber(parseInt(e.target.value), matchType);
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

                              localStorage.setItem("MN", "0");
                              props.setMatchNum(1);

                              getTeamNumber(1, checkbox);
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
          }
        })
      }
    </div>
  );
};

export default ScoutingPage;
