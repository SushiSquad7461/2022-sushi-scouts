import '../styles/globals.css'
import "../styles/ButtonInput.css";
import "../styles/Colorbar.css"
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>Sushi Scouts</title>
        <meta name="description" content="Sushi Scouts" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" color="white" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" color="white" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" color="white" />
        <link rel="manifest" href="/site.webmanifest" />
        <html lang="en" />
      </Head>

      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
