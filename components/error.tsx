import {NextPage} from "next";

type PropsData = {
    error: string,
    setError: any,
};

const Error: NextPage<PropsData> = (props: PropsData) => {
  return (
    <article className="err">
      <h1>Error:</h1>
      <p>{props.error}</p>

      <svg onClick={() => props.setError("")} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><rect x="0" y="0" width="24" height="24" fill="none" stroke="none" /><g fill="none" stroke="currentColor"><path d="M15 15L9 9m6 0l-6 6"/><circle cx="12" cy="12" r="10"/></g></svg>
    </article>
  );
};

export default Error;
