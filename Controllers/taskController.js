import Task from "../Models/taskModel.js";
import Section from "../Models/sectionModel.js";


export const createTask = async (req, res) => {
  const { sectionId } = req.params;
  const {
    taskName,
    taskDescription,
    taskStatus,
    technologies,
    role,
    taskPriority,
    taskDueDate,
  } = req.body;

  try {
    // Check if the section exists
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Count the existing tasks in the section to determine the new task's position
    const tasksCount = await Task.find({ section: sectionId }).countDocuments();

    // Create a new task
    const newTask = new Task({
      section: sectionId,
      user: req.user,
      taskName: taskName || "Task",
      taskDescription: taskDescription || "Task Description",
      technologies: technologies,
      role: role,
      taskStatus: taskStatus || "To do",
      taskPriority: taskPriority || "Low",
      taskDueDate,
      taskCreatedDate: Date.now(),
      position: tasksCount,
    });

    // Save the new task to the database
    await newTask.save();

    // Populate section details in the response
    const populatedTask = await Task.findById(newTask._id).populate("section");

    res
      .status(201)
      .json({ message: "Task created successfully", task: populatedTask });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error in createTask" });
  }
};

export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const {
    taskName,
    taskDescription,
    taskStatus,
    technologies,
    role,
    taskPriority,
    taskDueDate,
    assets
  } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (taskName) task.taskName = taskName;
    if (taskDescription) task.taskDescription = taskDescription;
    if (taskStatus) task.taskStatus = taskStatus;
    if (technologies) task.technologies = technologies;
    if (role) task.role = role;
    if (taskPriority) task.taskPriority = taskPriority;
    if (taskDueDate) task.taskDueDate = taskDueDate;
    if(assets) task.assets=assets;
    await task.save();
    //console.log(task);

    // Populate section details in the response
    const populatedTask = await Task.findById(task._id).populate("section");
    res
      .status(200)
      .json({ message: "Task updated successfully", task: populatedTask });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error in updateTask" });
  }
};

export const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal Server error in deleteTask" });
  }
};

export const getTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findOne({ _id: taskId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePosition = async (req, res) => {
  const {
    resourceList,
    destinationList,
    resourceSectionId,
    destinationSectionId,
  } = req.body;

  const resourceListReverse = resourceList.reverse();
  const destinationListReverse = destinationList.reverse();

  try {
    if (resourceSectionId !== destinationSectionId) {
      for (let key = 0; key < resourceListReverse.length; key++) {
        const taskId = resourceListReverse[key]._id;
        await Task.findByIdAndUpdate(taskId, {
          $set: {
            section: resourceSectionId,
            position: key,
          },
        });
      }
    }

    for (let key = 0; key < destinationListReverse.length; key++) {
      const taskId = destinationListReverse[key]._id;
      await Task.findByIdAndUpdate(taskId, {
        $set: {
          section: destinationSectionId,
          position: key,
        },
      });
    }

    console.log("Task positions updated successfully");
    res.status(200).json({ message: "Task position updated successfully" });
  } catch (error) {
    console.error("Error updating task positions:", error);
    res
      .status(500)
      .json({ message: "Internal server error in update position" });
  }
};

export const getAllTasks =async(req,res) => {
  try {
    const tasks = await Task.find({user:req.user._id})
    .populate('user', 'username')
    .populate('section', 'title');
    res.status(200).json({tasks});
  } catch (error) {
    res.status(500).json({message:"Internal Server Error in getAllTasks"});
  }
};
