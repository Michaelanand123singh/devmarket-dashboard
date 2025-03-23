import { useState, useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";

function ContactList() {
   const [contacts, setContacts] = useState([]);

   useEffect(() => {
      fetchContacts();
   }, []);

   const fetchContacts = async () => {
      try {
         const response = await axios.get("http://localhost:8000/contact");
         setContacts(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (err) {
         console.error("Failed to fetch contacts", err);
      }
   };

   return (
      <div className="p-6 min-h-screen bg-gray-100">
         <TitleCard title="Contact List">
            <div className="overflow-x-auto">
               <table className="w-full table-auto border-collapse border border-gray-300">
                  <thead>
                     <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Email</th>
                        <th className="border border-gray-300 p-2">Project Details</th>
                        <th className="border border-gray-300 p-2">Attachment</th>
                        <th className="border border-gray-300 p-2">Created At</th>
                     </tr>
                  </thead>
                  <tbody>
                     {contacts.map((contact) => (
                        <tr key={contact._id} className="hover:bg-gray-100">
                           <td className="border border-gray-300 p-2">{contact.name}</td>
                           <td className="border border-gray-300 p-2">{contact.email}</td>
                           <td className="border border-gray-300 p-2">{contact.projectDetails}</td>
                           <td className="border border-gray-300 p-2">
                              {contact.attachment ? (
                                 <a 
                                    href={contact.attachment} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                 >
                                    View Attachment
                                 </a>
                              ) : (
                                 "N/A"
                              )}
                           </td>
                           <td className="border border-gray-300 p-2">
                              {new Date(contact.createdAt).toLocaleDateString()}
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

export default ContactList;