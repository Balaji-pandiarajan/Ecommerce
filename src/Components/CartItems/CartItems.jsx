import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
  const {
    getTotalCartAmount,
    cartItems,
    all_product,
    removeFromCart,
    getShippingCost,
  } = useContext(ShopContext);

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

      {all_product.map((e) => {
        if (cartItems[e.id]?.sizes) {
          return Object.entries(cartItems[e.id].sizes).map(([size, quantity]) => (
            <div key={`${e.id}-${size}`}>
              <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt="" className="carticon-product-icon" />
                <p>{e.name}</p>
                <p>{size}</p>
                <p>${e.new_price}</p>
                <button className="cartitems-quantity">{quantity}</button>
                <p>${e.new_price * quantity}</p>
                <img
                  className="carticon-remove-icon"
                  src={remove_icon}
                  onClick={() => removeFromCart(e.id, size)}
                  alt=""
                />
              </div>
              <hr />
            </div>
          ));
        }
        return null;
      })}

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