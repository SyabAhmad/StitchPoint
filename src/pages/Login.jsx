import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);

      fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);
          if (data.access_token) {
            localStorage.setItem("token", data.access_token);
            if (data.refresh_token) {
              localStorage.setItem("refreshToken", data.refresh_token);
            }
            localStorage.setItem("user", JSON.stringify(data.user));
            const user = data.user;
            toast.success("Login successful!");
            setTimeout(() => {
              if (user.role === "super_admin") {
                window.location.href = "/super-admin-dashboard";
              } else if (user.role === "manager") {
                window.location.href = "/manager-dashboard";
              } else {
                window.location.href = "/customer-dashboard";
              }
            }, 1000);
          } else {
            toast.error(data.message || "Login failed");
          }
        })
        .catch(() => {
          setIsLoading(false);
          toast.error("An error occurred. Please try again.");
        });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Column - Welcome */}
          <div className="bg-black p-12 flex flex-col justify-center items-center text-white">
            <div className="text-center">
              <h1 className="text-3xl lg:text-4xl font-bold mb-6 tracking-wider" style={{ fontFamily: '"Playfair Display", serif' }}>
                WELCOME BACK
              </h1>
              <p className="text-gray-400 mb-8" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                Sign in to continue your journey with us
              </p>
              <div className="space-y-4 text-sm text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  Access your personalized dashboard
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  Track your orders
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  Seamless shopping experience
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="bg-white p-12">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-black mb-2 tracking-wide">SIGN IN</h2>
                <p className="text-gray-500 text-sm">Enter your credentials</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-black mb-2 tracking-widest uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border bg-transparent focus:border-black transition-all duration-300 ${
                      errors.email ? "border-red-500" : "border-black/20"
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-black mb-2 tracking-widest uppercase">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border bg-transparent focus:border-black transition-all duration-300 ${
                        errors.password ? "border-red-500" : "border-black/20"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 border-black/20"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-500">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-sm text-black underline tracking-wide">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white font-bold py-3 tracking-widest uppercase text-sm hover:bg-gray-800 transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? "SIGNING IN..." : "SIGN IN"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <a href="/signup" className="text-black underline font-bold">
                    CREATE ACCOUNT
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;