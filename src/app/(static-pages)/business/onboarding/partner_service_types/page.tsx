import OnBoarding from "@/components/dynamic/Accounts/Business/OnBoarding";
import React from "react";

const PartnerServices: React.FC = () => {
  const initialData = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    device_id: "",
    business_name: "",
    // website: "",
    selectedCategories: [],
    business_address: "",
    noBusinessAddress: false,
  };

  return (
    <>
      <OnBoarding initialData={initialData} />
    </>
  );
};

export default PartnerServices;