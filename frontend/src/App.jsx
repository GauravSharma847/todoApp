// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    _id: null,
    assignedTo: "",
    status: "",
    dueDate: "",
    priority: "",
    description: ""
  });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchTasks = async () => {
    const res = await axios.get(`${API_URL}/tasks`);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openForm = (task = null) => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({ _id: null, assignedTo: "", status: "", dueDate: "", priority: "", description: "" });
    }
    setShowForm(true);
  };

  const saveTask = async () => {
    if (formData._id) {
      await axios.put(`${API_URL}/task/${formData._id}`, formData);
    } else {
      await axios.post(`${API_URL}/task`, formData);
    }
    setShowForm(false);
    fetchTasks();
  };

  const deleteTask = async () => {
    await axios.delete(`${API_URL}/task/${confirmDelete}`);
    setConfirmDelete(null);
    fetchTasks();
  };

  const filteredTasks = tasks.filter(task =>
    task.assignedTo?.toLowerCase().includes(search.toLowerCase()) ||
    task.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <span className="logo">📋</span>
          <h1>Tasks</h1>
        </div>
        <div className="header-right">
          <button onClick={() => openForm()}>New Task</button>
          <button onClick={fetchTasks}>Refresh</button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(task => (
            <tr key={task._id}>
              <td>{task.assignedTo}</td>
              <td>{task.status}</td>
              <td>{task.dueDate}</td>
              <td>{task.priority}</td>
              <td>{task.description}</td>
              <td>
                <button onClick={() => openForm(task)}>Edit</button>
                <button onClick={() => setConfirmDelete(task._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer Pagination */}
      <footer className="footer">
        <div className="footer-left">Page 1 of 1 ⬆️⬇️</div>
        <div className="footer-right">
          <button>First</button>
          <button>Prev</button>
          <span>1</span>
          <button>Next</button>
          <button>Last</button>
        </div>
      </footer>

      {/* Task Form Popup */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{formData._id ? "Edit Task" : "New Task"}</h2>
            <input placeholder="Assigned To" value={formData.assignedTo} onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })} />
            <input placeholder="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
            <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
            <input placeholder="Priority" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} />
            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            <div className="modal-actions">
              <button onClick={() => setShowForm(false)}>Cancel</button>
              <button onClick={saveTask}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Popup  */}
      {confirmDelete && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete this task?</h2>
            <div className="modal-actions">
              <button onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button onClick={deleteTask}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
