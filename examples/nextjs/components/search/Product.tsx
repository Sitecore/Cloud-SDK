import React from 'react';
import { widgetItemClick } from '@sitecore-cloudsdk/search/browser';
import { useCart } from '../../context/Cart';

export function Product({ item, index }: { item: ProductItem; index: number }) {
  const cart = useCart();

  return (
    <div
      key={item.id}
      className='product-item bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex p-4 gap-2'
      onClick={() => {
        widgetItemClick({
          request: {},
          pathname: '/search',
          widgetId: 'rfkid_7',
          entity: { entity: 'product', id: item.id },
          itemPosition: index + 1
        });
      }}>
      <div className='flex-shrink-0 grid items-center'>
        <img
          src={item.image_url}
          alt={item.name}
          width={80}
          height={80}
          className='rounded-lg object-cover'
        />
      </div>
      <div className='flex-1 flex flex-col'>
        <h2 className='text-lg font-semibold text-gray-900'>{item.name}</h2>
        <p className='text-lg font-medium text-red-600 mt-2'>€ {item.price}</p>
      </div>
      <div className='grid items-center'>
        <button
          onClick={() => {
            cart.addProductItem(
              {
                id: item.id,
                title: item.name,
                price: parseFloat(item.price) || 0,
                imageUrl: item.image_url,
                slug: item.name.replaceAll(' ', '-').toLowerCase()
              },
              1
            );
          }}
          className='bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export interface ProductItem {
  brand: string;
  id: string;
  image_url: string;
  name: string;
  price: string;
  product_group: string;
  review_count: string;
  review_rating: number;
  sku: string;
  source_id: string;
}
