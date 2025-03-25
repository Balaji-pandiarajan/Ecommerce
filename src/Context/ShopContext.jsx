/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from "react";
import all_product from "../Components/Assets/all_product";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < all_product.length + 1; index++) {
      cart[index] = { sizes: {} }; // Initialize with empty sizes
    }
    return cart;
  };

  const [cartItems, setCartItems] = useState(getDefaultCart());

  const addToCart = (itemId, size) => {
    setCartItems((prev) => {
      const existingSizes = prev[itemId]?.sizes || {};
      const newQuantity = (existingSizes[size] || 0) + 1;

      return {
        ...prev,
        [itemId]: {
          sizes: {
            ...existingSizes,
            [size]: newQuantity,
          },
        },
      };
    });
  };

  const removeFromCart = (itemId, size) => {
    setCartItems((prev) => {
      const updatedSizes = { ...prev[itemId].sizes };
      updatedSizes[size] = Math.max(0, (updatedSizes[size] || 0) - 1);

      // Remove size entry if quantity is 0
      if (updatedSizes[size] <= 0) {
        delete updatedSizes[size];
      }

      // Remove item entirely if no sizes left
      if (Object.keys(updatedSizes).length === 0) {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      }

      return {
        ...prev,
        [itemId]: { sizes: updatedSizes },
      };
    });
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      const itemInfo = all_product.find((product) => product.id === Number(item));
      if (itemInfo) {
        for (const size in cartItems[item].sizes) {
          totalAmount += itemInfo.new_price * cartItems[item].sizes[size];
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      for (const size in cartItems[item].sizes) {
        totalItem += cartItems[item].sizes[size];
      }
    }
    return totalItem;
  };

  const getShippingCost = () => {
    const totalItems = getTotalCartItems();
    return totalItems > 1 ? 0 : 30;
  };

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getShippingCost,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;


// this is a demo command