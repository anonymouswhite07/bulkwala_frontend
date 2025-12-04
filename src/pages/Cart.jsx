import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";
import useCartStore from "@/store/cart.store";
import { useOfferStore } from "@/store/offer.store";
import useAuthStore from "@/store/auth.store";

const Cart = () => {
  const {
    cart,
    totalPrice,
    shippingPrice,
    itemsPrice,
    isLoading,
    isUpdating,
    couponError, // From store for error messages
    fetchCart,
    updateCart,
    removeCartItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    discount,
    couponApplied,
    appliedCouponCode,
    flashDiscount,
    applyReferral,
    removeReferral,
    referralDiscount,
    referralApplied,
    buyNowProductId,
    clearBuyNow,
  } = useCartStore();
  const { fetchActiveOffer, timeLeft } = useOfferStore();
  const { user } = useAuthStore();

  const navigate = useNavigate();
  const [isFetched, setIsFetched] = useState(false);
  const [couponCode, setCouponCode] = useState(""); // State to store coupon code
  const [referralCode, setReferralCode] = useState("");

  // ✅ Fetch cart data on mount
  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
      setIsFetched(true);
    };
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fetchCart is stable from zustand store

  // Add visibility change listener to refresh cart when user returns to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Refresh cart when user returns to the tab
        fetchCart();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchCart]);

  // ⭐ Auto-scroll for BUY NOW product
  useEffect(() => {
    if (buyNowProductId) {
      setTimeout(() => {
        const el = document.getElementById(`cart-item-${buyNowProductId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-2", "ring-blue-500", "rounded-lg");
          setTimeout(
            () => el.classList.remove("ring-2", "ring-blue-500"),
            2000
          );
        }
      }, 300);
    }
  }, [buyNowProductId]);

  useEffect(() => {
    fetchActiveOffer();
  }, []);
  // ✅ Loading state - Show loading indicator while cart is initializing
  // Added extra check for cartInitialized to handle iOS Safari caching issues
  if (isLoading || !isFetched || !cartInitialized) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-base sm:text-lg">
        Loading cart...
      </div>
    );
  }

  // ✅ Empty cart
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 text-gray-600 text-base sm:text-lg">
        <p>Your cart is empty.</p>
        <Button onClick={() => navigate("/products")} className="bg-[#02066F]">
          Browse Products
        </Button>
      </div>
    );
  }

  // ✅ Handlers
  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await updateCart(productId, quantity);
    } catch {
      toast.error("Failed to update quantity");
    }
  };
  const handleRemoveItem = async (productId) => {
    try {
      await removeCartItem(productId);
      await fetchCart();
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  const handleApplyCoupon = async () => {
    try {
      if (couponApplied) {
        toast.error("Coupon has already been applied.");
        return;
      }

      if (referralApplied) {
        toast.error("You can't use a coupon when a referral is applied.");
        return;
      }

      if (flashDiscount > 0) {
        toast.error(
          "Flash Offer is active — you can't apply a coupon right now."
        );
        return;
      }

      const result = await applyCoupon(couponCode);

      if (!result.success) {
        toast.error(result.message || "Invalid coupon code");
        return;
      }

      toast.success(result.message || "Coupon applied successfully!");
      setCouponCode("");
    } catch {
      toast.error("Something went wrong while applying coupon");
    }
  };

  // Remove coupon
  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon();
      await fetchCart();
      toast.success("Coupon removed");
    } catch (error) {
      toast.error("Failed to remove coupon");
    }
  };

  const handleApplyReferral = async () => {
    try {
      if (referralApplied) {
        toast.error("Referral has already been applied.");
        return;
      }

      if (couponApplied) {
        toast.error("You can't use a referral when a coupon is applied.");
        return;
      }

      if (flashDiscount > 0) {
        toast.error(
          "Flash Offer is active — you can't apply a referral right now."
        );
        return;
      }

      const result = await applyReferral({ referralCode });

      if (!result.success) {
        toast.error(result.message || "Invalid referral code");
        return;
      }

      toast.success(result.message || "Referral applied successfully!");
      setReferralCode("");
    } catch {
      toast.error("Something went wrong while applying referral");
    }
  };

  const handleRemoveReferral = async () => {
    try {
      await removeReferral();
      await fetchCart();
      toast.success("Referral removed");
    } catch (error) {
      toast.error("Failed to remove referral");
    }
  };

  // ✅ Layout
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-6">
          Your Cart
        </h1>

        {/* ✅ Guest cart message */}
        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              You're browsing as a guest.{" "}
              <Link
                to="/login"
                className="underline font-semibold hover:text-yellow-900"
              >
                Login
              </Link>{" "}
              to save your cart and proceed to checkout.
            </p>
          </div>
        )}

        {/* Cart Items */}
        <div className="space-y-6">
          {cart.items.map((item, index) => {
            // ✅ Handle both guest cart (productId) and backend cart (product._id) structures
            const productId = item.product?._id || item.productId;
            const product = item.product || null;

            // Skip if no product info available
            if (!productId) return null;

            return (
              <div
                key={`${productId}-${index}`}
                id={`cart-item-${productId}`}
                className="border border-gray-200 rounded-lg p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Left: Image + Title */}
                  <div className="flex gap-4">
                    {product?.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-24 h-24 object-contain rounded-md border border-gray-200"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No image</span>
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-2">
                        {product?.title || "Product"}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {product?.description || ""}
                      </p>

                      {/* Price */}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          ₹
                          {(product?.discountPrice > 0
                            ? product.discountPrice
                            : product?.price || 0
                          ).toFixed(2)}
                        </span>
                        {product?.discountPrice > 0 && product?.price > 0 && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Stock warning */}
                      {product?.stock === 0 && (
                        <p className="text-red-600 text-sm mt-1">Out of stock</p>
                      )}
                      {product?.stock > 0 && product?.stock < 5 && (
                        <p className="text-orange-600 text-sm mt-1">
                          Only {product.stock} left!
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Controls */}
                  <>
                    {/* Quantity + Price */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 ml-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Qty:
                        </span>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          value={item.quantity}
                          onChange={(e) => {
                            const raw = e.target.value;
                            let newQty = parseInt(raw) || 1;

                            // iOS Safari fix: Ensure value is within bounds
                            if (newQty < 1) newQty = 1;
                            if (newQty > 5) newQty = 5;
                            
                            // Prevent values > 5
                            if (value > 5) e.target.value = 5;

                            handleUpdateQuantity(productId, newQty);
                          }}
                          onBlur={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            // Ensure value stays within bounds
                            if (value < 1) e.target.value = 1;
                            if (value > 5) e.target.value = 5;
                          }}
                          className="w-16 text-center border border-gray-300 rounded-md shadow-sm text-sm touch-manipulation"
                          disabled={isUpdating || product?.stock === 0}
                          title={
                            product?.stock === 0
                              ? "Out of stock"
                              : `Max: ${product?.stock || "N/A"}`
                          }
                          // iOS Safari specific attributes
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                        <Button
                          variant="destructive"
                          onClick={() => handleRemoveItem(productId)}
                          onTouchEnd={(e) => {
                            // Prevent ghost click on touch devices
                            e.preventDefault();
                            handleRemoveItem(productId);
                          }}
                          disabled={isUpdating}
                          className="text-sm sm:text-base px-3 sm:px-4 touch-manipulation"
                        >
                          Remove
                        </Button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ₹
                          {(
                            (product?.discountPrice > 0
                              ? product.discountPrice
                              : product?.price || 0) * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{itemsPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                ₹{(shippingPrice || 0).toFixed(2)}
              </span>
            </div>
            {itemsPrice < 279 && itemsPrice > 0 && (
              <div className="text-xs sm:text-sm text-blue-600 italic">
                Add ₹{(279 - itemsPrice).toFixed(2)} more to get FREE shipping!
              </div>
            )}
            {itemsPrice >= 279 && itemsPrice > 0 && (
              <div className="text-xs sm:text-sm text-green-600 italic">
                🎉 Free shipping on this order!
              </div>
            )}

            {/* Show only one discount — priority: Coupon > Referral > Flash */}
            {discount > 0 ? (
              <div className="flex justify-between text-green-600">
                <span>
                  Discount{" "}
                  {couponApplied && `(${appliedCouponCode})`}
                  {referralApplied && " (Referral)"}
                  {flashDiscount > 0 && " (Flash Offer)"}
                </span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            ) : null}

            <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Coupon Section */}
          {!couponApplied && !referralApplied && flashDiscount <= 0 && (
            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button
                onClick={handleApplyCoupon}
                disabled={isUpdating || !couponCode.trim()}
                className="bg-[#02066F] hover:bg-[#02066F]/90"
              >
                Apply Coupon
              </Button>
            </div>
          )}

          {/* Applied Coupon */}
          {couponApplied && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
              <p className="text-green-800">
                Coupon applied: <span className="font-semibold">{appliedCouponCode}</span>
              </p>
              <Button
                variant="outline"
                onClick={handleRemoveCoupon}
                className="text-sm sm:text-base"
              >
                Remove Coupon
              </Button>
            </div>
          )}

          {/* Referral Section */}
          {!referralApplied && !couponApplied && flashDiscount <= 0 && (
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                placeholder="Enter referral code"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button
                onClick={handleApplyReferral}
                disabled={isUpdating || !referralCode.trim()}
                className="bg-[#02066F] hover:bg-[#02066F]/90"
              >
                Apply Referral
              </Button>
            </div>
          )}

          {/* Applied Referral */}
          {referralApplied && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
              <p className="text-green-800">
                Referral applied:{" "}
                <span className="font-semibold">
                  {cart.referralCode || "Code"}
                </span>
              </p>
              <Button
                variant="outline"
                onClick={handleRemoveReferral}
                className="text-sm sm:text-base"
              >
                Remove Referral
              </Button>
            </div>
          )}

          {/* Flash Offer Timer */}
          {flashDiscount > 0 && timeLeft > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-center">
                ⏳ Flash Offer ends in{" "}
                <span className="font-semibold">
                  {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handleClearCart}
            disabled={isUpdating}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            Clear Cart
          </Button>
          <Button
            onClick={() => navigate("/payment")}
            disabled={isUpdating}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;