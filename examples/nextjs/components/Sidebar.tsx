'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/Cart';

export function Sidebar() {
  const { isSidebarOpen, productItems, closeSidebar, removeProductItem, calculateTotalCost } = useCart();
  return (
    <aside
      style={{ width: isSidebarOpen ? '400px' : '0' }}
      className='fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50'>
      <div className='p-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>Cart</h2>
          <button
            onClick={() => closeSidebar()}
            className='hover:scale-105 cursor-pointer text-red-500'>
            ✖
          </button>
        </div>
        {productItems.map((product) => (
          <div
            key={product.id}
            className='flex justify-between items-center mt-4'>
            <div className='flex gap-x-4'>
              <Image
                src={product.image_url}
                width={100}
                height={100}
                alt={product.name}
              />
              <div>
                <h3 className='text-lg font-semibold'>{product.name}</h3>
                <div>Qty:{product.quantity}</div>
                <div>Unit Price: €{product.price}</div>
              </div>
            </div>
            <div>
              <button
                onClick={() => removeProductItem(product.id)}
                className='hover:scale-105 cursor-pointer text-red-500'>
                🗑️
              </button>
            </div>
          </div>
        ))}

        {productItems.length === 0 ? (
          <div className='text-center mt-4'>
            <h1 className='text-lg pt-24'>No items in cart</h1>
          </div>
        ) : (
          <>
            <br />
            <h1 className='text-lg'>Total: €{calculateTotalCost()}</h1>
            <br />
            <Link
              href='/checkout'
              onClick={() => closeSidebar()}>
              <div className='bg-red-500 justify-center flex gap-x-3 text-white px-4 py-2 mt-4 w-full rounded-lg'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='25'
                  height='25'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='#ffffff'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'>
                  <path
                    stroke='none'
                    d='M0 0h24v24H0z'
                    fill='none'
                  />
                  <path d='M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0' />
                  <path d='M12.5 17h-6.5v-14h-2' />
                  <path d='M6 5l14 1l-1 7h-13' />
                  <path d='M16 22l5 -5' />
                  <path d='M21 21.5v-4.5h-4.5' />
                </svg>
                Checkout
              </div>
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}
