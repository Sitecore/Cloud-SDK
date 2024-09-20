'use client';

import React, { createContext, useContext, useState } from 'react';
import { Product } from '../components/Products';

interface CartProduct extends Product {
  quantity: number;
}

const contextDefaultValues: CartContext = {
  addProductItem: () => null,
  calculateTotalCost: () => 0,
  calculateTotalItems: () => 0,
  closeSidebar: () => null,
  isSidebarOpen: false,
  openSidebar: () => null,
  productItems: [],
  removeProductItem: () => null,
  calculateDiscountPrice: () => 0
};

const CartContext = createContext<CartContext>(contextDefaultValues);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(contextDefaultValues.isSidebarOpen);
  const [productItems, setProductItems] = useState<CartProduct[]>([]);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const addProductItem = (product: Product, quantity: number) => {
    const isProductOnCart = productItems.some((item) => item.id === product.id);
    if (isProductOnCart) {
      const updatedItems = productItems.map((item) => {
        if (item.id === product.id) {
          item.quantity = quantity;
        }
        return item;
      });
      setProductItems(updatedItems);
    } else {
      setProductItems([...productItems, { ...product, quantity }]);
    }
  };

  const removeProductItem = (productId: string) => {
    const updatedItems = productItems.filter((item) => item.id !== productId);
    setProductItems(updatedItems);
  };

  const calculateTotalItems = () => {
    const totalItems = productItems.reduce((acc, product) => {
      return product.quantity ? acc + product.quantity : acc + 0;
    }, 0);
    return totalItems;
  };

  /**
   * Calculate the price of a product with discount applied.
   * @param price The price of the product
   * @param discount The discount percentage (0-100)
   * @returns The price of the product with discount applied
   */
  const calculateDiscountPrice = (price: number, discount: number | undefined) => {
    if (discount) {
      const discounted = ((100 - discount) / 100) * price;
      return discounted;
    }
    return price;
  };

  const calculateTotalCost = () => {
    const totalCost = productItems.reduce((acc, product) => {
      return product.quantity
        ? acc + calculateDiscountPrice(product.price, product.discount) * product.quantity
        : acc + 0;
    }, 0);

    return totalCost;
  };

  return (
    <CartContext.Provider
      value={{
        addProductItem,
        calculateTotalCost,
        calculateTotalItems,
        closeSidebar,
        isSidebarOpen,
        openSidebar,
        productItems,
        removeProductItem,
        calculateDiscountPrice
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};

interface CartContext {
  addProductItem: (product: Product, quantity: number) => void;
  calculateTotalCost: () => number;
  calculateTotalItems: () => number;
  isSidebarOpen: boolean;
  openSidebar: () => void;
  removeProductItem: (productId: string) => void;
  closeSidebar: () => void;
  productItems: Product[];
  calculateDiscountPrice: (price: number, discount: number | undefined) => number;
}

interface CartProviderProps {
  children: React.ReactNode;
}
