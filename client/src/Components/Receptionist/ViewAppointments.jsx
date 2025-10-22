import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaEdit, FaSun, FaMoon } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/themeSlice";

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/appointmentdetails");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleArchive = async (id) => {
    if (!window.confirm("Are you sure you want to archive this record?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/appointment/archive/${id}`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to archive appointment.");
      setAppointments((prev) => prev.filter((a) => a._id !== id));
      toast.success("Appointment archived successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditClick = (appointment) => {
    setEditingAppointment({
      ...appointment,
      appointmentDate: new Date(appointment.appointmentDate).toLocaleDateString("en-CA"),
    });
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/appointment/update/${editingAppointment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAppointment),
      });
      if (!res.ok) throw new Error("Failed to update appointment.");
      const updated = await res.json();
      setAppointments((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
      toast.success("Appointment updated!");
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString("en-CA") : "N/A");

  const StatusBadge = ({ status }) => {
    const color =
      status === "Completed"
        ? "bg-green-500/20 text-green-400"
        : status === "Cancelled"
        ? "bg-red-500/20 text-red-400"
        : "bg-yellow-500/20 text-yellow-400";
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{status}</span>;
  };

  const ReasonBadge = ({ reason }) => {
    const color =
      reason?.toLowerCase().includes("follow")
        ? "bg-blue-500/20 text-blue-400"
        : reason?.toLowerCase().includes("new")
        ? "bg-purple-500/20 text-purple-400"
        : "bg-gray-500/20 text-gray-400";
    return (
      <span
        className={`px-4 py-1 rounded-full text-xs font-semibold capitalize ${color} whitespace-nowrap`}
      >
        {reason}
      </span>
    );
  };

  if (loading)
    return <div className="flex justify-center items-center h-screen text-lg text-blue-500">Loading appointments...</div>;
  if (error)
    return <div className="text-center mt-20 text-red-500 text-lg font-medium">Error: {error}</div>;

  return (
    <div
      className={`min-h-screen transition-all duration-500 p-6 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800"
      }`}
    >
      <ToastContainer theme="colored" position="bottom-right" />

      <div className="max-w-8xl mx-auto backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-300/20 dark:border-gray-700/40">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight"> All Appointments</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Comprehensive patient appointment records</p>
          </div>
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-3 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white hover:scale-105 transform transition"
            title="Toggle theme"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-300/20 dark:border-gray-700/40">
          {appointments.length > 0 ? (
            <table
              className={`min-w-full text-sm rounded-lg overflow-hidden ${
                theme === "dark" ? "bg-gray-800/80" : "bg-white/80"
              }`}
            >
              <thead>
                <tr
                  className={`${
                    theme === "dark" ? "bg-gray-700/70 text-gray-300" : "bg-blue-100 text-gray-700"
                  } text-xs uppercase tracking-wider`}
                >
                  {[
                    "Patient ID",
                    "Name",
                    "Contact",
                    "DOB",
                    "Gender",
                    "Appointment Date",
                    "Reason",
                    "Sugar Level",
                    "BP",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th key={header} className="px-8 py-4 text-left font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.map((app) => (
                  <tr
                    key={app._id}
                    className={`transition hover:scale-[1.01] ${
                      theme === "dark" ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-8 py-4 font-mono text-gray-500">{app.patientId}</td>
                    <td className="px-8 py-4 font-medium">{app.patient?.patientName || "N/A"}</td>
                    <td className="px-8 py-4">{app.patient?.contact || "N/A"}</td>
                    <td className="px-8 py-4">{formatDate(app.patient?.dob)}</td>
                    <td className="px-8 py-4">{app.patient?.gender || "N/A"}</td>
                    <td className="px-8 py-4">{formatDate(app.appointmentDate)}</td>
                    <td className="px-8 py-4">
                      <div className="max-w-[250px] truncate">
                        <ReasonBadge reason={app.reason} />
                      </div>
                    </td>
                    <td className="px-8 py-4">{app.sugarLevel}</td>
                    <td className="px-8 py-4">{app.bp}</td>
                    <td className="px-8 py-4 text-center">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-8 py-4 text-center">
                      <button
                        onClick={() => handleEditClick(app)}
                        className="text-blue-500 hover:text-blue-400 mr-3 transition-transform hover:scale-110"
                      >
                        <FaEdit />
                      </button>
                      {app.status === "Completed" && (
                        <button
                          onClick={() => handleArchive(app._id)}
                          className="text-red-500 hover:text-red-400 transition-transform hover:scale-110"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 py-10">No appointments found.</p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div
            className={`rounded-2xl shadow-2xl p-8 w-full max-w-lg transition ${
              theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
            }`}
          >
            <h2 className="text-2xl font-bold mb-6 text-center"> Edit Appointment</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {[
                { label: "Appointment Date", name: "appointmentDate", type: "date" },
                { label: "Sugar Level", name: "sugarLevel", type: "text" },
                { label: "Blood Pressure", name: "bp", type: "text" },
                { label: "Reason", name: "reason", type: "text" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-sm font-medium">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={editingAppointment[field.name]}
                    onChange={(e) =>
                      setEditingAppointment((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                    }
                    className={`mt-1 w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-400 ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-gray-50 border-gray-300"
                    }`}
                  />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={editingAppointment.status}
                  onChange={(e) =>
                    setEditingAppointment((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                  }
                  className={`mt-1 w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-400 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAppointments;
