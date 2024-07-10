import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../Models/userModel.js";
dotenv.config();

//register new user
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return res.status(400).json({ message: "All the Fields Are Required" });
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res
      .status(200)
      .json({ message: "User Registered Successfully", rest: newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error in register User" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return res.status(400).json({ message: "All the Fields Are Required" });
  }
  if (!email.includes("@")) {
    return res.status(400).json({ message: "Invalid Email" });
  }

  try {
    const userDetail = await User.findOne({ email });
    const userPassword = bcryptjs.compareSync(password, userDetail.password);

    if (!userDetail || !userPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign({ id: userDetail._id }, process.env.JWT_SECRET_KEY);

    const { password: passkey, ...rest } = userDetail._doc;
    
    res
      .status(200)
      .json({ message: "User LoggedIn Successfully", rest, token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error in Login User" });
  }
};

export const google = async (req, res) => {
  const { email, name, profilePic } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

      const { password: passkey, ...rest } = user._doc;

      res
        .status(200)
        .json({
          message: "User LoggedIn Successfully using Google",
          rest,
          token,
        });
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: profilePic,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);

      const { password: passkey, ...rest } = newUser._doc;

      res
        .status(200)
        .json({
          message: "User LoggedIn Successfully using Google",
          rest,
          token,
        });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error in Login User" });
  }
};
