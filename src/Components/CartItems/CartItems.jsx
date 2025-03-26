import React, { useContext, useState } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
// import remove_icon from "../Assets/cart_cross_icon.png";
import { FaTrash } from "react-icons/fa";

const CartItems = () => {
  const {
    getTotalCartAmount,
    cartItems,
    all_product,
    addToCart,
    removeFromCart,
    getShippingCost,
    decrementQuantity,
  } = useContext(ShopContext);

  // Local state for instant UI feedback (optional)
  const [localQuantities, setLocalQuantities] = useState({});

  // Displays and manages cart contents.
  // Key Features:
  // Quantity Management
  const handleIncrement = (itemId, size) => {
    // Update global cart
    addToCart(itemId, size);
    // Optional: Update local UI state
    setLocalQuantities((prev) => ({
      ...prev,
      [`${itemId}-${size}`]:
        (prev[`${itemId}-${size}`] || cartItems[itemId]?.sizes[size] || 0) + 1,
    }));
  };
  // Uses both global state and local state for instant feedback

  const handleDecrement = (itemId, size) => {
    decrementQuantity(itemId, size); // Only decreases quantity
    setLocalQuantities((prev) => ({
      ...prev,
      [`${itemId}-${size}`]: Math.max(
        0,
        (prev[`${itemId}-${size}`] || cartItems[itemId]?.sizes[size] || 1) - 1
      ),
    }));
  };
  const totalAmount = getTotalCartAmount();
  const shippingCost = getShippingCost();
  const totalWithShipping = totalAmount + shippingCost;

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Size</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {/*Cart Item Rendering
      Nested mapping: products → sizes
      Creates separate row for each product-size combination */}
      {all_product.map((e) => {
        if (cartItems[e.id]?.sizes) {
          return Object.entries(cartItems[e.id].sizes).map(
            ([size, quantity]) => (
              <div key={`${e.id}-${size}`}>
                <div className="cartitems-format cartitems-format-main">
                  <img src={e.image} alt="" className="carticon-product-icon" />
                  <p>{e.name}</p>
                  <p>{size}</p>
                  <p>${e.new_price}</p>
                  <div className="cartitems-quantity">
                    <button onClick={() => handleDecrement(e.id, size)}>
                      -
                    </button>
                    <span>
                      {localQuantities[`${e.id}-${size}`] || quantity}
                    </span>
                    <button onClick={() => handleIncrement(e.id, size)}>
                      +
                    </button>
                  </div>
                  <p>
                    $
                    {e.new_price *
                      (localQuantities[`${e.id}-${size}`] || quantity)}
                  </p>
                  <div
                    className="carticon-remove-icon"
                    onClick={() => removeFromCart(e.id, size)}
                  >
                    <FaTrash />
                  </div>
                </div>
                <hr />
              </div>
            )
          );
        }
        return null;
      })}

      {/* Rest of the cart totals/promo code section remains the same */}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Price</p>
              <p>{shippingCost === 0 ? "Free" : `$${shippingCost}`}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${totalWithShipping}</h3>
            </div>
          </div>
          <button>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="promo code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
