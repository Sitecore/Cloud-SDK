import { PersonalizeBanner } from '../components/personalize-banner';
import { Newsletter } from '../components/newsletter';
import { MemoizedProducts } from '../components/products';
import products from '../products.json';

export default async function Index() {
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
