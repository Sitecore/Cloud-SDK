'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useCart } from '../context/Cart';
import AddToCartButton from './AddToCartButton';
import PriceTag from './PriceTag';
import { ProductItem } from './search/Product';

type ProductsProps = {
  products?: ProductItem[];
};

export function Products({ products }: ProductsProps) {
  const cart = useCart();

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 my-8 sm:my-12'>
      {products?.map((product) => (
        <div
          key={product.id}
          className='group relative p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:border-red-300 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2 flex flex-col min-h-[400px]'>
          <div className='w-full mb-4'>
            <div className='aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-50'>
              <Image
                src={product.image_url}
                alt={product.name}
                className='w-full h-40 sm:h-48 object-contain transform transition-transform duration-300 group-hover:scale-105'
                height={200}
                width={200}
                priority={true}
              />
            </div>
          </div>
          <div className='flex-1 flex flex-col'>
            <div>
              <span className='text-sm font-medium text-red-600'>{product.brand}</span>
              <Link href={`/product/${product.id}`}>
                <h2 className='text-base sm:text-lg font-semibold text-gray-900 mt-1 line-clamp-2'>{product.name}</h2>
              </Link>
            </div>
            <div className='mt-auto'>
              <PriceTag price={product.price} />
              <AddToCartButton onClick={() => cart.addProductItem(product, 1)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default React.memo(Products);
