'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { entityView } from '@sitecore-cloudsdk/search/browser';
import { withAuthGuard } from '../../../components/AuthGuard';
import ReviewCount from '../../../components/ProductPage/review-rating';
import { ProductItem } from '../../../components/search/Product';
import { useCart } from '../../../context/Cart';
import { getProductById } from '../../../utils/product-repository';

function ProductPage({ params }: { params: { id: string } }) {
  const pathname = usePathname();
  const [product, setProduct] = useState<ProductItem>();
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Initial quantity is 1
  const increment = () => setQuantity((prev) => Math.min(prev + 1, 99)); // Max 99
  const decrement = () => setQuantity((prev) => Math.max(prev - 1, 1)); // Min 1

  useEffect(() => {
    getProductById(params.id)
      .then((product) => {
        if (product) entityView({ entity: { entity: 'product', id: product.id }, pathname });

        setProduct(product);
      })
      .finally(() => setLoading(false));
  }, [params.id, pathname]);

  const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const { addProductItem } = useCart();

  const handleAddToCart = () => {
    addProductItem(product as ProductItem, quantity);
  };

  if (loading)
    return (
      <div className='product-page flex flex-col lg:flex-row p-6'>
        <div className='gallery w-full lg:w-3/5 h-64 bg-gray-200 animate-pulse rounded-md mb-6 lg:mb-0'></div>
        <div className='product-info w-full lg:w-2/5 space-y-4'>
          <div className='w-3/4 h-6 bg-gray-200 animate-pulse rounded-md'></div>
          <div className='w-1/2 h-8 bg-gray-200 animate-pulse rounded-md'></div>
          <div className='w-full h-4 bg-gray-200 animate-pulse rounded-md'></div>
          <div className='w-5/6 h-4 bg-gray-200 animate-pulse rounded-md'></div>
          <div className='w-3/4 h-4 bg-gray-200 animate-pulse rounded-md'></div>
          <div className='w-32 h-10 bg-gray-200 animate-pulse rounded-md'></div>
        </div>
      </div>
    );

  if (!product) return <div>No product found</div>;

  return (
    <div className='container'>
      <div className='product-page gap-10 md:grid grid-cols-2 p-6'>
        <div className='gallery'>
          <Image
            src={product.image_url}
            width={600}
            height={600}
            alt={product.name}
          />
          <div className='thumbnails flex gap-4'>
            {[product.image_url, product.image_url].map((img, index) => (
              <div
                key={index}
                className='cursor-pointer rounded-md w-[100px] h-[100px] border flex items-center justify-center'>
                <Image
                  src={img}
                  width={120}
                  height={120}
                  alt={product.name}
                />
              </div>
            ))}
          </div>
        </div>
        <div className='details'>
          <div className='product-name'>
            <h1 className='font-bold text-2xl md:text-5xl'>{product.name}</h1>
            <div className='brand flex gap-2'>
              <strong>Brand:</strong>
              <span className='text-slate-500'>{product?.brand ?? 'OEM'}</span>
            </div>
          </div>
          <ReviewCount
            reviewCount={getRandomInt(5, 500)}
            averageRating={getRandomInt(1, 5)}
          />
          <div className='description mt-2'>
            <p className='text-slate-800'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel auctor lorem. Ut feugiat hendrerit
              fermentum. Donec nec efficitur nibh. Phasellus malesuada varius ligula sit amet convallis. Duis finibus
              est massa, a vehicula enim ullamcorper quis. Class aptent taciti sociosqu ad litora torquent per conubia
              nostra, per inceptos himenaeos. Etiam id rhoncus lacus.
            </p>
          </div>
          <div className='price-box mt-4'>
            <strong className='text-4xl'>€{product.price}</strong>
          </div>
          <div className='tocart md:mt-10 flex flex-col md:flex-row gap-4'>
            <div className='quantity-selector'>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={decrement}
                  className='font-bold flex items-center justify-center w-12 h-12 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none'>
                  -
                </button>
                <input
                  type='number'
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value))))} // Ensure valid range
                  className='w-16 h-12 text-center border border-gray-300 rounded-md'
                  min='1'
                  max='99'
                />
                <button
                  onClick={increment}
                  className='font-bold flex items-center justify-center w-12 h-12 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none'>
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className='rounded bg-red-600 hover:bg-red-500 font-medium text-white px-5 py-2.5 mb-2'>
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuthGuard(ProductPage);
