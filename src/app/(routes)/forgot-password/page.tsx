"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { axiosInstance } from "@/lib/axios";
import Logo from "@/components/shared/Logo";
import Sidebar from "../onboarding/components/sideBar";
import { urlConfig } from "@/lib/utils/urls";
import { successToast } from "@/lib/toast";


const ForgotPasswordPage = () => {
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
  });

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-2/6">
        <Sidebar bgColorClass="bg-blue-900" patternColorClass="text-blue-300" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        <Logo type="signin" className="mb-10" />
        <div className="w-4/6 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center text-blue-800">
            Forgot Password
          </h2>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                const response = await axiosInstance.post(
                    `${urlConfig.metroUni}/auth/password-reset/request`,
                    values
                  );
                  successToast(response.data.message);
                resetForm(); 
              } catch (error) {
                console.error("Error sending reset link:", error);
       
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                {/* Email Input */}
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 rounded-md text-white ${
                      isSubmitting
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700"
                    }`}
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
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

export default ForgotPasswordPage;
