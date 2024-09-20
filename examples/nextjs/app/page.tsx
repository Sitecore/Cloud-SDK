'use client';

import { PersonalizeBanner } from '../components/PersonalizeBanner';
import { Newsletter } from '../components/Newsletter';
import { MemoizedProducts } from '../components/Products';
import products from '../products.json';
import { useEffect } from 'react';
import { pageView } from '@sitecore-cloudsdk/events/browser';
import { withAuthGuard } from '../components/AuthGuard';

function Index() {
  useEffect(() => {
    const doEvent = async () => {
      await pageView();
    };
    doEvent();
  }, []);
  return (
    <div
      style={{ '--sc-bg': `url(https://www.sitecore.com/static/sc_power-gradient-desktop.svg)` } as React.CSSProperties}
      className='bg-[image:var(--sc-bg)] p-4 flex items-center justify-center flex-col'>
      <div className='container mx-auto'>
        <PersonalizeBanner />
        <MemoizedProducts products={products} />
        <Newsletter />
      </div>
    </div>
  );
}

export default withAuthGuard(Index);
