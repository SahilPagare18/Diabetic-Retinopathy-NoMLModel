import React, { useState, useEffect, useMemo } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSave, FiXCircle, FiSun } from 'react-icons/fi';
import { FaMoon } from 'react-icons/fa'; // Correct import for FaMoon

const Recommend = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedRecord, setEditedRecord] = useState(null);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  // Apply theme to document
  useEffect(() => {
    const element = document.documentElement;
    if (theme === "dark") {
      element.classList.add("dark");
    } else {
      element.classList.remove("dark");
    }
    localStorage.setItem("theme", theme); // Persist theme in localStorage
  }, [theme]);

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/patients');
        if (!response.ok) throw new Error('Failed to fetch patients');
        const data = await response.json();
        console.log(data);
        setRecords(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError(error.message);
      }
    };
    fetchPatients();
  }, []);

  // Handle CRUD Operations
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        console.log('Deleting record with patientId:', id);
        const response = await fetch(`http://localhost:5000/api/patients/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete patient: ${response.status} - ${errorText}`);
        }
        const result = await response.json();
        console.log('Delete response:', result);
        setRecords(records.filter((record) => record._id !== id));
        setError(null);
      } catch (error) {
        console.error('Error deleting patient:', error.message);
        setError(error.message);
      }
    }
  };

  const handleUpdateStart = (record) => {
    setEditingId(record._id);
    setEditedRecord({ ...record });
  };

  const handleUpdateSave = async () => {
    try {
      console.log('Updating record with ID:', editingId);
      console.log('Updated data:', editedRecord);
      const response = await fetch(`http://localhost:5000/api/patients/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedRecord),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update patient: ${response.status} - ${errorText}`);
      }
      const updatedRecord = await response.json();
      console.log('Server response:', updatedRecord);
      setRecords(records.map(record => record._id === editingId ? updatedRecord : record));
      setEditingId(null);
      setEditedRecord(null);
      setError(null);
    } catch (error) {
      console.error('Error updating patient:', error.message);
      setError(error.message);
    }
  };

  const handleUpdateCancel = () => {
    setEditingId(null);
    setEditedRecord(null);
    setError(null);
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setEditedRecord(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return { ...prev, [parent]: { ...prev[parent], [child]: value } };
      }
      return { ...prev, [field]: value };
    });
  };

  // Memoized Filtering for Performance
  const filteredRecords = useMemo(() => {
    return records.filter(record =>
      (record.patientData?.patientId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (record.patientData?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (record.diseaseStage?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (record.patientData?.date?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  // Render UI
  return (
    <div className={`p-4 sm:p-6 lg:p-8 min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="max-w-7xl mx-auto relative">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full shadow-md transition-all dark:bg-gray-300 text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-50"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <FiSun size={15} /> : <FaMoon size={15} />}
        </button>

        <h1 className={`text-3xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>User Management Dashboard</h1>

        {/* Header with Search and Add Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
          <input
            type="text"
            placeholder="Search records..."
            className={`w-full sm:w-72 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors ${theme === "dark" ? "bg-indigo-500 text-white" : "bg-indigo-600 text-white"}`}
          >
            <FiPlus size={18} />
            Add New Record
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Table Container */}
        <div className={`shadow-lg rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Patient ID</th>
                  <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Name</th>
                  <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Disease Stage</th>
                  <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Date</th>
                  <th className={`px-6 py-3 text-center text-xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`${theme === "dark" ? "bg-gray-800 divide-gray-700" : "bg-white divide-gray-200"}`}>
                {filteredRecords.map((record) => (
                  <tr key={record._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>
                      {editingId === record._id ? (
                        <input
                          type="text"
                          value={editedRecord.patientData?.patientId || ''}
                          onChange={(e) => handleInputChange(e, 'patientData.patientId')}
                          className={`px-2 py-1 border rounded-md w-full ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                        />
                      ) : (
                        record.patientData?.id || 'N/A'
                      )}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>
                      {editingId === record._id ? (
                        <input
                          type="text"
                          value={editedRecord.patientData?.name || ''}
                          onChange={(e) => handleInputChange(e, 'patientData.name')}
                          className={`px-2 py-1 border rounded-md w-full ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                        />
                      ) : (
                        record.patientData?.name || 'N/A'
                      )}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      {editingId === record._id ? (
                        <input
                          type="text"
                          value={editedRecord.diseaseStage || ''}
                          onChange={(e) => handleInputChange(e, 'diseaseStage')}
                          className={`px-2 py-1 border rounded-md w-full ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                        />
                      ) : (
                        record.diseaseStage || 'N/A'
                      )}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      {editingId === record._id ? (
                        <input
                          type="text"
                          value={editedRecord.patientData?.date || ''}
                          onChange={(e) => handleInputChange(e, 'patientData.date')}
                          className={`px-2 py-1 border rounded-md w-full ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                        />
                      ) : (
                        record.patientData?.date || 'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-4">
                        {editingId === record._id ? (
                          <>
                            <button
                              onClick={handleUpdateSave}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                              aria-label="Save"
                            >
                              <FiSave size={18} />
                            </button>
                            <button
                              onClick={handleUpdateCancel}
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                              aria-label="Cancel"
                            >
                              <FiXCircle size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleUpdateStart(record)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                              aria-label="Update record"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(record._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                              aria-label="Delete record"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {filteredRecords.length === 0 && (
          <p className={`text-center mt-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            {searchTerm ? 'No records match your search.' : 'No records available.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Recommend;