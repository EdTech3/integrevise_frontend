"use client";

import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi"; 
import Logo from "@/components/shared/Logo";
import Sidebar from "../onboarding/components/sideBar";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { axiosInstance } from "@/lib/axios";


const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSSOSignIn = async (provider: string) => {
    try {
    
      console.log(`${provider} Sign-In response:`);
    } catch (error) {
      console.error(`${provider} Sign-In failed`, error);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
  });

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-2/6">
        <Sidebar bgColorClass="bg-foreground" patternColorClass="text-white" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        <Logo type="welcome" className="mb-10" />

        <div className="w-4/6 bg-white shadow-md rounded-lg p-6">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const response = await axiosInstance.post("/api/auth/signin", values);
                console.log("Sign-In response:", response.data);
              } catch (error) {
                console.error("Sign-In failed", error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                {/* Email Field */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {/* Password Field */}
                <div className="mb-4 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                  <div className="mt-2 text-right">
                    <a href="#" className="text-blue-500 text-sm">
                      Forgot Password?
                    </a>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mb-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 rounded-md text-white ${
                      isSubmitting
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-foreground to-blue-900 hover:from-blue-900 hover:to-foreground"
                    }`}
                  >
                    {isSubmitting ? "Signing In..." : "Sign In"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          {/* SSO Sign-In */}
          <div className="text-center text-gray-500 text-sm my-4">OR</div>
          <div className="flex justify-center space-x-4">
            {/* Google Sign-In */}
            <button
              type="button"
              onClick={() => handleSSOSignIn("google")}
              className="p-2 border rounded-md shadow-sm hover:bg-gray-100"
            >
              <img src="/icons/google.svg" alt="Google" className="w-6 h-6" />
            </button>

            {/* Microsoft Sign-In */}
            <button
              type="button"
              onClick={() => handleSSOSignIn("microsoft")}
              className="p-2 border rounded-md shadow-sm hover:bg-gray-100"
            >
              <img src="/icons/microsoft.svg" alt="Microsoft" className="w-6 h-6" />
            </button>

            {/* Okta Sign-In */}
            <button
              type="button"
              onClick={() => handleSSOSignIn("okta")}
              className="p-2 border rounded-md shadow-sm hover:bg-gray-100"
            >
              <img src="/icons/okta.svg" alt="Okta" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
