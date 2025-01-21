import React from 'react';

interface ReviewCountProps {
  reviewCount: number;
  averageRating: number;
}

const ReviewCount: React.FC<ReviewCountProps> = ({ reviewCount, averageRating }) => {
  return (
    <div className='flex items-center space-x-2 text-gray-700 mt-2'>
      <div className='flex items-center'>
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            xmlns='http://www.w3.org/2000/svg'
            fill={index < averageRating ? 'currentColor' : 'none'}
            viewBox='0 0 24 24'
            stroke='currentColor'
            className={`w-5 h-5 ${index < averageRating ? 'text-yellow-400' : 'text-gray-300'}`}>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M12 17.75l-3.825 2.01 1.042-4.307-3.517-3.054 4.401-.383L12 6.25l1.88 5.731 4.4.384-3.517 3.054 1.042 4.307L12 17.75z'
            />
          </svg>
        ))}
      </div>

      <span className='text-sm font-medium'>{reviewCount} reviews</span>
    </div>
  );
};

export default ReviewCount;
