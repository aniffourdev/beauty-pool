"use client";
import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { BsArrowLeft, BsCheck, BsPlus } from "react-icons/bs";
import { GoChevronRight } from "react-icons/go";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/dynamic/Book/Forms/PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import Visa from "../../../../../public/assets/payments/visa.svg";
import Mastercard from "../../../../../public/assets/payments/mastercard.svg";
import Discover from "../../../../../public/assets/payments/discover.svg";
import AmericanExpress from "../../../../../public/assets/payments/american-express.svg";
import { IoStar } from "react-icons/io5";

interface Review {
  date_created: string;
  rating: number;
  comment: string;
  article: number;
}

interface Article {
  id: string;
  label: string;
  description: string;
  reviews: Review[];
  featured_image: string;
  location: string;
}

interface SubService {
  name: string;
  description: string;
  price: string;
  duration: string;
}

interface ParentService {
  name: string;
  description: string;
  sub_services: SubService[];
}

interface Service {
  id: string;
  parent_service: ParentService;
}

interface BookingStepsProps {
  article: Article;
  services: Service[];
  onClose: () => void;
}

const stripePromise = loadStripe(
  "pk_test_51PqnMzCMCpxFz40MVwOUjcuR9TIEwHGKXk7G9SLptwqTq6RaC2EhUDa4QICmWgG6aPqihsjszOmHLq7F5MjwzoSC00HCbYjVe9"
);

