import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  //console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized Access,token missing" });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    req.user = user;
    next();
  });
};