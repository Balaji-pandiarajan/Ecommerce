/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from "react";
import all_product from "../Components/Assets/all_product";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  // This is your central state management component that handles all cart operations.
  // Key Parts:

  const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < all_product.length + 1; index++) {
      cart[index] = { sizes: {} }; // Initialize with empty sizes
    }
    return cart;
  };
  // Initializes an empty cart structure with slots for all possible products
  // Each product entry has a sizes object to track quantities per size

  const [cartItems, setCartItems] = useState(getDefaultCart());

  // addToCart(itemId, size)
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
  // Increments quantity for a specific product size
  // Creates new size entry if it doesn't exist

  // removeFromCart(itemId, size)
  const removeFromCart = (itemId, size) => {
    setCartItems((prev) => {
      const updatedSizes = { ...prev[itemId]?.sizes };
      delete updatedSizes[size]; // Remove the size entirely

      // If no sizes left, remove the item from the cart
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
  // Completely removes a size variant from cart
  // Cleans up product entry if no sizes remain

  // Calculation Helpers
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      const itemInfo = all_product.find(
        (product) => product.id === Number(item)
      );
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
  // Calculation Helpers

  //decrementQuantity(itemId, size)
  const decrementQuantity = (itemId, size) => {
    setCartItems((prev) => {
      const updatedSizes = { ...prev[itemId]?.sizes };
      if (updatedSizes[size]) {
        updatedSizes[size] = Math.max(0, updatedSizes[size] - 1); // Decrease but don't delete
        if (updatedSizes[size] === 0) {
          delete updatedSizes[size]; // Only delete if quantity reaches 0
        }
        // Reduces quantity but doesn't immediately remove
        // Only removes when quantity reaches 0
      }

      // Clean up if no sizes left
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

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getShippingCost,
    decrementQuantity,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;

// this is a demo command
