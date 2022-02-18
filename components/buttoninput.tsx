import { useEffect, useState } from "react";

export default function ButtonInput(props: { default: number | string, extraClass: string, name:  string, update: (count: number, name: string) => void }) {
  const [counter, setCounter] = useState<number>(+props.default);

  useEffect(() => {
    props.update(counter, props.name);
  }, [counter, props]);

  return (
    <div className={"button-input " + props.extraClass}>
      <h1>{props.name}</h1>

      <section>
          <div className={"arrow-left"} onClick={() => setCounter(counter-1)} />
          <input name={props.name} type={"number"} value={counter} onChange={e => setCounter(parseInt(e.target.value))}/>
          <div className={"arrow-right"} onClick={() => setCounter(counter+1)}/>
      </section>
    </div>
  );
}
