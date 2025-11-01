import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCart, getCartTotal, clearCart } from "../utils/cartUtils";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review, 4: Success

  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [orderNotes, setOrderNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrders, setCreatedOrders] = useState([]); // Store created orders

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadCheckoutData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCheckoutData = async () => {
    try {
      // Load cart
      const items = getCart();
      setCartItems(items);
      setTotal(getCartTotal());

      // Load addresses and payments
      const response = await fetch(
        "http://localhost:5000/api/dashboard/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses);
        setPaymentMethods(data.payment_methods);

        // Auto-select defaults
        const defaultAddr = data.addresses.find((a) => a.is_default);
        const defaultPayment = data.payment_methods.find((p) => p.is_default);

        setSelectedAddress(defaultAddr || data.addresses[0] || null);
        setSelectedPayment(defaultPayment || data.payment_methods[0] || null);
      }
    } catch (error) {
      console.error("Error loading checkout data:", error);
      toast.error("Failed to load checkout data");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: cartItems,
        shipping_address_id: selectedAddress.id,
        payment_method_id: selectedPayment.id,
        shipping_method: shippingMethod,
        notes: orderNotes,
        subtotal: total,
        tax: total * 0.08,
        shipping_cost: shippingMethod === "express" ? 15 : 0,
        total: total * 1.08 + (shippingMethod === "express" ? 15 : 0),
      };

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        setCreatedOrders(result.orders || []);
        clearCart();
        setCurrentStep(4);
        toast.success(
          `${result.num_orders || 1} order(s) placed successfully!`
        );
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Error placing order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Step 4: Order Success
  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto py-12 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="text-8xl mb-6">✅</div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for your purchase. Your order(s) is being processed.
            </p>

            {/* Orders Summary */}
            <div className="bg-gray-50 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📦 Order Summary
              </h2>

              {createdOrders.length > 0 ? (
                <div className="space-y-4">
                  {createdOrders.map((order) => (
                    <div
                      key={order.order_id}
                      className="bg-white p-4 rounded-lg border border-gray-200 text-left"
                    >
                      <p className="font-semibold text-gray-900">
                        Order #{order.order_id} • Store ID: {order.store_id}
                      </p>
                      <p className="text-gray-700 text-sm">
                        Items: {order.items_count} • Amount: $
                        {order.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}

                  <div className="mt-6 pt-6 border-t-2 border-gray-200">
                    <p className="text-gray-700 font-semibold">
                      <span className="font-bold text-xl text-gray-900">
                        Total: $
                      </span>
                      <span className="font-bold text-xl text-gray-900">
                        {createdOrders
                          .reduce((sum, o) => sum + o.amount, 0)
                          .toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-700 mb-4">
                    <span className="font-semibold">Order Total:</span> $
                    {(
                      total * 1.08 +
                      (shippingMethod === "express" ? 15 : 0)
                    ).toFixed(2)}
                  </p>
                  <p className="text-gray-700 mb-4">
                    <span className="font-semibold">Shipping to:</span>{" "}
                    {selectedAddress?.name}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Payment Method:</span>{" "}
                    {selectedPayment?.card_type} ending in{" "}
                    {selectedPayment?.card_number_last_four}
                  </p>
                </>
              )}
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate("/customer/orders")}
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
              >
                � View My Orders
              </button>
              <button
                onClick={() => navigate("/collections")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-8 rounded-lg transition-all"
              >
                🛍️ Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900">💳 Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase</p>
        </div>

        {/* Progress Steps */}
        <div className="flex mb-12">
          {[
            { num: 1, label: "Shipping", icon: "📍" },
            { num: 2, label: "Payment", icon: "💳" },
            { num: 3, label: "Review", icon: "👀" },
          ].map((step) => (
            <div key={step.num} className="flex-1">
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                    currentStep >= step.num
                      ? "bg-gray-900 text-white shadow-lg"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.icon}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {step.label}
                  </p>
                </div>
                {step.num < 3 && (
                  <div className="flex-1 ml-6">
                    <div
                      className={`h-1 transition-all ${
                        currentStep > step.num ? "bg-gray-900" : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    📍 Delivery Address
                  </h2>

                  {addresses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() => setSelectedAddress(address)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                            selectedAddress?.id === address.id
                              ? "border-gray-900 bg-gray-100 shadow-lg"
                              : "border-gray-300 bg-white hover:border-gray-400"
                          }`}
                        >
                          <h4 className="font-bold text-gray-900 mb-2">
                            {address.name}
                            {address.is_default && (
                              <span className="ml-2 text-xs bg-gray-900 text-white px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-700">
                            {address.street_address}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state}{" "}
                            {address.postal_code}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.country}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <p className="text-yellow-800">
                        ⚠️ No addresses found. Please add an address in your
                        profile.
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-bold text-gray-900 mb-4">
                      🚚 Shipping Method
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer">
                        <input
                          type="radio"
                          name="shipping"
                          value="standard"
                          checked={shippingMethod === "standard"}
                          onChange={(e) => setShippingMethod(e.target.value)}
                          className="w-4 h-4"
                        />
                        <div className="ml-4 flex-1">
                          <p className="font-semibold text-gray-900">
                            Standard Shipping
                          </p>
                          <p className="text-sm text-gray-600">
                            Delivery in 5-7 business days
                          </p>
                        </div>
                        <span className="font-bold text-gray-900">FREE</span>
                      </label>

                      <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer">
                        <input
                          type="radio"
                          name="shipping"
                          value="express"
                          checked={shippingMethod === "express"}
                          onChange={(e) => setShippingMethod(e.target.value)}
                          className="w-4 h-4"
                        />
                        <div className="ml-4 flex-1">
                          <p className="font-semibold text-gray-900">
                            🚀 Express Shipping
                          </p>
                          <p className="text-sm text-gray-600">
                            Delivery in 1-2 business days
                          </p>
                        </div>
                        <span className="font-bold text-gray-900">+$15</span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <label className="block mb-2">
                      <p className="font-bold text-gray-900 mb-2">
                        📝 Order Notes (Optional)
                      </p>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Add special instructions or notes..."
                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:outline-none transition-all"
                        rows="3"
                      />
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedAddress}
                  className={`w-full font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 ${
                    selectedAddress
                      ? "bg-gray-900 hover:bg-gray-800 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    💳 Payment Method
                  </h2>

                  {paymentMethods.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {paymentMethods.map((payment) => (
                        <div
                          key={payment.id}
                          onClick={() => setSelectedPayment(payment)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                            selectedPayment?.id === payment.id
                              ? "border-gray-900 bg-gray-100 shadow-lg"
                              : "border-gray-300 bg-white hover:border-gray-400"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900">
                              {payment.card_type}
                            </h4>
                            {payment.is_default && (
                              <span className="text-xs bg-gray-900 text-white px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-lg font-mono text-gray-900 mb-2">
                            •••• {payment.card_number_last_four}
                          </p>
                          <p className="text-sm text-gray-700">
                            {payment.cardholder_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Expires {payment.expiry_month}/{payment.expiry_year}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <p className="text-yellow-800">
                        ⚠️ No payment methods found. Please add a payment method
                        in your profile.
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-900 text-sm">
                      🔒 Your payment information is secure and encrypted. We
                      never store full card details.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-bold py-4 px-6 rounded-lg transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={!selectedPayment}
                    className={`flex-1 font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 ${
                      selectedPayment
                        ? "bg-gray-900 hover:bg-gray-800 text-white"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    👀 Review Your Order
                  </h2>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-4">
                      📦 Order Items
                    </h3>
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-300"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr className="my-6 border-gray-300" />

                  {/* Shipping Address */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-3">
                      📍 Shipping Address
                    </h3>
                    <div className="bg-white rounded-lg p-4 border border-gray-300">
                      <p className="font-semibold text-gray-900">
                        {selectedAddress?.name}
                      </p>
                      <p className="text-gray-700">
                        {selectedAddress?.street_address}
                      </p>
                      <p className="text-gray-700">
                        {selectedAddress?.city}, {selectedAddress?.state}{" "}
                        {selectedAddress?.postal_code}
                      </p>
                      <p className="text-gray-700">
                        {selectedAddress?.country}
                      </p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-3">
                      💳 Payment Method
                    </h3>
                    <div className="bg-white rounded-lg p-4 border border-gray-300">
                      <p className="font-semibold text-gray-900">
                        {selectedPayment?.card_type}
                      </p>
                      <p className="text-gray-700 font-mono">
                        •••• {selectedPayment?.card_number_last_four}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {selectedPayment?.cardholder_name}
                      </p>
                    </div>
                  </div>

                  {/* Order Notes */}
                  {orderNotes && (
                    <div className="mb-6">
                      <h3 className="font-bold text-gray-900 mb-3">
                        📝 Order Notes
                      </h3>
                      <div className="bg-white rounded-lg p-4 border border-gray-300">
                        <p className="text-gray-700">{orderNotes}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-bold py-4 px-6 rounded-lg transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className={`flex-1 font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 ${
                      isProcessing
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {isProcessing ? "Processing..." : "✓ Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 sticky top-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                📋 Order Summary
              </h3>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="my-4 border-gray-300" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (8%)</span>
                  <span className="font-semibold">
                    ${(total * 0.08).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>
                    Shipping{" "}
                    {shippingMethod === "express" ? "(Express)" : "(Standard)"}
                  </span>
                  <span className="font-semibold">
                    ${shippingMethod === "express" ? "15.00" : "0.00"}
                  </span>
                </div>
              </div>

              <hr className="my-4 border-gray-300" />

              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>
                  $
                  {(
                    total * 1.08 +
                    (shippingMethod === "express" ? 15 : 0)
                  ).toFixed(2)}
                </span>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-300 text-xs text-gray-600 space-y-2">
                <p>✓ Secure SSL encryption</p>
                <p>✓ Money-back guarantee</p>
                <p>✓ 24/7 customer support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
