import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);

      fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);
          if (data.message === "User created successfully") {
            toast.success("Account created successfully!");
            setTimeout(() => {
              window.location.href = "/login";
            }, 1000);
          } else {
            toast.error(data.message || "Signup failed");
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
                JOIN US
              </h1>
              <p className="text-gray-400 mb-8" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                Create your account and discover a world of possibilities
              </p>
              <div className="space-y-4 text-sm text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  Personalized shopping experience
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  Exclusive offers and deals
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  Fast and secure checkout
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Signup Form */}
          <div className="bg-white p-12">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-black mb-2 tracking-wide">CREATE ACCOUNT</h2>
                <p className="text-gray-500 text-sm">Fill in your details</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-black mb-2 tracking-widest uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border bg-transparent focus:border-black transition-all duration-300 ${
                      errors.name ? "border-red-500" : "border-black/20"
                    }`}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

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

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-bold text-black mb-2 tracking-widest uppercase">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border bg-transparent focus:border-black transition-all duration-300 ${
                        errors.confirmPassword ? "border-red-500" : "border-black/20"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="w-4 h-4 border-black/20"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeToTerms" className="text-gray-500">
                      I agree to the{" "}
                      <a href="#" className="text-black underline">Terms</a>
                    </label>
                    {errors.agreeToTerms && <p className="mt-1 text-xs text-red-500">{errors.agreeToTerms}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white font-bold py-3 tracking-widest uppercase text-sm hover:bg-gray-800 transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? "CREATING..." : "CREATE ACCOUNT"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <a href="/login" className="text-black underline font-bold">
                    SIGN IN
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

export default Signup;