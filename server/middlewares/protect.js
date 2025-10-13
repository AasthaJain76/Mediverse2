// middleware/authMiddleware.js

export const protect = (req, res, next) => {
  console.log("Session in protect:", req.session);
  console.log("User in protect:", req.user);
  console.log("isAuthenticated?", req.isAuthenticated?.());
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized. Please log in." });
};