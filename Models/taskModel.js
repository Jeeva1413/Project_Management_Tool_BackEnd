import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true,
  },
  taskName: {
    type: String,
    default: "Task",
  },
  taskDescription: {
    type: String,
    default: "Task Description",
  },
  technologies: {
    type: String,
    enum: [
      "MERN Stack",
      "MEAN Stack",
      "Python Full Stack",
      "JAVA Full Stack",
      "Mobile App Development",
    ],
  },
  role: {
    type: String,
    enum: ["Team Leader", "Developer", "Tester", "Designer"],
  },
  taskStatus: {
    type: String,
    default: "Active",
  },
  taskPriority: {
    type: String,
    default: "Low",
    enum: ["Low", "Medium", "High"],
  },
  taskDueDate: {
    type: Date,
  },
  taskCreatedDate: {
    type: Date,
    default: Date.now,
  },
  assets: [String],
  position: {
    type: Number,
  },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
