"use client";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { urlConfig } from "@/lib/utils/urls";
import { API_ROUTES } from "@/lib/config/api";
import { useDomainStore } from "@/lib/store/onboarding";

interface LMSProps {
  onNext: () => void;
}

interface LmsOption {
  lms_id: any;
  label: string;
  value: string;
}

const lmsFields: Record<
  string,
  { name: string; label: string; type: string }[]
> = {
  moodle: [
    { name: "api_base_url", label: "Moodle Site URL", type: "text" },
    { name: "access_token", label: "Web Service Token", type: "text" },
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
  const [lmsOptions, setLmsOptions] = useState<LmsOption[]>([]);
  const [selectedLMS, setSelectedLMS] = useState<string>("moodle");
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const selectedDomain = useDomainStore((state) => state.selectedDomain);
  console.log("Selected Domain:", selectedDomain);

  // Fetch LMS options from backend
  useEffect(() => {
    const fetchLmsOptions = async () => {
      try {
        const response = await axiosInstance.get(
          `${urlConfig.apiUrl}${API_ROUTES.onboarding.lmsPlatforms}`
        );

        const options: LmsOption[] = response.data.map((option: any) => ({
          label: option.lms_name,
          value: option.lms_name.toLowerCase(),
          lms_id: option.lms_id,
        }));

        setLmsOptions(options);

        // Default to the first option if available
        if (options.length > 0) {
          setSelectedLMS(options[0].value);
        }
      } catch (error) {
        console.error("Failed to fetch LMS options", error);
      }
    };

    fetchLmsOptions();
  }, []);

  const validationSchema = Yup.object(
    lmsFields[selectedLMS]?.reduce((acc, field) => {
      acc[field.name] = Yup.string().required(`${field.label} is required`);
      return acc;
    }, {} as Record<string, Yup.StringSchema>) || {}
  );

  const handleSync = async (values: Record<string, string>) => {
    try {
      const selectedLmsOption = lmsOptions.find(
        (option) => option.value === selectedLMS
      );

      if (!selectedLmsOption) {
        setSyncStatus("Failed: Invalid LMS selection");
        return;
      }

      const payload = {
        ...values,
        lms_id: selectedLmsOption.lms_id,

      };

      console.log("Testing connection with payload:", payload);

      const response = await axiosInstance.post(
        `${urlConfig.apiUrl}${API_ROUTES.onboarding.testLmsConnection}`,
        payload
      );

      // Handle the response
      setSyncStatus(response.data.message || "Test Successful");
    } catch (error: any) {
      console.error("Test connection failed:", error);
      setSyncStatus(
        error.response?.data?.message || "Test Failed: Unable to connect to LMS"
      );
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
          initialValues={lmsFields[selectedLMS]?.reduce((acc, field) => {
            acc[field.name] = "";
            return acc;
          }, {} as Record<string, string>)}
          validationSchema={validationSchema}
          onSubmit={async(values, { setSubmitting }) => {
            setSubmitting(true);
            const selectedLmsOption = lmsOptions.find(
              (option) => option.value === selectedLMS
            );
      
            const payload = {
              ...values,
              lms_id: selectedLmsOption?.lms_id,
              domain: selectedDomain
      
            };

            console.log("Payload:", payload);
            const response = await axiosInstance.post(
              `${urlConfig.apiUrl}${API_ROUTES.onboarding.saveLmsConfig}`,
              payload
            )
            if (response.status === 201) {
              setSubmitting(false);
              onNext();
            
            }
        
       
          }}
          enableReinitialize
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => {
            const allFieldsFilled = lmsFields[selectedLMS]?.every(
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
                {lmsFields[selectedLMS]?.map((field) => (
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
                        syncStatus.toLowerCase().includes("successful")
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
                      syncStatus?.includes("successful")
                        ? "bg-foreground hover:bg-blue-900"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                    disabled={
                      !syncStatus?.includes("successful") || isSubmitting
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
