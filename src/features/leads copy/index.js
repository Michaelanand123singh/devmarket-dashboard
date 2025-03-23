import React, { useEffect, useState } from "react";
import axios from "axios";

const FinanceAccounting = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingJob, setEditingJob] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [newJob, setNewJob] = useState({
    jobTitle: "",
    employmentType: "Remote", // Default value from enum
    keySkills: "",
    keyResponsibilities: "",
    applyLink: ""
  });
  const jobsPerPage = 5;

  // Employment type options based on the model's enum
  const employmentTypes = ["Remote", "Onsite", "Hybrid"];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/job/job");
      setJobs(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch jobs");
      console.error("Error fetching jobs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    try {
      await axios.delete(`http://localhost:8000/job/${jobId}`);
      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (err) {
      alert("Failed to delete job");
      console.error("Error deleting job:", err);
    }
  };

  const openEditModal = (job) => {
    setEditingJob({ 
      ...job, 
      keySkills: Array.isArray(job.keySkills) ? job.keySkills.join(", ") : "", 
      keyResponsibilities: Array.isArray(job.keyResponsibilities) ? job.keyResponsibilities.join("\n") : "" 
    });
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditingJob({ ...editingJob, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      // Validate employment type
      if (!employmentTypes.includes(editingJob.employmentType)) {
        alert("Invalid employment type. Must be Remote, Onsite, or Hybrid.");
        return;
      }

      const updatedJob = {
        ...editingJob,
        keySkills: editingJob.keySkills.split(",").map((skill) => skill.trim()).filter(skill => skill),
        keyResponsibilities: editingJob.keyResponsibilities.split("\n").map((resp) => resp.trim()).filter(resp => resp),
      };

      const response = await axios.put(`http://localhost:8000/job/${editingJob._id}`, updatedJob);
      
      // Update the job in the local state using the response data
      setJobs(jobs.map((job) => (job._id === editingJob._id ? response.data : job)));
      setEditModal(false);
    } catch (err) {
      alert("Failed to update job");
      console.error("Error updating job:", err);
    }
  };

  // Handle input changes for the new job form
  const handleNewJobChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  // Validate job data before submission
  const validateJobData = (jobData) => {
    if (!jobData.jobTitle.trim()) {
      alert("Job title is required");
      return false;
    }
    if (!employmentTypes.includes(jobData.employmentType)) {
      alert("Employment type must be Remote, Onsite, or Hybrid");
      return false;
    }
    if (jobData.keySkills.length === 0) {
      alert("At least one key skill is required");
      return false;
    }
    if (jobData.keyResponsibilities.length === 0) {
      alert("At least one key responsibility is required");
      return false;
    }
    if (!jobData.applyLink.trim()) {
      alert("Apply link is required");
      return false;
    }
    return true;
  };

  // Function to add a new job
  const addJob = async () => {
    try {
      // Format the data before sending
      const jobData = {
        ...newJob,
        keySkills: newJob.keySkills.split(",").map((skill) => skill.trim()).filter(skill => skill),
        keyResponsibilities: newJob.keyResponsibilities.split("\n").map((resp) => resp.trim()).filter(resp => resp),
      };

      // Validate the job data
      if (!validateJobData(jobData)) {
        return;
      }

      const response = await axios.post("http://localhost:8000/job/createJob", jobData);
      
      // Add the new job to the state and close the modal
      // Make sure to use the response data which includes the generated _id
      setJobs(prevJobs => [...prevJobs, response.data]);
      setAddModal(false);
      
      // Reset the new job form
      setNewJob({
        jobTitle: "",
        employmentType: "Remote",
        keySkills: "",
        keyResponsibilities: "",
        applyLink: ""
      });
    } catch (err) {
      alert("Failed to add job: " + (err.response?.data?.message || err.message));
      console.error("Error adding job:", err);
    }
  };

  const openAddModal = () => {
    setAddModal(true);
  };

  // Recalculate these values when jobs or currentPage changes
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  // Ensure current page is valid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="py-4 bg-gray-50 flex flex-col items-center justify-center">
      {isLoading && <p>Loading jobs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-7xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-center">Manage Jobs</h3>
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            onClick={openAddModal}
          >
            Add New Job
          </button>
        </div>

        {jobs.length === 0 && !isLoading ? (
          <p className="text-center py-4">No jobs found. Add a new job to get started.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 py-3 px-4 text-left text-sm font-medium text-gray-600">Job Title</th>
                    <th className="border border-gray-300 py-3 px-4 text-left text-sm font-medium text-gray-600">Employment Type</th>
                    <th className="border border-gray-300 py-3 px-4 text-left text-sm font-medium text-gray-600">Key Skills</th>
                    <th className="border border-gray-300 py-3 px-4 text-left text-sm font-medium text-gray-600">Responsibilities</th>
                    <th className="border border-gray-300 py-3 px-4 text-left text-sm font-medium text-gray-600">Apply</th>
                    <th className="border border-gray-300 py-3 px-4 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentJobs.map((job) => (
                    <tr key={job._id} className="border-b border-gray-300">
                      <td className="border border-gray-300 py-3 px-4 text-sm text-gray-800">{job.jobTitle}</td>
                      <td className="border border-gray-300 py-3 px-4 text-sm text-gray-800">{job.employmentType}</td>
                      <td className="border border-gray-300 py-3 px-4 text-sm text-gray-800">
                        {Array.isArray(job.keySkills) ? job.keySkills.join(", ") : ""}
                      </td>
                      <td className="border border-gray-300 py-3 px-4 text-sm text-gray-800">
                        <ul className="list-disc ml-4">
                          {Array.isArray(job.keyResponsibilities) ? 
                            job.keyResponsibilities.map((resp, index) => (
                              <li key={index}>{resp}</li>
                            )) : 
                            null
                          }
                        </ul>
                      </td>
                      <td className="border border-gray-300 py-3 px-4 text-sm text-gray-800">
                        <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          Apply Here
                        </a>
                      </td>
                      <td className="border border-gray-300 py-3 px-4 text-sm text-gray-800">
                        <div className="flex space-x-4">
                          <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => openEditModal(job)}>
                            Edit
                          </button>
                          <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => deleteJob(job._id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                <button 
                  className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50" 
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-gray-100 rounded-md">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50" 
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editModal && editingJob && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Job</h3>
            <input className="w-full p-2 border rounded mb-2" name="jobTitle" value={editingJob.jobTitle} onChange={handleEditChange} placeholder="Job Title" />
            
            <select 
              className="w-full p-2 border rounded mb-2" 
              name="employmentType" 
              value={editingJob.employmentType} 
              onChange={handleEditChange}
            >
              {employmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <input className="w-full p-2 border rounded mb-2" name="applyLink" value={editingJob.applyLink} onChange={handleEditChange} placeholder="Apply Link" />
            <textarea className="w-full p-2 border rounded mb-2" name="keySkills" value={editingJob.keySkills} onChange={handleEditChange} placeholder="Key Skills (comma-separated)" />
            <textarea className="w-full p-2 border rounded mb-2" name="keyResponsibilities" value={editingJob.keyResponsibilities} onChange={handleEditChange} placeholder="Responsibilities (one per line)" />
            <div className="flex justify-end space-x-4">
              <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={saveEdit}>Save</button>
              <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => setEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Job Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Job</h3>
            <input className="w-full p-2 border rounded mb-2" name="jobTitle" value={newJob.jobTitle} onChange={handleNewJobChange} placeholder="Job Title" required />
            
            <select 
              className="w-full p-2 border rounded mb-2" 
              name="employmentType" 
              value={newJob.employmentType} 
              onChange={handleNewJobChange}
              required
            >
              {employmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <input className="w-full p-2 border rounded mb-2" name="applyLink" value={newJob.applyLink} onChange={handleNewJobChange} placeholder="Apply Link" required />
            <textarea className="w-full p-2 border rounded mb-2" name="keySkills" value={newJob.keySkills} onChange={handleNewJobChange} placeholder="Key Skills (comma-separated)" required />
            <textarea className="w-full p-2 border rounded mb-2" name="keyResponsibilities" value={newJob.keyResponsibilities} onChange={handleNewJobChange} placeholder="Responsibilities (one per line)" required />
            <div className="flex justify-end space-x-4">
              <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={addJob}>Add Job</button>
              <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => setAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceAccounting;