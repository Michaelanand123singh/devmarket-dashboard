import { useState, useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";

function AboutList() {
   const [aboutData, setAboutData] = useState([]);
   const [formData, setFormData] = useState({
      title: "",
      description: "",
      image: ""
   });
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

   useEffect(() => {
      fetchAboutData();
   }, []);

   const fetchAboutData = async () => {
      try {
         const response = await axios.get("http://localhost:8000/about/getAbout");
         setAboutData(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (err) {
         console.error("Failed to fetch about data", err);
      }
   };

   const handleDelete = async (aboutId) => {
      try {
         await axios.delete(`http://localhost:8000/about/${aboutId}`);
         setAboutData(aboutData.filter((about) => about._id !== aboutId));
      } catch (err) {
         console.error("Failed to delete about data", err);
      }
   };

   const handleCreate = async () => {
      try {
         await axios.post("http://localhost:8000/about/createAbout", formData);
         setIsCreateModalOpen(false);
         resetFormData();
         fetchAboutData();
      } catch (err) {
         console.error("Failed to create about data", err);
      }
   };

   const resetFormData = () => {
      setFormData({ title: "", description: "", image: "" });
   };

   const openCreateModal = () => {
      resetFormData();
      setIsCreateModalOpen(true);
   };

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const imageData = new FormData();
      imageData.append("file", file);
      imageData.append("upload_preset", "marketdata");

      try {
         const response = await axios.post(
            "https://api.cloudinary.com/v1_1/de4ks8mkh/image/upload",
            imageData
         );
         setFormData((prev) => ({ ...prev, image: response.data.secure_url }));
      } catch (err) {
         console.error("Image upload failed", err);
      }
   };

   return (
      <div className="p-6 min-h-screen bg-gray-100">
         <TitleCard title="About Us">
            <div className="mb-6">
               <button 
                  onClick={openCreateModal}
                  className="px-4 py-2 bg-green-500 text-white rounded-md"
               >
                  Add New About Info
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {aboutData.map((about) => (
                  <div 
                     key={about._id} 
                     className="border rounded-lg p-5 shadow-lg bg-white hover:shadow-xl transition-all"
                  >
                     <img 
                        src={about.image} 
                        alt={about.title} 
                        className="w-full h-40 object-cover rounded-md"
                     />
                     <h3 className="text-lg font-bold text-gray-800 mt-3">{about.title}</h3>
                     <p className="text-sm text-gray-600 mt-2">{about.description}</p>

                     <div className="mt-4 flex justify-end">
                        <button 
                           onClick={() => handleDelete(about._id)}
                           className="px-4 py-2 bg-red-500 text-white rounded-md"
                        >
                           Delete
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </TitleCard>

         {/* Create About Modal */}
         {isCreateModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
               <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-800">Add New About Info</h3>
                  <input 
                     type="text" 
                     name="title"
                     value={formData.title} 
                     onChange={handleChange} 
                     className="w-full mt-2 p-2 border rounded"
                     placeholder="Title"
                  />
                  <textarea 
                     name="description"
                     value={formData.description} 
                     onChange={handleChange} 
                     className="w-full mt-2 p-2 border rounded"
                     placeholder="Description"
                  ></textarea>
                  <input 
                     type="file" 
                     accept="image/*" 
                     onChange={handleImageUpload} 
                     className="w-full p-2 border rounded mt-2"
                  />

                  {formData.image && (
                     <img src={formData.image} alt="Preview" className="w-full h-32 object-cover mt-2 rounded-md" />
                  )}

                  <div className="mt-4 flex justify-between">
                     <button onClick={handleCreate} className="px-4 py-2 bg-green-500 text-white rounded-md">Save</button>
                     <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 bg-red-500 text-white rounded-md">Cancel</button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

export default AboutList;