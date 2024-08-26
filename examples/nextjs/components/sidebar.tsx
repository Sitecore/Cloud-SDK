'use client';

import { useCart } from '../contexts/cart';

export function Sidebar() {
  const { isSidebarOpen, productItems, closeSidebar, removeProductItem, calculateDiscountPrice, calculateTotalCost } =
    useCart();
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
              <img
                src={product.imageUrl}
                alt={product.title}
                className='w-20 h-20 object-cover rounded-lg'
              />
              <div>
                <h3 className='text-lg font-semibold'>{product.title}</h3>
                <p className='text-sm text-gray-400'>Lorem ipsum...</p>
                <p className={`text-lg font-semibold ${product.discount && 'line-through'}`}>
                  ${product.price.toFixed(2)}
                </p>
                {product.discount && (
                  <p className='text-lg font-semibold'>
                    ${calculateDiscountPrice(product.price, product.discount).toFixed(2)}
                  </p>
                )}
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
        <br />
        <h1 className='text-lg'>Total: ${calculateTotalCost().toFixed(2)}</h1>

        <button
          className='bg-red-500 text-white px-4 py-2 mt-4 w-full rounded-lg'
          onClick={() => closeSidebar()}>
          Checkout
        </button>
      </div>
    </aside>
  );
}
