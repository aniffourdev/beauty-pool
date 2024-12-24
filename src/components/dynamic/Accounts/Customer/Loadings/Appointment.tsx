import React from "react";

const Appointment = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Appointments</h2>
        <div className="flex flex-col">
          <div className="mb-4 border-b border-slate-200 pb-3">
            <h3 className="text-lg font-semibold mb-1.5">Upcoming</h3>
            <div className="skeleton w-full h-24 rounded mb-2"></div>
            <div className="skeleton w-full h-24 rounded mb-2"></div>
            <div className="skeleton w-full h-24 rounded mb-2"></div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1.5">Past</h3>
            <div className="skeleton w-full h-20 rounded mb-2"></div>
            <div className="skeleton w-full h-20 rounded mb-2"></div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-2/3 p-4 bg-white rounded-lg shadow-md ml-4"></div>
    </div>
  );
};

export default Appointment;
