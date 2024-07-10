import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: "Board",
  },
  description: {
    type: String,
    default: "Board Description",
  },
});

const Board = mongoose.model("Board", boardSchema);
export default Board;