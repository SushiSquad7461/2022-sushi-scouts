import { ReactChild, ReactFragment, ReactPortal } from "react";

export default function ButtonInput(props: { name: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; }) {
    return (
        <div className="button-input">
            <h1>{props.name} </h1>

            <section>
                <div className={"arrow-left"} />
                <input type={"number"} />
                <div className={"arrow-right"} />
            </section>
        </div>
    );
}