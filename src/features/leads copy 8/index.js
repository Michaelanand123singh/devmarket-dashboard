import { useState, useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";

function TestimonialList() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const testimonialsPerPage = 6;
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [addingTestimonial, setAddingTestimonial] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    organization: "",
    message: "",
    photo: "",
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/testimonial/Testimonial"
      );
      setTestimonials(
        Array.isArray(response.data) ? response.data : [response.data]
      );
    } catch (err) {
      console.error("Failed to fetch testimonials", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/testimonial/${id}`
      );
      setTestimonials(
        testimonials.filter((testimonial) => testimonial._id !== id)
      );
    } catch (err) {
      console.error("Failed to delete testimonial", err);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      position: testimonial.position,
      organization: testimonial.organization,
      message: testimonial.message,
      photo: testimonial.photo,
    });
  };

  const handleUpdate = async () => {
    if (!editingTestimonial) return;
    try {
      await axios.put(
        `http://localhost:8000/testimonial/${editingTestimonial._id}`,
        formData
      );
      setEditingTestimonial(null);
      fetchTestimonials();
    } catch (err) {
      console.error("Failed to update testimonial", err);
    }
  };

  const handleAdd = async () => {
    if (!formData.photo) {
      alert("Please upload an image before submitting.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8000/testimonial/createTestimonail",
        formData
      );
      setAddingTestimonial(false);
      setFormData({
        name: "",
        position: "",
        organization: "",
        message: "",
        photo: "",
      }); // Reset form
      fetchTestimonials();
    } catch (err) {
      console.error("Failed to add testimonial", err);
    }
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
      setFormData((prev) => ({ ...prev, photo: response.data.secure_url }));
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  const indexOfLastTestimonial = currentPage * testimonialsPerPage;
  const indexOfFirstTestimonial = indexOfLastTestimonial - testimonialsPerPage;
  const currentTestimonials = testimonials.slice(
    indexOfFirstTestimonial,
    indexOfLastTestimonial
  );

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <TitleCard title="Testimonials List">
        <button
          onClick={() => setAddingTestimonial(true)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Add Testimonial
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTestimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className="border rounded-lg p-5 shadow-lg bg-white cursor-pointer hover:shadow-xl transition-all"
            >
              <img
                src={testimonial.photo}
                alt={testimonial.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-lg font-bold text-gray-800 mt-3">
                {testimonial.name}
              </h3>
              <p className="text-sm text-gray-600">{testimonial.position}</p>
              <p className="text-sm text-gray-600">
                {testimonial.organization}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {testimonial.message.substring(0, 100)}...
              </p>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(testimonial)}
                  className="px-3 py-1 bg-green-500 text-white rounded-md text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(testimonial._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </TitleCard>

      {/* Add Testimonial Modal */}
      {(addingTestimonial || editingTestimonial) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800">
              {editingTestimonial ? "Edit" : "Add"} Testimonial
            </h3>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 border rounded mt-2"
            />
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Position"
              className="w-full p-2 border rounded mt-2"
            />
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Organization"
              className="w-full p-2 border rounded mt-2"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              className="w-full p-2 border rounded mt-2"
            ></textarea>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded mt-2"
            />

            {formData.photo && (
              <img
                src={formData.photo}
                alt="Uploaded Preview"
                className="w-full h-32 object-cover mt-2 rounded-md"
              />
            )}

            <button
              onClick={editingTestimonial ? handleUpdate : handleAdd}
              className={`mt-4 w-full px-4 py-2 rounded-md ${
                formData.photo
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!formData.photo}
            >
              {editingTestimonial ? "Update" : "Add"}
            </button>
            <button
              onClick={() => {
                setEditingTestimonial(null);
                setAddingTestimonial(false);
              }}
              className="mt-2 w-full px-4 py-2 bg-gray-400 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestimonialList;
