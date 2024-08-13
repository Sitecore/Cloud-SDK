import Image from 'next/image';

type Product = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
};

/**
 * A component that renders a list of products in a grid.
 * @param props An object with a `products` property that is an array of products.
 * @returns A grid of products.
 */
export function Products({ products }: { products: Product[] }) {
  return (
    <div className='grid grid-cols-4 gap-8 my-16'>
      {products.map((product) => (
        <div
          key={product.id}
          className='p-6 bg-white flex flex-col justify-between transition-colors duration-500 rounded-tl-3xl rounded-br-3xl'>
          <Image
            src={product.imageUrl}
            alt={product.title}
            className='w-full h-48 object-contain bg-white rounded-xl'
            height={200}
            width={200}
          />
          <h1 className='text-lg font-semibold mt-2'>{product.title}</h1>
          <h4>${product.price}</h4>
          <button className='text-blue-600 hover:bg-slate-100 px-4 py-2 mt-3 float-end rounded-lg'>Add to cart</button>
        </div>
      ))}
    </div>
  );
}
