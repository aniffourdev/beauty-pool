// "use client";
// import React, { FormEvent, useEffect, useState } from "react";
// import Sidenav from "@/components/dynamic/Accounts/Business/Sidenav";
// import Header from "@/components/dynamic/Accounts/Business/Header/Header";
// import api from "@/services/auth";
// import { Gruppo } from "next/font/google";
// import { useRouter } from "next/navigation"; // Import the useRouter hook

// interface Category {
//   id: number;
//   label: string;
// }

// interface ServiceData {
//   name: string;
//   duration: number;
//   price: number;
//   description: string;
//   status: "published" | "draft";
//   categories: number;
//   price_type: "fixed" | "variable";
// }

// const gruppo = Gruppo({
//   subsets: ["latin"],
//   variable: "--font-geist-mono",
//   weight: "400",
// });

// const EditService = () => {
//   const router = useRouter();
//   const { query } = router;
//   const serviceId = query.id ? Number(query.id) : null;

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [formData, setFormData] = useState<ServiceData>({
//     name: "",
//     duration: 0,
//     price: 0,
//     description: "",
//     status: "published",
//     categories: 0,
//     price_type: "fixed",
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await api.get("users/me", {
//           params: {
//             fields: "category.Categorie_id.id,category.Categorie_id.label",
//           },
//         });

//         const categoryData = response.data.data.category.map((cat: any) => ({
//           id: cat.Categorie_id.id,
//           label: cat.Categorie_id.label,
//         }));

//         setCategories(categoryData);

//         if (categoryData.length > 0) {
//           setFormData((prev) => ({
//             ...prev,
//             categories: categoryData[0].id,
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     const fetchServiceData = async () => {
//       try {
//         if (serviceId) {
//           const response = await api.get(`items/Services/${serviceId}`);
//           setFormData({
//             name: response.data.name,
//             duration: response.data.duration,
//             price: response.data.price,
//             description: response.data.description,
//             status: response.data.status,
//             categories: response.data.categories[0].id, // Assuming categories is an array of objects
//             price_type: response.data.price_type,
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching service data:", error);
//       }
//     };

//     fetchCategories();
//     fetchServiceData();
//   }, [serviceId]);

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await api.patch(`items/Services/${serviceId}`, formData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.status === 200 || response.status === 201) {
//         alert("Service updated successfully!");
//         // Optionally, you can reset the form or redirect the user
//       }
//     } catch (error) {
//       console.error("Error updating service:", error);
//       alert("Failed to update service");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: ["duration", "categories", "price"].includes(name)
//         ? Number(value)
//         : value,
//     }));
//   };

//   return (
//     <div className="">
//       <Header />
//       <Sidenav />

//       <div className="ml-0 lg:ml-44 p-5 xl:pt-32 xl:pl-14 overflow-auto bg-slate-50 min-h-screen">
//         <div className="max-w-3xl mx-auto">
//           <form action="" onSubmit={handleSubmit}>
//             <div className="flex justify-between items-center mb-5">
//               <h2
//                 className={`${gruppo.className} text-4xl text-black font-bold`}
//               >
//                 Edit Service
//               </h2>
//               <button
//                 className="py-2 px-4 rounded bg-slate-900 text-white font-semibold"
//                 type="submit"
//                 disabled={loading}
//               >
//                 {loading ? "Saving..." : "Save"}
//               </button>
//             </div>
//             <div className="lg:flex gap-5">
//               <div className="lg:w-12/12">
//                 <div className="bg-white p-4 rounded-lg border border-slate-200">
//                   <h4 className="text-lg font-semibold pb-4 -ml-4 px-4 -mr-4 border-b border-slate-200 mb-4">
//                     Basic details
//                   </h4>
//                   <div className="grid grid-cols-1">
//                     <div className="mb-5">
//                       <label
//                         className="block text-gray-900 text-[13px] font-semibold mb-1"
//                         htmlFor="Servicename"
//                       >
//                         Service name
//                       </label>
//                       <input
//                         className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         type="text"
//                         id="Servicename"
//                         name="name"
//                         value={formData.name}
//                         autoComplete="off"
//                         onChange={handleChange}
//                         required
//                         placeholder="Enter service name"
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="mb-5">
//                       <label
//                         className="block text-gray-900 text-[13px] font-semibold mb-1"
//                         htmlFor="description"
//                       >
//                         Main category
//                       </label>
//                       <select
//                         id="categories"
//                         name="categories"
//                         value={formData.categories}
//                         onChange={handleChange}
//                         className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         required
//                       >
//                         {categories.map((category) => (
//                           <option key={category.id} value={category.id}>
//                             {category.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1">
//                     <div className="">
//                       <label
//                         className="block text-gray-900 text-[13px] font-semibold mb-1"
//                         htmlFor="description"
//                       >
//                         Description (Optional)
//                       </label>
//                       <textarea
//                         className="shadow min-h-28 max-h-28 appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         autoComplete="off"
//                         id="description"
//                         name="description"
//                         value={formData.description}
//                         onChange={handleChange}
//                         rows={3}
//                         placeholder="Enter service description"
//                       ></textarea>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-white p-4 rounded-lg border border-slate-200 mt-5 mb-10">
//                   <h4 className="text-lg font-semibold pb-4 -ml-4 px-4 -mr-4 border-b border-slate-200 mb-4">
//                     Pricing and duration
//                   </h4>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                     <div className="">
//                       <label
//                         className="block text-gray-900 text-[13px] font-semibold mb-1"
//                         htmlFor="Duration"
//                       >
//                         Duration
//                       </label>
//                       <select
//                         className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         id="duration"
//                         name="duration"
//                         value={formData.duration}
//                         onChange={handleChange}
//                         required
//                       >
//                         <option value="">Select duration</option>
//                         <option value="5">5min</option>
//                         <option value="10">10min</option>
//                         <option value="15">15min</option>
//                         <option value="20">20min</option>
//                         <option value="25">25min</option>
//                         <option value="30">30min</option>
//                         <option value="35">35min</option>
//                         <option value="40">40min</option>
//                         <option value="45">45min</option>
//                         <option value="50">50min</option>
//                         <option value="55">55min</option>
//                         <option value="60">1h</option>
//                         <option value="65">1h 5min</option>
//                         <option value="70">1h 10min</option>
//                         <option value="75">1h 15min</option>
//                         <option value="80">1h 20min</option>
//                         <option value="85">1h 25min</option>
//                         <option value="90">1h 30min</option>
//                         <option value="95">1h 35min</option>
//                         <option value="100">1h 40min</option>
//                         <option value="105">1h 45min</option>
//                         <option value="110">1h 50min</option>
//                         <option value="115">1h 55min</option>
//                         <option value="120">2h</option>
//                         <option value="135">2h 15min</option>
//                         <option value="150">2h 30min</option>
//                         <option value="165">2h 45min</option>
//                         <option value="180">3h</option>
//                         <option value="195">3h 15min</option>
//                         <option value="210">3h 30min</option>
//                         <option value="225">3h 45min</option>
//                         <option value="240">4h</option>
//                         <option value="270">4h 30min</option>
//                         <option value="300">5h</option>
//                         <option value="330">5h 30min</option>
//                         <option value="360">6h</option>
//                         <option value="390">6h 30min</option>
//                         <option value="420">7h</option>
//                         <option value="450">7h 30min</option>
//                         <option value="480">8h</option>
//                         <option value="540">9h</option>
//                         <option value="600">10h</option>
//                         <option value="660">11h</option>
//                         <option value="720">12h</option>
//                       </select>
//                     </div>
//                     <div className="">
//                       <label
//                         className="block text-gray-900 text-[13px] font-semibold mb-1"
//                         htmlFor="PriceType"
//                       >
//                         Price type
//                       </label>
//                       <select
//                         id="price_type"
//                         name="price_type"
//                         value={formData.price_type}
//                         onChange={handleChange}
//                         className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       >
//                         <option value="Free">Free</option>
//                         <option value="From">From</option>
//                         <option value="Fixed">Fixed</option>
//                       </select>
//                     </div>
//                     <div className="">
//                       <label
//                         className="block text-gray-900 text-[13px] font-semibold mb-1"
//                         htmlFor="Price"
//                       >
//                         Price
//                       </label>
//                       <input
//                         className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         type="number"
//                         id="price"
//                         name="price"
//                         value={formData.price}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditService;


import React from 'react'

const EditService = () => {
  return (
    <div>EditService</div>
  )
}

export default EditService