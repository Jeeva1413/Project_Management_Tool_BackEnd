import bcryptjs from "bcryptjs";
import User from "../Models/userModel.js";

export const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: "Unauthorized Access" });
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return res
        .status(400)
        .json({ message: "Username must be between 7 and 20 characters" });
    }
    if (req.body.username.includes(" ")) {
        return res
        .status(400)
        .json({ message: "Username cannot contain spaces" });
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
        return res
        .status(400)
        .json({ message: "Username must be lowercase"});
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        return res
        .status(400)
        .json({ message: "Username can only contain letters and numbers"});
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json({message: "Updated user details",rest});
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error in updateUser" });
  }
};

export const deleteUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: "Unauthorized Access" });
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"User deleted successfully"});
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error in delete User" });
  }
};
