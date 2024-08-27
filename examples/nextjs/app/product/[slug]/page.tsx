'use client';

import { useCart } from '../../../contexts/cart';
import products from '../../../products.json';
import Image from 'next/image';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((product) => product.slug === params.slug);
  const { addProductItem } = useCart();

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <section className='container py-16'>
      <div className='flex flex-col md:flex-row gap-x-12 items-start'>
        <div className='w-full md:w-[40%]'>
          <Image
            height={500}
            width={500}
            src={product?.imageUrl || ''}
            alt='Product Image'
            className='rounded-lg shadow-md border border-slate-200 p-6'
          />
        </div>
        <div className='w-full md:w-[60%]'>
          <h1 className='text-2xl font-bold mb-2'>{product?.title}</h1>
          <p className='text-gray-700 mb-4'>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus, assumenda, voluptas ullam architecto
            dicta minima temporibus consectetur voluptate ut dolorem, earum cum praesentium. Distinctio sed saepe
            incidunt dolores! Itaque, nostrum?
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate possimus in consequuntur illum eum,
            earum voluptates ad corrupti. Dolores totam minus explicabo doloremque aliquid excepturi adipisci illum
            consequatur, cumque quasi!
          </p>
          <br />
          <div className='text-xl font-semibold mb-4'>$99.99</div>
          <button
            onClick={() => addProductItem(product, 1)}
            className='text-blue-600 hover:bg-slate-100 px-4 py-2 mt-3 rounded-lg border'>
            Add to cart &nbsp;→
          </button>
        </div>
      </div>
    </section>
  );
}
