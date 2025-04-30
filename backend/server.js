// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Task = require("./models/Task");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/todolist", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/api/task", async (req, res) => {
  const { title, completed } = req.body;
  const newTask = new Task({ title, completed });
  await newTask.save();
  res.status(201).json(newTask);
});

app.put("/api/task/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const task = await Task.findByIdAndUpdate(id, { title, completed }, { new: true });
  res.json(task);
});

app.delete("/api/task/:id", async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
