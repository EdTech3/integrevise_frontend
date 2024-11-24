"use client";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface LMSProps {
  onNext: () => void; 
}

const lmsOptions = [
  { label: "Moodle", value: "moodle" },
  { label: "Blackboard", value: "blackboard" },
  { label: "Canvas", value: "canvas" },
];

const lmsFields: Record<string, { name: string; label: string; type: string }[]> = {
  moodle: [
    { name: "siteUrl", label: "Moodle Site URL", type: "text" },
    { name: "serviceToken", label: "Web Service Token", type: "text" },
  ],
  blackboard: [
    { name: "siteUrl", label: "Blackboard Site URL", type: "text" },
    { name: "apiKey", label: "API Key", type: "text" },
    { name: "apiSecret", label: "API Secret", type: "password" },
  ],
  canvas: [
    { name: "siteUrl", label: "Canvas Site URL", type: "text" },
    { name: "accessToken", label: "Access Token", type: "text" },
  ],
};

const LmsIntegration: React.FC<LMSProps> = ({ onNext }) => {
  const [selectedLMS, setSelectedLMS] = useState<string>("moodle");
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const validationSchema = Yup.object(
    lmsFields[selectedLMS].reduce((acc, field) => {
      acc[field.name] = Yup.string().required(`${field.label} is required`);
      return acc;
    }, {} as Record<string, Yup.StringSchema>)
  );

  const handleSync = async (values: Record<string, string>) => {

    try {
      console.log("Testing with values:", values);
      setSyncStatus("Test Successful");
    } catch (error) {
      setSyncStatus("Test Failed");
    }
  };

  return (
    <div className="flex justify-center items-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-center text-xl font-semibold mb-4">
          LMS Integration Setup
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Enter your LMS API credentials to sync courses and assignments.
        </p>
        <Formik
          initialValues={lmsFields[selectedLMS].reduce(
            (acc, field) => {
              acc[field.name] = "";
              return acc;
            },
            {} as Record<string, string>
          )}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            onNext(); 
            setSubmitting(false);
          }}
          enableReinitialize
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => {
            const allFieldsFilled = lmsFields[selectedLMS].every(
              (field) => values[field.name].trim() !== ""
            );

            return (
              <Form>
                {/* LMS Type Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select LMS Type
                  </label>
                  <Select
                    value={selectedLMS}
                    onValueChange={(value) => setSelectedLMS(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select LMS Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {lmsOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic Fields */}
                {lmsFields[selectedLMS].map((field) => (
                  <div key={field.name} className="mb-4">
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {field.label}
                    </label>
                    <Field
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.label}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors[field.name] && touched[field.name] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}

                {/* Test Button */}
                <div className="mt-4 flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => handleSync(values)}
                    className={`py-2 px-4 rounded-md text-white ${
                      allFieldsFilled
                        ? "bg-foreground hover:bg-blue-900"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                    disabled={!allFieldsFilled}
                  >
                    Test Connection
                  </button>
                  {syncStatus && (
                    <p
                      className={`text-sm ${
                        syncStatus.includes("Successful")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {syncStatus}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    type="submit"
                    className={`w-full py-2 px-4 rounded-md text-white ${
                      syncStatus?.includes("Successful")
                        ? "bg-foreground hover:bg-blue-900"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                    disabled={
                      !syncStatus?.includes("Successful") || isSubmitting
                    }
                  >
                    {isSubmitting ? "Submitting..." : "Continue"}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default LmsIntegration;
