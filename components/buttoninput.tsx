import {NextPage} from "next/types";
import {useEffect, useState} from "react";

type PropsData = {
  default: number | string, // default value
  extraClass: string, // any extra CSS class's that need to be added
  name: string, // Name of button input
  update: (count: number, name: string) => void // Update state
};

const ButtonInput: NextPage<PropsData> = (props: PropsData) => {
  const [counter, setCounter] = useState<number>(+props.default);

  useEffect(() => {
    props.update(counter, props.name);
  }, [counter, props]);

  return (
    <div className={"button-input " + props.extraClass}>
      <h1>{props.name}</h1>

      <section>
        <div className={"arrow-left"} onClick={() => counter > 0 &&
          setCounter(counter-1)} />
        <input name={props.name}
          type={"number"}
          value={counter}
          onChange={(e) => !e.target.value.includes("-") &&
            setCounter(parseInt(e.target.value))}
        />
        <div className={"arrow-right"} onClick={() => setCounter(counter+1)}/>
      </section>
    </div>
  );
};

export default ButtonInput;
