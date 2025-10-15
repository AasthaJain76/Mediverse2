export const protect = (req, res, next) => {
  console.log("Session in protect:", req.session);
  console.log("Passport user:", req.session.passport?.user);
  
  // check session directly
  if (req.session.passport?.user) return next();
  
  return res.status(401).json({ message: "Unauthorized. Please log in." });
};
