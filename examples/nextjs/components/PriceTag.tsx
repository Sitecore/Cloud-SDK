const PriceTag = ({
  price,
  discount,
  isOriginal = false
}: {
  price: number | string;
  discount?: number;
  isOriginal?: boolean;
}) => (
  <span
    className={`inline-block ${
      isOriginal && discount ? 'text-gray-400 line-through text-sm' : 'text-lg font-semibold text-gray-900'
    }`}>
    €{typeof price === 'string' ? parseFloat(price) || 'Price not available' : price.toFixed(2)}
  </span>
);

export default PriceTag;
