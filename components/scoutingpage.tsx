import {NextPage} from "next";

const ScoutingPage: NextPage = () => {
  return (
    <div>
      {
        scoutingConfig[index].inputs.map((element: ScoutingInput) => {
          if (element.type === "number") {
            return (
              <article key={element.name} className={element.className}>
                <h1>{element.name}</h1>
                <input type={element.type}
                  name={element.name}
                  onChange={(e) => {
                    updateMatchData(e, element.name);

                    if (element.name === "MATCH #") {
                      localStorage.setItem("MN", e.target.value);
                      setMatchNum(parseInt(e.target.value));
                      getTeamNumber(parseInt(e.target.value), matchType);
                    } else if (element.name === "TEAM # YOU'RE SCOUTING") {
                      setTeamNum((e.target.value));
                    }
                  }}
                  value={element.name === "MATCH #" ? matchNum :
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
                            updateMatchData(e, element.name);

                            if (checkbox === "ATTEMPTED CLIMB" ||
                                  checkbox === "FAILED CLIMB") {
                              setClimbOn(true);
                            } else if (checkbox === "NO CLIMB") {
                              setClimbOn(false);
                            } else if (element.name === "MATCH TYPE") {
                              localStorage.setItem("MT", checkbox);
                              setMatchType(checkbox);

                              localStorage.setItem("MN", "0");
                              setMatchNum(1);

                              getTeamNumber(1, checkbox);
                            }
                          }} defaultChecked={(
                            matchData[scoutingConfig[index].name.
                                toLowerCase() + ":" +
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
                  defaultChecked={(matchData[scoutingConfig[index].name.
                      toLowerCase() + ":" + element.name.toLowerCase()]) ===
                        "on"
                  }
                  onChange={(e) => updateMatchData(e, element.name)}
                />
                <label>{ element.name } </label>
              </section>
            );
          } else if (element.type === "button") {
            return (
              <ButtonInput default={matchData[scoutingConfig[index].
                  name.toLowerCase() + ":" + element.name.toLowerCase()]
              }
              name={element.name}
              key={element.name + scoutingConfig[index].name}
              extraClass={element.className}
              update={updateDataFromButton}
              />
            );
          } else if (element.type === "textarea") {
            return (
              <textarea
                defaultValue={(matchData[scoutingConfig[index].name.
                    toLowerCase() + ":" + element.name.toLowerCase()])
                }
                key={element.name}
                className={element.className}
                name={element.name}
                onChange={(e) => updateMatchData(e, element.name)}
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
