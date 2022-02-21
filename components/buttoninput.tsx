import {useEffect, useState} from "react";

type PropsData = {
  default: number | string, // default value
  extraClass: string, // any extra CSS class's that need to be added
  name: string, // Name of button input
  update: (count: number, name: string) => void // Update state
};

/**
 * Defines button input comment
 * @param {PropsData} props comments in type definition
 * @return {NextPage} The next page
 */
export default function ButtonInput(props: PropsData) {
  const [counter, setCounter] = useState<number>(+props.default);

  useEffect(() => {
    props.update(counter, props.name);
  }, [counter, props]);

  return (
    <div className={"button-input " + props.extraClass}>
      <h1>{props.name}</h1>

      <section>
        <div className={"arrow-left"} onClick={() => setCounter(counter-1)} />
        <input name={props.name}
          type={"number"}
          value={counter}
          onChange={(e) => setCounter(parseInt(e.target.value))}
        />
        <div className={"arrow-right"} onClick={() => setCounter(counter+1)}/>
      </section>
    </div>
  );
}
