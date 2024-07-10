import Board from "../Models/boardModel.js";
import Section from "../Models/sectionModel.js";
import Task from "../Models/taskModel.js";

export const createBoard = async (req, res) => {
  try {
    const { title, description } = req.body;

    const userId = req.user.id;

    const board = new Board({
      user: userId,
      title: title || "Board", // Default to 'Board' if title is not provided
      description: description || "Board Description", // Default description
    });
    await board.save();

    res.status(200).json({ message: "Board Created Successfully", board });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Internal Server Error in createBoard" });
  }
};

export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user._id });

    res.status(200).json({ boards });
  } catch (error) {
    //console.log(error);
    res.status(500).json({ message: "Internal Server Error in getBoard" });
  }
};

export const getOneBoard = async (req, res) => {
  const { boardId } = req.params;

  try {
    const board = await Board.findOne({ user: req.user._id, _id: boardId });

    if (!board) return res.status(404).json({ message: "No Board Found" });

    const sections = await Section.find({ board: boardId });

    for (const section of sections) {
      const tasks = await Task.find({ section: section._id }).populate(
        "section"
      );
      section._doc.tasks = tasks;
    }
    board._doc.sections = sections;

    res.status(200).json({ message: "Board fetched successfully", board });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error in getOneBoard" });
  }
};

export const updateBoard = async (req, res) => {
  const { boardId } = req.params;
  const { title, description } = req.body;

  try {
    if (title === "") req.body.title = "Board Title";

    if (description === "") req.body.description = "Add description here";

    const currentBoard = await Board.findById(boardId);
    if (!currentBoard) return res.status(404).json("Board not found");

    const updatedBoard = await Board.findByIdAndUpdate(
      boardId,
      { $set: req.body },
      {
        new: true,
      }
    );
    res
      .status(200)
      .json({ message: "Board updated successfully", updatedBoard });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error in updateBoard" });
  }
};

export const deleteBoard = async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Delete all sections and tasks associated with the board
    await Section.deleteMany({ board: boardId });
    await Task.deleteMany({ board: boardId });

    // Delete the board itself
    await board.deleteOne({board:boardId});

    res.status(200).json({ message: 'Board deleted successfully' });

  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({ message: "Internal Server error in deleteBoard" });
  }
};
