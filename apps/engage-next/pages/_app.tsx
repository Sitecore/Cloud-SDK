// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { AppProps } from 'next/app';
import Head from 'next/head';
import { EventsProvider } from '../context/events';
import Navbar from '../components/Navbar';
import { PersonalizeProvider } from '../context/personalize';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import './index.css';

function CustomApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    if (router.pathname.startsWith('/templates/') && window.Engage?.triggerExperiences) {
      window.Engage.triggerExperiences();
    }
  }, [router.pathname]);

  return (
    <PersonalizeProvider>
      <EventsProvider>
        <Head>
          <title>Welcome to engage-next!</title>
        </Head>
        <main className='app'>
          <Navbar />
          <Component {...pageProps} />
        </main>
      </EventsProvider>
    </PersonalizeProvider>
  );
}

export default CustomApp;
