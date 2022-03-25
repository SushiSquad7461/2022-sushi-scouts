import "../styles/globals.css";
import "../styles/ButtonInput.css";
import "../styles/Colorbar.css";
import "../styles/Error.css";
import "../styles/mode.css";
import "../styles/Sparkie.css";
import type {AppProps} from "next/app";
import Head from "next/head";
import {NextPage} from "next";
import {useEffect, useState} from "react";

const MyApp: NextPage<AppProps> = ({Component, pageProps}: AppProps) => {
  const [mode, setMode] = useState<string | null>(null);

  useEffect(() => {
    setMode(localStorage.getItem("MODE"));
  }, []);

  return (
    <div className={mode === null || mode.toString() === "light" ?
      "light" : "dark"}>
      <Head>
        <title>Sushi Scouts</title>
        <meta name="description" content="Sushi Scouts" />
        <meta name="theme-color" content="#ffffff"/>
        <link rel="apple-touch-icon" sizes="180x180"
          href="/apple-touch-icon.png" color="white"
        />
        <link rel="icon" type="image/png" sizes="32x32"
          href="/favicon-32x32.png" color="white"
        />
        <link rel="icon" type="image/png" sizes="16x16"
          href="/favicon-16x16.png" color="white"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;
