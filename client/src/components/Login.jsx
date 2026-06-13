import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice";
import { Button, Input } from "./index";
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
      dispatch(authLogin({ userData: user.user }));
      toast.success("🎉 Login successful!");
      navigate("/");
    } catch (err) {
      const message = err?.response?.data?.message || "❌ Login failed";
      toast.error(message);
      setError(message);
    }
  };

  return (
    <div className="w-full">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-center text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
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
        <Button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-indigo-500/20 transition duration-300">
          Sign in
        </Button>
      </form>
    </div>
  );
}

export default Login;
