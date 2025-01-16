import React from 'react';
import { Product, type ProductItem } from './Product';

export function Preview({ items }: { items: ProductItem[] }) {
  if (!items.length) return null;

  return (
    <div className='absolute p-4 bg-white border border-gray-200 mt-1 rounded-md shadow-lg text-sm top-14 left-1/2 -translate-x-1/2 w-[80rem]  z-10'>
      <div>
        <h3 className='text-xl mb-4'> Products</h3>
        <div className='grid grid-cols-2 gap-4'>
          {items.map((item: ProductItem, index: number) => (
            <Product
              item={item}
              index={index}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
