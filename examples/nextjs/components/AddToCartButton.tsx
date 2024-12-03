const AddToCartButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className='w-full mt-4 inline-flex items-center justify-center px-3 py-2.5 
               border-2 border-red-600 
               text-sm font-semibold rounded-lg 
               text-white bg-red-600 
               hover:bg-red-700 hover:border-red-700 
               active:bg-red-800 active:border-red-800
               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 
               transition-all duration-200 
               shadow-sm hover:shadow-md'
    aria-label='Add to cart'>
    <svg
      className='w-4 h-4 mr-2'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
      />
    </svg>
    Add to cart
  </button>
);

export default AddToCartButton;
