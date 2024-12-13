import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import api from "@/services/auth";

interface PaymentFormProps {
  calculateTotal: () => number;
  articleId: string;
  selectedServices: { id: string; price: string }[];
  time: string;
}

interface PaymentIntent {
  client_secret: string;
}

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
}

const fetchCurrentUser = async (): Promise<UserData> => {
  try {
    const response = await api.get("/users/me");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

const PaymentForm: React.FC<PaymentFormProps> = ({ calculateTotal, articleId, selectedServices, time }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [cardHolderName, setCardHolderName] = useState("");
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Fetch payment intent from your backend
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: calculateTotal() * 100, currency: "AED" }),
    })
      .then((res) => res.json())
      .then((data) => setPaymentIntent(data));

    // Fetch current logged-in user data
    fetchCurrentUser().then((user) => setCurrentUser(user));
  }, [calculateTotal]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !paymentIntent || !currentUser) {
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
        paymentIntent.client_secret,
        {
          payment_method: paymentMethod!.id,
        }
      );

      if (confirmationError) {
        console.error(confirmationError);
      } else {
        console.log("Payment successful!");

        // Calculate the remaining 80% of the total price
        const totalPrice = calculateTotal();
        const remainingPrice = totalPrice * 0.8;

        // Create the appointment after successful payment
        const appointmentData = {
          status: "published",
          article: articleId,
          services: {
            create: selectedServices.map((service) => ({
              appointments_id: "+",
              sub_services_id: {
                id: service.id,
              },
            })),
            update: [],
            delete: [],
          },
          time: time,
          price: remainingPrice,
          user_created: currentUser?.id, // Include the user's ID
        };

        try {
          const response = await api.post("/items/appointments", appointmentData);
          console.log("Appointment created:", response.data);
        } catch (error) {
          console.error("Error creating appointment:", error);
        }
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
