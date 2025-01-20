export type RecommendedProduct = {
  id: string;
  name: string;
  price: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  image_url: string;
  brand: string;
  sku: string;
};

export type Product = {
  id: string;
  title: string;
  price: number;
  discount?: number;
  imageUrl: string;
  slug: string;
};
