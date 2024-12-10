import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// const stripePromise = loadStripe(
//   "pk_test_51PqnMzCMCpxFz40MVwOUjcuR9TIEwHGKXk7G9SLptwqTq6RaC2EhUDa4QICmWgG6aPqihsjszOmHLq7F5MjwzoSC00HCbYjVe9"
// );

interface PaymentFormProps {
  calculateTotal: () => number;
}

interface PaymentIntent {
  client_secret: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ calculateTotal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [cardHolderName, setCardHolderName] = useState("");

  useEffect(() => {
    // Fetch payment intent from your backend
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: calculateTotal() * 100, currency: "eur" }),
    })
      .then((res) => res.json())
      .then((data) => setPaymentIntent(data.paymentIntent));
  }, [calculateTotal]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement!,
      billing_details: {
        name: cardHolderName,
      },
    });

    if (error) {
      console.error(error);
    } else {
      const { error: confirmationError } = await stripe.confirmCardPayment(
        paymentIntent!.client_secret,
        {
          payment_method: paymentMethod!.id,
        }
      );

      if (confirmationError) {
        console.error(confirmationError);
      } else {
        console.log("Payment successful!");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="cardHolderName"
            className="block text-sm text-gray-700 font-semibold"
          >
            Name on card
          </label>
          <input
            type="text"
            id="cardHolderName"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            className="py-3.5 border-2 border-slate-300 px-4 rounded w-full mt-1"
            placeholder="Name on card"
          />
        </div>
        <div>
          <label
            htmlFor="cardNumber"
            className="block text-sm text-gray-700 font-semibold"
          >
            Card number
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <CardElement
              className="py-4 border-2 border-slate-300 px-4 rounded w-full"
              id="cardNumber"
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#32325d",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#fa755a",
                    iconColor: "#fa755a",
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe}
        className="w-full py-3 font-semibold bg-black text-white rounded-lg"
      >
        Pay now
      </button>
    </form>
  );
};

export default PaymentForm;
