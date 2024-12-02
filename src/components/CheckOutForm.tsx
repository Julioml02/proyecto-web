'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CheckOutFormProps {
  totalPrice: number;
  cartItems: any[];
}

const CheckOutForm: React.FC<CheckOutFormProps> = ({ totalPrice, cartItems }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Handler for the purchase button
  const handlePurchase = async () => {
    setIsProcessing(true);

    try {
      // Send the request to handle the checkout
      const res = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({
          cartItems, // the cart items to be included in the order
          totalPrice, // total price of the order
        }),
      });

      if (res.ok) {
        // Redirect to the order confirmation page or home page after successful purchase
        router.push('/order-confirmation');
      } else {
        console.error('Checkout failed');
        // Handle error
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Render the cart items */}
      <div className="text-lg font-bold">Cart Summary</div>
      <ul className="space-y-2">
        {cartItems.map((item, index) => (
          <li key={index} className="flex justify-between">
            <span>{item.product.name}</span>
            <span>{item.qty} x {item.product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
          </li>
        ))}
      </ul>

      {/* Display the total price */}
      <div className="flex justify-between font-semibold text-xl mt-4">
        <span>Total:</span>
        <span>{totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
      </div>

      {/* Purchase button */}
      <div className="mt-6">
        <button
          className={`w-full py-2 px-4 rounded bg-blue-600 text-white ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          onClick={handlePurchase}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Complete Purchase'}
        </button>
      </div>
    </div>
  );
};

export default CheckOutForm;
