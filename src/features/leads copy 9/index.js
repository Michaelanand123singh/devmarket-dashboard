import React, { useEffect, useState } from "react";
import axios from "axios";

const CarrierAccounting = () => {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/resume/resume");
      setResumes(response.data);
    } catch (err) {
      setError("Failed to fetch resumes");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-4 bg-gray-50 flex flex-col items-center justify-center">
      {isLoading && <p>Loading resumes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-7xl">
        <h3 className="text-lg font-semibold mb-4 text-center">Resumes</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 py-3 px-4 text-left">Name</th>
                <th className="border border-gray-300 py-3 px-4 text-left">Email</th>
                <th className="border border-gray-300 py-3 px-4 text-left">Phone</th>
                <th className="border border-gray-300 py-3 px-4 text-left">Position</th>
                <th className="border border-gray-300 py-3 px-4 text-left">Applied Date</th>
                <th className="border border-gray-300 py-3 px-4 text-left">Resume</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => (
                <tr key={resume._id} className="border-b border-gray-300">
                  <td className="border border-gray-300 py-3 px-4">{resume.name}</td>
                  <td className="border border-gray-300 py-3 px-4">{resume.email}</td>
                  <td className="border border-gray-300 py-3 px-4">{resume.phone}</td>
                  <td className="border border-gray-300 py-3 px-4">{resume.position}</td>
                  <td className="border border-gray-300 py-3 px-4">{new Date(resume.appliedAt).toLocaleDateString()}</td>
                  <td className="border border-gray-300 py-3 px-4">
                    <a href={resume.resumeLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      View Resume
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CarrierAccounting;
