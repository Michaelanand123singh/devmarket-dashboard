import { useState, useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";

function PartnershipList() {
   const [brands, setBrands] = useState([]);
   const [newBrand, setNewBrand] = useState({ name: "", logo: null });

   useEffect(() => {
      fetchBrands();
   }, []);

   const fetchBrands = async () => {
      try {
         const response = await axios.get("http://localhost:8000/Brand");
         setBrands(response.data);
      } catch (err) {
         console.error("Failed to fetch brands", err);
      }
   };

   const deleteBrand = async (id) => {
      try {
         await axios.delete(`http://localhost:8000/Brand/delete/${id}`);
         setBrands(brands.filter((brand) => brand._id !== id));
      } catch (err) {
         console.error("Failed to delete brand", err);
      }
   };

   const createBrand = async (e) => {
      e.preventDefault();

      if (!newBrand.logo) {
         console.error("Please select an image.");
         return;
      }

      const imageData = new FormData();
      imageData.append("file", newBrand.logo);
      imageData.append("upload_preset", "marketdata");

      try {
         const cloudinaryResponse = await axios.post(
            "https://api.cloudinary.com/v1_1/de4ks8mkh/image/upload",
            imageData
         );

         const cloudinaryUrl = cloudinaryResponse.data.secure_url;

         const response = await axios.post("http://localhost:8000/Brand/createBrand", {
            name: newBrand.name,
            logoUrl: cloudinaryUrl
         });

         setBrands([...brands, response.data]);
         setNewBrand({ name: "", logo: null });
      } catch (err) {
         console.error("Failed to create brand", err);
      }
   };

   return (
      <div className="p-6 min-h-screen bg-gray-100">
         <TitleCard title="Partnership List">
            <form onSubmit={createBrand} className="mb-4 flex gap-4">
               <input 
                  type="text" 
                  placeholder="Brand Name" 
                  value={newBrand.name} 
                  onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })} 
                  className="border border-gray-300 p-2 rounded w-1/3" 
                  required 
               />
               <input 
                  type="file" 
                  onChange={(e) => setNewBrand({ ...newBrand, logo: e.target.files[0] })} 
                  className="border border-gray-300 p-2 rounded w-1/3" 
                  required 
               />
               <button 
                  type="submit" 
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
               >
                  Add Brand
               </button>
            </form>

            <div className="overflow-x-auto">
               <table className="w-full table-auto border-collapse border border-gray-300">
                  <thead>
                     <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Logo</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {brands.map((brand) => (
                        <tr key={brand._id} className="hover:bg-gray-100">
                           <td className="border border-gray-300 p-2">{brand.name}</td>
                           <td className="border border-gray-300 p-2">
                              <img src={brand.logoUrl} alt={brand.name} className="h-12 w-12 object-contain" />
                           </td>
                           <td className="border border-gray-300 p-2">
                              <button 
                                 onClick={() => deleteBrand(brand._id)}
                                 className="text-red-500 hover:underline"
                              >
                                 Delete
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </TitleCard>
      </div>
   );
}

export default PartnershipList;