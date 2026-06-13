import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button, Input } from "./index.js";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axiosInstance from "../utils/axiosInstance.js";
import { toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { register, handleSubmit, trigger, formState: { errors } } = useForm();

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(["username", "email", "password"]);
    } else if (step === 2) {
      isValid = await trigger(["batch", "department", "skills"]);
    }
    
    if (isValid) {
      setError("");
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

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
    } catch (err) {
      const errMsg = err.response?.data?.message || "❌ Signup failed";
      toast.error(errMsg);
      setError(errMsg);
    }
  };

  return (
    <div className="w-full">
      {/* Step Progress Indicator */}
      <div className="mb-8 relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
        <div 
          className="absolute left-0 top-1/2 h-0.5 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        ></div>

        {/* Step Circles */}
        {[1, 2, 3].map((s) => (
          <div key={s} className="relative z-10 flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step >= s 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-110" 
                  : "bg-white text-gray-400 border-2 border-gray-200"
              }`}
            >
              {s}
            </div>
            <span className={`text-[10px] sm:text-xs mt-1.5 font-medium ${step >= s ? "text-indigo-600 font-semibold" : "text-gray-400"}`}>
              {s === 1 ? "Account" : s === 2 ? "Academics" : "Profiles"}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-center text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(create)} className="space-y-5">
        {/* Step 1: Account Info */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <Input 
              label="Full Name" 
              placeholder="Enter your full name"
              {...register("username", { required: "Full name is required" })} 
            />
            {errors.username && <p className="text-red-500 text-xs mt-0.5">{errors.username.message}</p>}

            <Input 
              label="Email" 
              type="email" 
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be valid",
                },
              })} 
            />
            {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email.message}</p>}

            <Input 
              label="Password" 
              type="password" 
              placeholder="Enter your password"
              {...register("password", { 
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" }
              })} 
            />
            {errors.password && <p className="text-red-500 text-xs mt-0.5">{errors.password.message}</p>}
          </div>
        )}

        {/* Step 2: Academic Info */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input 
                  label="Batch" 
                  placeholder="e.g. 2025"
                  {...register("batch", { required: "Batch is required" })} 
                />
                {errors.batch && <p className="text-red-500 text-xs mt-0.5">{errors.batch.message}</p>}
              </div>
              <div>
                <Input 
                  label="Department" 
                  placeholder="e.g. CSE, ECE"
                  {...register("department", { required: "Department is required" })} 
                />
                {errors.department && <p className="text-red-500 text-xs mt-0.5">{errors.department.message}</p>}
              </div>
            </div>

            <Input 
              label="Skills" 
              placeholder="Comma separated: React, C++, DSA"
              {...register("skills", { required: "Skills are required" })} 
            />
            {errors.skills && <p className="text-red-500 text-xs mt-0.5">{errors.skills.message}</p>}

            <Input 
              label="Interests" 
              placeholder="Comma separated: AI, UI/UX, CP"
              {...register("interests")} 
            />

            <Input 
              label="Achievements" 
              placeholder="Hackathons, certifications, etc."
              {...register("achievements")} 
            />
          </div>
        )}

        {/* Step 3: Profiles & Handles */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                label="LeetCode Username" 
                placeholder="yourleetcodeid"
                {...register("leetcode")} 
              />
              <Input 
                label="Codeforces Handle" 
                placeholder="yourcfhandle"
                {...register("codeforces")} 
              />
            </div>
            <Input 
              label="LinkedIn Profile" 
              placeholder="https://linkedin.com/in/yourname"
              {...register("linkedin")} 
            />
            <Input 
              label="GitHub Profile" 
              placeholder="https://github.com/yourname"
              {...register("github")} 
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="w-1/2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition duration-300"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className={`py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition duration-300 ${step === 1 ? "w-full" : "w-1/2"}`}
            >
              Next Step
            </button>
          ) : (
            <Button 
              type="submit" 
              className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-indigo-500/20 transition duration-300"
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Signup;
