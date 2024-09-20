'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/Cart';
import React from 'react';

export type Product = {
  id: string;
  title: string;
  price: number;
  discount?: number;
  imageUrl: string;
  slug: string;
};

/**
 * A component that renders a list of products in a grid.
 * @param props An object with a `products` property that is an array of products.
 * @returns A grid of products.
 */
export function Products({ products }: { products: Product[] }) {
  const cart = useCart();

  return (
    <div className='grid grid-cols-4 gap-8 my-16'>
      {products.map((product) => (
        <div
          key={product.id}
          className='p-6 bg-white flex flex-col justify-between transition-colors duration-500 rounded-tl-3xl rounded-br-3xl'>
          <Link href={`/product/${product.slug}`}>
            <Image
              src={product.imageUrl}
              alt={product.title}
              className='w-full h-48 object-contain bg-white rounded-xl'
              height={200}
              width={200}
            />
            <h1 className='text-lg font-semibold mt-2'>{product.title}</h1>
          </Link>
          <h4 className={`${product.discount && 'line-through'}`}>€{product.price}</h4>
          {product.discount && <h4>{cart.calculateDiscountPrice(product.price, product.discount).toFixed(2)}</h4>}
          <button
            onClick={() => cart.addProductItem(product, 1)}
            className='text-blue-600 hover:bg-slate-100 px-4 py-2 mt-3 float-end rounded-lg'>
            Add to cart
          </button>
        </div>
      ))}
    </div>
  );
}

export const MemoizedProducts = React.memo(Products);
