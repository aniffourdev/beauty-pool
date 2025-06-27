import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "@/services/auth";
import { Alert, AlertDescription, AlertTitle } from "@/app/ui/alert";
import { PiCoins } from "react-icons/pi";
import { IoCheckmark, IoCloseOutline } from "react-icons/io5";

interface PaymentFormProps {
  calculateTotal: () => number;
  articleId: string;
  selectedServices: { id: string; price: string }[];
  time: string;
  date: string;
  setPaymentSuccess: (success: boolean) => void; // Add setPaymentSuccess prop
}

interface PaymentIntent {
  client_secret: string;
}

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  points: number;
}

interface Switcher3Props {
  isChecked: boolean;
  onChange: () => void;
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

const Switcher3 = ({ isChecked, onChange }: Switcher3Props) => {
  return (
    <label className="flex cursor-pointer select-none items-center">
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
          className="sr-only"
        />
        <div className="block h-5 w-10 rounded-full bg-teal-200"></div>
        <div
          className={`dot absolute left-1 top-0.5 flex h-4 w-4 items-center justify-center rounded-full transition ${
            isChecked ? "bg-green-800 translate-x-4" : "bg-white"
          }`}
        >
          {isChecked ? (
            <IoCheckmark className="text-white size-3" />
          ) : (
            <IoCloseOutline className="text-body-color size-3" />
          )}
        </div>
      </div>
    </label>
  );
};

const PaymentForm: React.FC<PaymentFormProps> = ({
  calculateTotal,
  articleId,
  selectedServices,
  time,
  date,
  setPaymentSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(
    null
  );
  const [cardHolderName, setCardHolderName] = useState("");
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [usePoints, setUsePoints] = useState(false); // Add state to track if points are used

  useEffect(() => {
    // Fetch payment intent from your backend
    const fetchPaymentIntent = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: calculateTotal() * 100,
            currency: "$",
          }),
        });
        const data = await response.json();
        setPaymentIntent(data);
      } catch (error) {
        console.error("Error fetching payment intent:", error);
      }
    };

    // Fetch current logged-in user data
    const fetchUserData = async () => {
      try {
        const user = await fetchCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchPaymentIntent();
    fetchUserData();
  }, [calculateTotal]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !paymentIntent || !currentUser) {
      return;
    }

    setIsLoading(true); // Set loading state to true

    if (usePoints) {
      // Handle payment using points
      try {
        // Create the appointment
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
          date: date,
          sales: 0, // Use 'sales' instead of 'price'
          user_created: currentUser?.id,
        };

        const response = await api.post("/items/appointments", appointmentData);
        console.log("Appointment created:", response.data);

        // Create the item in the clients collection
        const clientItemData = {
          article: articleId,
          sales: 0,
          card_type: "Points",
        };

        const clientResponse = await api.post("items/clients", clientItemData);
        console.log("Client item created:", clientResponse.data);

        // Create the client entry
        const clientData = {
          ...appointmentData,
          card_type: "Points",
          sales: 0, // Include the total price in the client data
        };

        await api.post("/items/clients", clientData);
        console.log("Client entry created");

        // Deduct points from the user
        const newPoints = Math.round(currentUser.points - calculateTotal());
        await api.patch(`/users/${currentUser.id}`, { points: newPoints });
        console.log("Points deducted");

        // Show success alert
        setShowSuccessAlert(true);

        // Optionally hide the alert after some time
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);

        // Set payment success to true
        setPaymentSuccess(true);

        setIsLoading(false); // Set loading state to false
      } catch (error) {
        console.error("Error in payment process:", error);
        setIsLoading(false); // Set loading state to false
      }
    } else {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        console.error("Card element not found");
        setIsLoading(false); // Set loading state to false
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: cardHolderName,
        },
      });

      if (error) {
        console.error(error);
        setIsLoading(false); // Set loading state to false
      } else {
        const {
          error: confirmationError,
          paymentIntent: confirmedPaymentIntent,
        } = await stripe.confirmCardPayment(paymentIntent.client_secret, {
          payment_method: paymentMethod!.id,
        });

        if (confirmationError) {
          console.error(confirmationError);
          setIsLoading(false); // Set loading state to false
        } else {
          console.log("Payment successful!");

          // Capture payment details
          const paymentDetails = {
            status: "published",
            article: articleId,
            card_type: paymentMethod.card?.brand,
            last4: paymentMethod.card?.last4,
            exp_month: paymentMethod.card?.exp_month,
            exp_year: paymentMethod.card?.exp_year,
          };

          try {
            // Send payment details to API
            await api.post("/items/payments_history", paymentDetails);
            console.log("Payment details sent to API");

            // Calculate the remaining 80% of the total price
            const totalPrice = calculateTotal();
            const remainingPrice = totalPrice * 0.8;

            // Create the appointment
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
              date: date,
              sales: remainingPrice, // Use 'sales' instead of 'price'
              user_created: currentUser?.id,
            };

            const response = await api.post(
              "/items/appointments",
              appointmentData
            );
            console.log("Appointment created:", response.data);

            // Create the item in the clients collection
            const clientItemData = {
              article: articleId,
              sales: totalPrice,
              card_type: paymentMethod.card?.brand,
            };

            const clientResponse = await api.post(
              "items/clients",
              clientItemData
            );
            console.log("Client item created:", clientResponse.data);

            // Create the client entry
            const clientData = {
              ...appointmentData,
              card_type: paymentMethod.card?.brand,
              sales: totalPrice, // Include the total price in the client data
            };

            await api.post("/items/clients", clientData);
            console.log("Client entry created");

            // Update user points
            const newPoints = Math.round(
              (currentUser.points || 0) + totalPrice
            );
            await api.patch(`/users/${currentUser.id}`, { points: newPoints });
            console.log("Points updated");

            // Show success alert
            setShowSuccessAlert(true);

            // Optionally hide the alert after some time
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 5000);

            // Set payment success to true
            setPaymentSuccess(true);

            setIsLoading(false); // Set loading state to false
          } catch (error) {
            console.error("Error in payment process:", error);
            setIsLoading(false); // Set loading state to false
          }
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      {showSuccessAlert && (
        <Alert className="mb-4">
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>DRISS BK TOLD ME YOU NEED LA BASE</AlertDescription>
        </Alert>
      )}

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
          disabled={!stripe || isLoading || usePoints}
          className={`w-full py-3 font-semibold bg-black text-white rounded-lg ${
            usePoints ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Processing..." : `Pay ${calculateTotal()} $`}
        </button>
        {currentUser?.points! >= 1000 && (
          <div className="mt-4 p-4 bg-teal-100 border border-teal-300 rounded-lg text-teal-700">
            <p className="font-semibold">
              <PiCoins className="inline size-6 relative -top-[1.5px] mr-0.5" />{" "}
              Congratulations! You've earned over 1000 points, so you can now
              pay using your points.
            </p>
            <div className="mt-2 flex items-center">
              <Switcher3
                isChecked={usePoints}
                onChange={() => setUsePoints(!usePoints)}
              />
              <label htmlFor="usePoints" className="text-sm ml-2">
                Use points to pay
              </label>
            </div>
            <button
              type="button"
              onClick={() => setUsePoints(true)}
              disabled={!usePoints}
              className={`mt-6 w-full py-3 font-semibold bg-black text-white rounded-lg ${
                !usePoints ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Pay using points
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PaymentForm;