const BookingSteps: React.FC<BookingStepsProps> = ({
  article,
  services,
  onClose,
}: BookingStepsProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<SubService[]>([]);
  const [savedServices, setSavedServices] = useState<SubService[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      ".service-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
    );
  }, []);

  useEffect(() => {
    if (currentStep === 3) {
      const timer = setTimeout(() => {
        setIsModalOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleServiceClick = (subService: SubService) => {
    if (selectedServices.some((s) => s.name === subService.name)) {
      setSelectedServices(
        selectedServices.filter((s) => s.name !== subService.name)
      );
    } else {
      setSelectedServices([...selectedServices, subService]);
    }
  };

  const handleContinue = () => {
    if (selectedServices.length > 0) {
      setSavedServices(selectedServices);
      setCurrentStep(2);
    }
  };

  const renderServices = () => {
    return services.map((service, index) => (
      <div key={index} className="mb-4">
        <h3 className="font-bold mb-2">{service.parent_service.name}</h3>
        {service.parent_service.sub_services.map((subService, subIndex) => (
          <div
            key={subIndex}
            className="service-card p-4 border rounded-lg flex justify-between items-center mb-2"
          >
            <div className="flex justify-start items-center gap-5">
              <div>
                <p className="mask mask-squircle font-bold text-md h-14 w-14 bg-red-100 text-red-700 flex justify-center items-center">
                  €{subService.price}
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-1">{subService.name}</h3>
                <p className="text-[13px] mb-1 text-gray-500">
                  {subService.duration}min
                </p>
                {subService.description && (
                  <p className="text-sm text-gray-500">
                    {subService.description}
                  </p>
                )}
              </div>
            </div>
            <button
              className="text-2xl text-gray-500"
              onClick={() => handleServiceClick(subService)}
            >
              {selectedServices.some((s) => s.name === subService.name) ? (
                <BsCheck className="text-green-500 size-8" />
              ) : (
                <BsPlus className="text-slate-600 size-8" />
              )}
            </button>
          </div>
        ))}
      </div>
    ));
  };

  const renderSelectedServices = () => {
    return selectedServices.map((subService, index) => (
      <div key={index} className="pb-4 border-b mb-4">
        <h3 className="font-bold">{subService.name}</h3>
        <p className="text-sm text-gray-500">{subService.duration}</p>
        {subService.description && (
          <p className="text-sm text-gray-500">{subService.description}</p>
        )}
        <p className="font-bold">€{subService.price}</p>
      </div>
    ));
  };

  const calculateTotal = () => {
    return selectedServices.reduce(
      (total, subService) =>
        total + parseFloat(String(subService.price).replace("€", "")),
      0
    );
  };

  const calculateDiscountedTotal = () => {
    const total = calculateTotal();
    return total * 0.2;
  };

  // Render different steps
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col lg:flex-row p-4 lg:p-8">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <BsArrowLeft
                  className="size-7 text-black cursor-pointer"
                  onClick={onClose}
                />
              </div>
              <div className="text-sm text-gray-500 mb-2">
                <span className="mr-1.5 font-semibold text-black">
                  Services
                </span>
                <GoChevronRight className="inline" />
                <span className="ml-1.5 mr-1.5">Time</span>
                <GoChevronRight className="inline" />
                <span className="ml-1.5 text-sm text-gray-500 mb-2">
                  Payments
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-7 mt-4">Select services</h1>
              <div className="space-y-4">{renderServices()}</div>
            </div>
            <div className="w-full lg:w-1/3 lg:ml-8 mt-8 lg:mt-0">
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <img
                    src={`https://maoulaty.shop/assets/${article.featured_image}`}
                    alt={article.label}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold">{article.label}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-1">4.9</span>
                      <div className="flex ml-2 text-yellow-500">
                        <IoStar />
                        <IoStar />
                        <IoStar />
                        <IoStar />
                        <IoStar />
                      </div>
                      <span className="ml-1">(4,749)</span>
                    </div>
                    <p className="text-sm text-gray-500">{article.location}</p>
                  </div>
                </div>
                {selectedServices.length > 0 ? (
                  <div>{renderSelectedServices()}</div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">
                    No services selected
                  </p>
                )}
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-green-500">
                    €{calculateTotal()}
                  </span>
                </div>
                <button
                  className="w-full py-2.5 font-semibold bg-black text-white rounded-lg"
                  disabled={selectedServices.length === 0}
                  onClick={handleContinue}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <>
            <div className="flex flex-col lg:flex-row p-4 lg:p-8">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <BsArrowLeft
                    className="size-7 text-black cursor-pointer"
                    onClick={() => setCurrentStep(1)}
                  />
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  <span className="mr-1.5">Services</span>
                  <GoChevronRight className="inline" />
                  <span className="ml-1.5 mr-1.5 font-semibold text-black">
                    Time
                  </span>
                  <GoChevronRight className="inline" />
                  <span className="ml-1.5 text-sm text-gray-500 mb-2">
                    Payments
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-7 mt-20">THIS IS TIME</h1>
              </div>
              <div className="w-full lg:w-1/3 lg:ml-8 mt-8 lg:mt-0">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <img
                      src={`https://maoulaty.shop/assets/${article.featured_image}`}
                      alt={article.label}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-bold">{article.label}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-1">4.9</span>
                        <div className="flex ml-2 text-yellow-500">
                          <IoStar />
                          <IoStar />
                          <IoStar />
                          <IoStar />
                          <IoStar />
                        </div>
                        <span className="ml-1">(4,749)</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {article.location}
                      </p>
                    </div>
                  </div>
                  {savedServices.map((subService, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center space-y-2"
                    >
                      <p>{subService.name}</p>{" "}
                      <p className="font-bold">€{subService.price}</p>
                    </div>
                  ))}
                  <div className="mb-4 mt-5 border-t border-slate-300 pt-5">
                    <div className="h-48">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-green-500">
                          €{calculateTotal()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="w-full py-2.5 font-semibold bg-black text-white rounded-lg"
                    disabled={selectedServices.length === 0}
                    onClick={() => setCurrentStep(3)}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <div className="flex flex-col lg:flex-row p-4 lg:p-8">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <BsArrowLeft
                  className="size-7 text-black cursor-pointer"
                  onClick={() => setCurrentStep(2)}
                />
              </div>
              <div className="text-sm text-gray-500 mb-2">
                <span className="mr-1.5">Services</span>
                <GoChevronRight className="inline" />
                <span className="ml-1.5 mr-1.5">Time</span>
                <GoChevronRight className="inline" />
                <span className="font-semibold text-black ml-1.5">
                  Payments
                </span>
              </div>
              <h2 className="text-3xl text-black mb-1 mt-8 font-bold">
                Payment method
              </h2>
              <p className="mb-3 text-sm">
                You won&apos;t be charged now, payment will be collected in
                store after your appointment
              </p>
              <div className="mt-16">
                <Elements stripe={stripePromise}>
                  <PaymentForm calculateTotal={calculateTotal} />
                </Elements>
                <div className="flex justify-start items-center gap-2 mt-5 mb">
                  <div className="text-sm">Pay securely with:</div>
                  <div className="flex justify-start items-center gap-1.5">
                    <div>
                      <Image src={Visa} alt="Visa" width={30} height={20} />
                    </div>
                    <div>
                      <Image
                        src={Mastercard}
                        alt="Mastercard"
                        width={30}
                        height={20}
                      />
                    </div>
                    <div>
                      <Image
                        src={Discover}
                        alt="Discover"
                        width={30}
                        height={20}
                      />
                    </div>
                    <div>
                      <Image
                        src={AmericanExpress}
                        alt="American Express"
                        width={30}
                        height={20}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-8 mt-10">
                  <h4 className="text-lg text-black font-semibold mb-1">
                    Cancellation Policy:
                  </h4>
                  <p className="text-slate-700 font-medium text-sm max-w-[700px]">
                    Cancel for free up to 24 hours before your appointment.
                    Cancellations made less than 24 hours in advance will incur
                    a fee of 30% of the service price. No-shows will be charged
                    50% of the service price.
                  </p>
                </div>
                <div className="mb-8">
                  <h4 className="text-lg text-black font-semibold mb-1">
                    Important Information
                  </h4>
                  <p className="text-slate-700 font-medium text-sm max-w-[700px]">
                    Please ensure you are aware of the service you&apos;re
                    booking to help with accurate timing. If you have any
                    questions, feel free to contact David, David, or myself.
                  </p>
                  <p className="text-slate-700 font-medium text-sm max-w-[700px]">
                    We understand that cancellations may occur, but we kindly
                    ask that you provide us with as much notice as possible.
                    Thank you.
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="text-lg text-black font-semibold mb-2">
                    Booking notes
                  </h4>
                  <textarea
                    className="w-full h-36 max-h-36 min-h-36 p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#f657a175]"
                    placeholder="Include comments or requests about your booking"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/3 lg:ml-8 mt-8 lg:mt-0">
              <div className="border rounded-lg p-4 sticky top-0">
                <div className="flex items-center mb-4">
                  <img
                    src={`https://maoulaty.shop/assets/${article.featured_image}`}
                    alt={article.label}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold">{article.label}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-1">4.9</span>
                      <div className="flex ml-2 text-yellow-500">
                        <IoStar />
                        <IoStar />
                        <IoStar />
                        <IoStar />
                        <IoStar />
                      </div>
                      <span className="ml-1">(4,749)</span>
                    </div>
                    <p className="text-sm text-gray-500">{article.location}</p>
                  </div>
                </div>
                {savedServices.map((subService, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center space-y-2"
                  >
                    <p>{subService.name}</p>{" "}
                    <p className="font-bold">€{subService.price}</p>
                  </div>
                ))}
                <div className="mb-4 mt-5 border-t border-slate-300 pt-5">
                  <div className="h-26">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total</span>
                      <div>
                        <span className="line-through text-gray-500">
                          €{calculateTotal()}
                        </span>
                        <span className="font-bold text-green-500 ml-2">
                          €{calculateDiscountedTotal()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderStep()}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold">I WILL TAKE 20%</p>
            <button
              className="mt-4 py-2 px-4 bg-black text-white rounded-lg"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSteps;
