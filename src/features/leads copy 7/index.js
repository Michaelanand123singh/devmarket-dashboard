import { useState, useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";

function ServiceList() {
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const servicesPerPage = 6;

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("https://devmarketbackend-1.onrender.com/product/Product");
      setServices(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (err) {
      console.error("Failed to fetch services", err);
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      await axios.delete(`https://devmarketbackend-1.onrender.com/product/${serviceId}`);
      setServices(services.filter((service) => service._id !== serviceId));
    } catch (err) {
      console.error("Failed to delete service", err);
    }
  };

  const handleEdit = (service) => {
    setSelectedService(service);
  };

  const handleUpdate = async (values) => {
    try {
      await axios.put(`https://devmarketbackend-1.onrender.com/product/${selectedService._id}`, values);
      setSelectedService(null);
      fetchServices();
    } catch (err) {
      console.error("Failed to update service", err);
    }
  };

  const handleCreate = async (values) => {
    try {
      await axios.post("https://devmarketbackend-1.onrender.com/product/creatProducts", values);
      setIsCreateModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error("Failed to create service", err);
    }
  };

  const handleImageUpload = async (setFieldValue, files) => {
    if (!files || files.length === 0) return;

    const uploadedImages = [];

    for (const file of files) {
      const imageData = new FormData();
      imageData.append("file", file);
      imageData.append("upload_preset", "marketdata");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/de4ks8mkh/image/upload",
          imageData
        );
        uploadedImages.push(response.data.secure_url);
      } catch (err) {
        console.error("Image upload failed for", file.name, err);
      }
    }

    setFieldValue("images", uploadedImages);
  };

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);

  const ServiceFormModal = ({ title, onSubmit, isOpen }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <Formik
            initialValues={{
              name: selectedService ? selectedService.name : "",
              category: selectedService ? selectedService.category : "",
              description: selectedService ? selectedService.description : "",
              images: selectedService ? selectedService.images : [],
              price: selectedService ? selectedService.price : "",
              liveLink: selectedService ? selectedService.liveLink : "",
            }}
            onSubmit={selectedService ? handleUpdate : handleCreate}
          >
            {({ setFieldValue }) => (
              <Form>
                <Field
                  type="text"
                  name="name"
                  className="w-full mt-2 p-2 border rounded"
                  placeholder="Product Name"
                />
                <Field
                  type="text"
                  name="category"
                  className="w-full mt-2 p-2 border rounded"
                  placeholder="Category"
                />
                <Field
                  type="text"
                  name="price"
                  className="w-full mt-2 p-2 border rounded"
                  placeholder="Enter Price"
                />
                <Field
                  type="text"
                  name="liveLink"
                  className="w-full mt-2 p-2 border rounded"
                  placeholder="Enter Live Link"
                />
                <Field
                  as="textarea"
                  name="description"
                  className="w-full mt-2 p-2 border rounded"
                  placeholder="Description"
                ></Field>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(setFieldValue, e.target.files)}
                  multiple
                  className="w-full p-2 border rounded mt-2"
                />
                <div className="mt-4 flex justify-between">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <TitleCard title="Product List">
        <div className="mb-6">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Add New Products
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentServices.map((service) => (
            <div
              key={service._id}
              className="border rounded-lg p-5 shadow-lg bg-white hover:shadow-xl transition-all"
            >
              <img
                src={service.images[0]}
                alt={service.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-lg font-bold text-gray-800 mt-3">
                {service.name}
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Category:</strong> {service.category}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {service.description}
              </p>
              <p className="mt-2 text-sm font-medium text-gray-700">
                Price:{" "}
                <span className="text-lg font-semibold text-gray-900">
                  ₹{service.price}
                </span>
              </p>

              <a
                href={service.liveLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="px-4 py-2 mt-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
                  Live Link
                </button>
              </a>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(service)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">Page {currentPage}</span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                indexOfLastService < services.length ? prev + 1 : prev
              )
            }
            disabled={indexOfLastService >= services.length}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </TitleCard>

      <ServiceFormModal
        title="Add New Service"
        isOpen={isCreateModalOpen}
      />

      <ServiceFormModal
        title="Edit Service"
        isOpen={!!selectedService}
      />
    </div>
  );
}

export default ServiceList;