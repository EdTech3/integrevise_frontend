"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { axiosInstance } from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/shared/Logo";
import Sidebar from "../onboarding/components/sideBar";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-red-600 text-lg font-bold">Invalid or Missing Token</h1>
      </div>
    );
  }

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Required"),
  });

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="hidden lg:block lg:w-2/6">
        <Sidebar bgColorClass="bg-green-800" patternColorClass="text-green-300" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-4 lg:p-0">
        <Logo type="dark" className="mb-10" />
        <div className="w-full lg:w-4/6 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center text-green-800">
            Reset Password
          </h2>
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                await axiosInstance.post("/api/auth/reset-password", {
                  token,
                  password: values.password,
                });
                alert("Password has been reset successfully.");
                resetForm();
                window.location.href = "/sign-in";
              } catch (error) {
                console.error("Error resetting password:", error);
                alert("Failed to reset password. Please try again.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your new password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Re-enter your new password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 rounded-md text-white ${
                      isSubmitting
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-800 to-green-600 hover:from-green-900 hover:to-green-700"
                    }`}
                  >
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
