import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button, Input, Logo } from "./index.js";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axiosInstance from "../utils/axiosInstance.js";
import { toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const create = async (data) => {
    setError("");
    try {
      const formattedData = {
        ...data,
        skills: data.skills?.split(",").map((s) => s.trim()) || [],
        achievements: data.achievements?.split(",").map((a) => a.trim()) || [],
        interests: data.interests?.split(",").map((i) => i.trim()) || [],
      };

      const res = await axiosInstance.post("/auth/signup", formattedData);

      if (res.data.success) {
        dispatch(login({ userData: res.data.user }));
        toast.success("🎉 Account created successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Logo width="100%" />
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800">
          Create your MediVerse account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:underline"
          >
            Sign in
          </Link>
        </p>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit(create)} className="mt-8 space-y-5">
          <Input label="Full Name" placeholder="Enter your full name"
            {...register("username", { required: true })} />

          <Input label="Email" type="email" placeholder="Enter your email"
            {...register("email", {
              required: true,
              validate: {
                matchPatern: (value) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                  "Email address must be valid",
              },
            })} />

          <Input label="Password" type="password" placeholder="Enter your password"
            {...register("password", { required: true })} />

          <Input label="Skills" placeholder="e.g. React, C++, DSA"
            {...register("skills", { required: true })} />

          <Input label="Interests" placeholder="e.g. AI, UI/UX, CP"
            {...register("interests")} />

          <Input label="Batch" placeholder="e.g. 2025"
            {...register("batch", { required: true })} />

          <Input label="Department" placeholder="e.g. CSE, ECE, IT"
            {...register("department", { required: true })} />

          <Input label="LinkedIn Profile" placeholder="https://linkedin.com/in/yourname"
            {...register("linkedin")} />

          <Input label="GitHub Profile" placeholder="https://github.com/yourname"
            {...register("github")} />

          <Input label="Achievements" placeholder="Hackathons, Certifications, etc."
            {...register("achievements")} />

          <Input label="LeetCode Username" placeholder="yourleetcodeid"
            {...register("leetcode")} />

          <Input label="Codeforces Handle" placeholder="yourcfhandle"
            {...register("codeforces")} />

          {/* Button with Gradient */}
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
              Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
