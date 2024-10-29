import type { AppProps } from 'next/app';
import Head from 'next/head';
import Events from '../components/Events';
import Navbar from '../components/Navbar';
import Personalize from '../components/Personalize';
import './index.css';

export default function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to engage-next!</title>
      </Head>
      <main className='app'>
        <Events />
        <Personalize />
        <Navbar />
        <Component {...pageProps} />
      </main>
    </>
  );
}
