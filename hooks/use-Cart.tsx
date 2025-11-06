'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';

interface CartItem {
  id: number;
  variant_id: number;
  amount: number;
}

interface Cart {
  items?: CartItem[];
  totalItems: number;
}

interface CartContextType {
  cart: Cart;
  addToCart: (product_id: number, variant_id: number) => void;
  clearCart: () => void;
  removeFromCart: (variant_id: number, amountToRemove?: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
CartContext.displayName = 'CartContext';
const storageKey = 'BackpackCart';

export function CartProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initCart: Cart = { items: [], totalItems: 0 };
  const [cart, setCart] = useState<Cart>(initCart);

  const addToCart = (product_id: number, variant_id: number) => {
    setCart((prevCart) => {
      // 當前購物車中的商品列表
      const currentItems = prevCart.items || [];

      // 檢查商品是否已存在於購物車中
      const existingItemIndex = currentItems.findIndex(
        (item) => item.variant_id === variant_id
      );

      let newItems: CartItem[];
      let newTotalItems: number;

      // 情況一：商品已存在
      if (existingItemIndex > -1) {
        // 1. 複製 items 陣列 (保持不可變性)
        newItems = [...currentItems];

        // 2. 複製要更新的 CartItem 物件
        const existingItem = newItems[existingItemIndex];
        const updatedItem = {
          ...existingItem,
          amount: existingItem.amount + 1, // 數量 + 1
        };

        // 3. 用更新後的項目替換陣列中的舊項目
        newItems[existingItemIndex] = updatedItem;

        // 總數量也會增加 1
        newTotalItems = prevCart.totalItems + 1;
      }
      // 情況二：商品是新的
      else {
        const newItem: CartItem = {
          id: product_id,
          variant_id: variant_id,
          amount: 1,
        };
        // 2. 創建一個包含新項目的新陣列
        newItems = [...currentItems, newItem];

        // 總數量增加 1
        newTotalItems = prevCart.totalItems + 1;
      }

      // 回傳
      return {
        ...prevCart,
        items: newItems,
        totalItems: newTotalItems,
      };
    });
  };

  const removeFromCart = (variant_id: number, amountToRemove?: number) => {
    setCart((prevCart) => {
      const currentItems = prevCart.items || [];
      const existingItemIndex = currentItems.findIndex(
        (item) => item.variant_id === variant_id
      );

      // 如果找不到該商品，則直接返回原狀態
      if (existingItemIndex === -1) {
        return prevCart;
      }

      let newItems: CartItem[];
      let itemsRemoved: number;
      const existingItem = currentItems[existingItemIndex];

      // 指定了移除的數量 (且該商品數量大於 1)
      if (amountToRemove && existingItem.amount > 1) {
        // 確保移除數量不超過現有數量
        itemsRemoved = Math.min(amountToRemove, existingItem.amount);

        // 複製 items 陣列和要更新的項目
        newItems = [...currentItems];
        const updatedAmount = existingItem.amount - itemsRemoved;

        if (updatedAmount > 0) {
          // 減少數量
          newItems[existingItemIndex] = {
            ...existingItem,
            amount: updatedAmount,
          };
        } else {
          newItems = currentItems.filter(
            (_, index) => index !== existingItemIndex
          );
        }
      }
      // 情況二：未指定移除數量 (或指定移除所有數量)，或現有數量等於 1
      else {
        itemsRemoved = existingItem.amount;
        newItems = currentItems.filter(
          (_, index) => index !== existingItemIndex
        );
      }

      // 更新總數量
      const newTotalItems = prevCart.totalItems - itemsRemoved;

      // 回傳新的 Cart 物件
      return {
        ...prevCart,
        items: newItems,
        totalItems: Math.max(0, newTotalItems), // 確保總數量不會小於 0
      };
    });
  };

  const clearCart = () => {
    setCart(initCart); // 將狀態重設為初始的空購物車
    localStorage.removeItem(storageKey);
  };

  useEffect(() => {
    const storedCart = localStorage.getItem(storageKey);
    if (storedCart) {
      try {
        // 解析 JSON 字串
        const loadedCart = JSON.parse(storedCart) as Cart;

        // 檢查解析出的物件是否符合 Cart 介面的基本要求
        if (loadedCart && typeof loadedCart.totalItems === 'number') {
          setCart(loadedCart);
        }
      } catch (error) {}
    }
  }, []);

  useEffect(() => {
    // 檢查是否在瀏覽器環境
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart data to localStorage:', error);
      }
    }
  }, [cart]);

  return (
    <>
      <CartContext.Provider
        value={{ cart, addToCart, clearCart, removeFromCart }}
      >
        {children}
      </CartContext.Provider>
    </>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
