import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useForm } from "react-hook-form";
import { login as loginService } from "../services/authService";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const handleLogin = async (data) => {
    try {
      const user = await loginService(data);
      dispatch(authLogin({ userData: user }));
      toast.success("🎉 Login successful!");
      navigate("/");
    } catch (err) {
      const message = err?.response?.data?.message || "❌ Login failed";
      toast.error(message);
      setError(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
            <Logo />
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Welcome back 👋
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 mt-4 text-center text-sm font-medium">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(handleLogin)} className="mt-6 space-y-5">
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            {...register("email", {
              required: true,
              validate: {
                matchPattern: (value) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(value) ||
                  "Invalid email address",
              },
            })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register("password", { required: true })}
          />
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
