import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import passportLocalMongoose from 'passport-local-mongoose';

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Enter a valid email'],
  },
  batch: {
    type: String,
    trim: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  github: {
    type: String,
    trim: true,
  },
  linkedin: {
    type: String,
    trim: true,
  },
  achievements: {
    type: [String],
    default: [],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  avatar: {
    type: String, // URL to image (optional)
    default: '',
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
// Export the model
const User = mongoose.model('User', userSchema);


export default User;
