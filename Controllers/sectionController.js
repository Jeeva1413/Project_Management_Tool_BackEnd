import Section from "../Models/sectionModel.js";
import Board from "../Models/boardModel.js";
import Task from "../Models/taskModel.js";


export const createSection = async (req, res) => {
  const { boardId } = req.params;
  const { title } = req.body; // Destructure title from the request body

  try {
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const section = new Section({
      board: boardId,
      title: title || "Section", // Default title if not provided
    });

    section._doc.tasks = [];

    await section.save();

    res.status(200).json({ message: "Section created successfully", section });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error in createSection" });
  }
};


export const updateSection = async (req, res) => {
  const { sectionId } = req.params; 
  
  try {
    const section = await Section.findByIdAndUpdate(sectionId, {
      $set: req.body,
    });

    section._doc.tasks = [];
    if(!section){
      return res.status(404).json({ message: "Section not found" });
    }
    res.status(200).json({ message: "Section updated successfully", section });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error in updateSection" });
  }
};

export const deleteSection = async (req, res) => {
  const { sectionId } = req.params;
  try {
    await Task.deleteMany({ section: sectionId });
    await Section.deleteOne({ _id: sectionId });
    
    res.status(200).json({ message: "Section deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error in deleteSection" });
  }
};

export const getSection = async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const section = await Section.find({boardId: board})
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    console.log(section);
    res.status(200).json({ section });
    
  } catch (error) {
    console.error('Error fetching section:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}