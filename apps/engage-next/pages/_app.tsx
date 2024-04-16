// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import './index.css';
import { AppProps } from 'next/app';
import Events from '../components/Events';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Personalize from '../components/Personalize';

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
