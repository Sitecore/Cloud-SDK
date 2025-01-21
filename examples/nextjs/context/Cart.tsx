'use client';

import React, { createContext, useContext, useState } from 'react';
import { ProductItem } from '../components/search/Product';

interface CartProduct extends ProductItem {
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
  removeProductItem: () => null
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

  const addProductItem = (product: ProductItem, quantity: number) => {
    const isProductOnCart = productItems.some((item) => item.id === product.id);
    if (isProductOnCart) {
      const updatedItems = productItems.map((item) => {
        if (item.id === product.id) {
          item.quantity += quantity;
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

  const calculateTotalCost = () => {
    const totalCost = productItems.reduce((acc, product) => {
      return product.quantity ? acc + parseFloat(product.price) * product.quantity : acc;
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
        removeProductItem
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};

interface CartContext {
  addProductItem: (product: ProductItem, quantity: number) => void;
  calculateTotalCost: () => number;
  calculateTotalItems: () => number;
  isSidebarOpen: boolean;
  openSidebar: () => void;
  removeProductItem: (productId: string) => void;
  closeSidebar: () => void;
  productItems: CartProduct[];
}

interface CartProviderProps {
  children: React.ReactNode;
}
