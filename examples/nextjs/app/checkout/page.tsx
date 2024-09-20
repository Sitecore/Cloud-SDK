'use client';

import { withAuthGuard } from '../../components/AuthGuard';
import { useCart } from '../../context/Cart';

function CheckoutPage() {
  const { productItems, calculateDiscountPrice, removeProductItem, calculateTotalCost } = useCart();

  if (productItems.length === 0) {
    return (
      <section className='container h-full py-44 flex flex-col items-center justify-center'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='80'
          height='80'
          className='mb-6'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='#d50000'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path
            stroke='none'
            d='M0 0h24v24H0z'
            fill='none'
          />
          <path d='M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0' />
          <path d='M15 17h-9v-14h-2' />
          <path d='M6 5l14 1l-.854 5.976m-2.646 1.024h-10.5' />
          <path d='M19 16v3' />
          <path d='M19 22v.01' />
        </svg>
        <h1 className='text-4xl font-semibold'>Oops!</h1>
        <br />
        <p className='text-lg'>You have no items in your shopping cart...</p>
      </section>
    );
  }

  return (
    <section className='container my-16'>
      <div className='flex gap-x-36'>
        <div className='w-1/3'>
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
        </div>
        <div className='w-2/3 flex flex-col gap-y-5'>
          <h1 className='text-2xl font-semibold'>Checkout</h1>
          <h1 className='text-lg'>Total: ${calculateTotalCost().toFixed(2)}</h1>

          {/* Stripe Card Element */}
          <form>
            <div className='border border-gray-300 rounded-lg p-4'>
              <div className='flex flex-col items-start mb-4'>
                <label className='mr-2'>Card Number:</label>
                <input
                  type='text'
                  placeholder='4242 4242 4242 4242'
                  className='border border-gray-300 rounded-lg p-2 w-full'
                />
              </div>
              <div className='flex flex-col items-start mb-4'>
                <label className='mr-2'>Expiration Date:</label>
                <input
                  type='text'
                  className='border border-gray-300 rounded-lg p-2 w-full'
                />
              </div>
              <div className='flex flex-col items-start mb-4'>
                <label className='mr-2'>CVV:</label>
                <input
                  type='text'
                  className='border border-gray-300 rounded-lg p-2 w-full'
                />
              </div>
              <div className='flex flex-col items-start mb-4'>
                <label className='mr-2'>Name on Card:</label>
                <input
                  type='text'
                  className='border border-gray-300 rounded-lg p-2 w-full'
                />
              </div>
              <button className='text-white justify-center bg-red-500 hover:bg-red-600 flex gap-x-3 items-center px-4 py-3 mt-3 text-xl w-full rounded-lg'>
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
                  <path d='M11.5 21h-4.5a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v.5' />
                  <path d='M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0' />
                  <path d='M8 11v-4a4 4 0 1 1 8 0v4' />
                  <path d='M15 19l2 2l4 -4' />
                </svg>
                Pay €{calculateTotalCost().toFixed(2)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default withAuthGuard(CheckoutPage);
