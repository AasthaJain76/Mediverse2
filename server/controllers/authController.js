import User from "../models/User.js";
import session from "express-session";
import passport from "passport";
import LocalStrategy from 'passport-local';
import Profile from "../models/Profile.js";

export const registerUser = async (req, res) => {
  console.log("req.body", req.body);
  const {
    username,
    email,
    password,
    batch,
    department,
    cgpa,
    skills,
    interests,
    github,
    linkedin,
    portfolio,
    achievements,
    certifications,
    hackathons,
    publications,
    extracurriculars,
    leetcode,
    codeforces
  } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already in use" });

    const newUser = new User({
      username,
      email,
      batch,
      skills,
      github,
      linkedin,
      achievements,

    });

    const registeredUser = await User.register(newUser, password);

    const existingProfile = await Profile.findOne({ userId: newUser._id });
    if (!existingProfile) {
      await Profile.create({
        userId: newUser._id,
        batch,
        department,
        cgpa,
        skills,
        interests,
        github,
        linkedin,
        portfolio,
        achievements,
        certifications,
        hackathons,
        publications,
        extracurriculars,
        leetcode: { username: leetcode },
        codeforces: { handle: codeforces },
        avatar: "",
        coverImage: "",
      });
    }

    req.login(registeredUser, (err) => {
      if (err) return res.status(500).json({ message: "Login after registration failed" });
      return res.status(201).json({ success: true, user: registeredUser });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 🔐 Login existing user
export const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log("BODY:", req.body);
    console.log("Email:", req.body.email);
    console.log("Password:", req.body.password);
    console.log("LOGIN ATTEMPT:", req.body);

    if (err) {
      console.error("Authentication error:", err);
      return next(err);
    }

    if (!user) {
      console.warn("Authentication failed:", info?.message);
      return res.status(401).json({ message: info?.message || "Invalid credentials" });
    }
    req.login(user, (err) => {
      if (err) return next(err);
      console.log("Session after login:", req.session);
      console.log("Passport user:", req.session.passport);
      res.status(200).json({ message: "Login successful", user });
    });

    req.login(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }

      // Optionally remove sensitive fields
      const { password, ...safeUser } = user.toObject();
      res.status(200).json({ user: safeUser });
    });

  })(req, res, next);
};



export const getMe = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Assuming req.user is a Mongoose document
    const { password, ...userWithoutPassword } = req.user._doc;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const logoutUser = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // or your session cookie name
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
};