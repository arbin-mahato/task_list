// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

const Task = require("./schemas/Task");

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Task Management API" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(port, () => {
      console.log(`Server is running on port: http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err);
  });

app.get("/tasks", async (req, res) => {
  console.log("Fetching tasks...");
  try {
    const tasks = await Task.find().sort({ createdAt: -1 }); // Sort by newest first
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Write an endpoint to create a new task.
// Update the routes to include the `/api` prefix
app.get("/api/tasks", async (req, res) => {
  console.log("Fetching tasks...");
  try {
    const tasks = await Task.find().sort({ createdAt: -1 }); // Sort by newest first
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/api/tasks", async (req, res) => {
  const { title, description, dueDate, priority } = req.body;

  // Validate input fields
  if (!title || !description || !dueDate || !priority) {
    return res.status(400).json({
      message: "All fields are required",
      missingFields: {
        title: !title,
        description: !description,
        dueDate: !dueDate,
        priority: !priority,
      },
    });
  }

  try {
    const newTask = new Task({ title, description, dueDate, priority });
    await newTask.save();
    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Server Error" });
  }
});
