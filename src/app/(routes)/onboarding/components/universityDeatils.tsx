"use client";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useState, useCallback } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import debounce from "lodash.debounce";
import { axiosInstance } from "@/lib/axios";
import { urlConfig } from "@/lib/utils/urls";

interface UniversityDetailsProps {
  onNext: () => void;
}

const universityOptions = [
  { label: "Swansea University", value: "swanseauni" },
  { label: "Oxford University", value: "oxforduni" },
  { label: "University of Porthmuth", value: "porthmuthuni" },
];

const validationSchema = Yup.object().shape({
  universityName: Yup.string().required("University Name is required"),
  subdomain: Yup.string()
    .required("Subdomain is required")
    .matches(
      /^[a-z0-9]+$/,
      "Subdomain must be alphanumeric and have no spaces"
    ),
});

const UniversityDetails: React.FC<UniversityDetailsProps> = ({ onNext }) => {
  const [isDomainAvailable, setIsDomainAvailable] = useState(false);
  const [checkingDomain, setCheckingDomain] = useState(false);
  const [attemptedDomainCheck, setAttemptedDomainCheck] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const checkDomainAvailability = useCallback(
    debounce(async (domain: string) => {
      try {
        setCheckingDomain(true);
        const response = await axiosInstance.post(
          `${urlConfig.apiUrl}/universities/check-domain/${domain}`
        );
        setIsDomainAvailable(!response.data.exists);
      } catch (error) {
        setIsDomainAvailable(false);
      } finally {
        setCheckingDomain(false);
        setAttemptedDomainCheck(true);
      }
    }, 500),
    []
  );

  const suggestSubdomain = (universityLabel: string) => {
    return universityLabel
      .toLowerCase()
      .replace(/university|of|the/gi, "")
      .trim()
      .replace(/\s+/g, "")
      .concat("uni");
  };

  return (
    <div className="flex justify-center items-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-center text-xl font-semibold mb-6">
          Register Your University
        </h2>
        <Formik
          initialValues={{
            universityName: "",
            subdomain: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              const response = await axiosInstance.post(
                `${urlConfig.apiUrl}/universities`,
                {
                  university_name: values.universityName,
                  domain: values.subdomain,
                }
              );

              if (response.status === 201) {
                setIsSubmitted(true);
                onNext();
              }
            } catch (error) {
              setErrors({
                subdomain:
                  "Failed to register the university. Please try again.",
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form>
              {/* University Name */}
              <div className="mb-6">
                <label
                  htmlFor="universityName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  University Name <span className="text-red-500">*</span>
                </label>
                <Select
                  value={values.universityName}
                  onValueChange={(value) => {
                    if (!isSubmitted) {
                      setFieldValue("universityName", value);
                      const universityLabel =
                        universityOptions.find(
                          (option) => option.value === value
                        )?.label || "";
                      const suggestedSubdomain =
                        suggestSubdomain(universityLabel);
                      setFieldValue("subdomain", suggestedSubdomain);
                      checkDomainAvailability(suggestedSubdomain);
                    }
                  }}
                  disabled={isSubmitted} // Disable Select after submission
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your university" />
                  </SelectTrigger>
                  <SelectContent>
                    {universityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.universityName && touched.universityName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.universityName}
                  </p>
                )}
              </div>

              {/* Subdomain */}
              <div className="mb-6">
                <label
                  htmlFor="subdomain"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subdomain
                </label>
                <Field
                  id="subdomain"
                  name="subdomain"
                  type="text"
                  placeholder="Enter subdomain"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  disabled={isSubmitted} // Disable input after submission
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!isSubmitted) {
                      const subdomain = e.target.value;
                      setFieldValue("subdomain", subdomain);
                      checkDomainAvailability(subdomain);
                    }
                  }}
                />
                {errors.subdomain && touched.subdomain && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subdomain}
                  </p>
                )}
              </div>

              {/* Domain Availability */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain Availability
                </label>
                <div className="flex items-center space-x-2">
                  {checkingDomain ? (
                    <span className="text-gray-500 font-medium">
                      Checking availability...
                    </span>
                  ) : attemptedDomainCheck && isDomainAvailable ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="h-3 w-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-green-600 font-medium">
                        Domain Available
                      </span>
                    </div>
                  ) : attemptedDomainCheck && !isDomainAvailable ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                        <svg
                          className="h-3 w-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <span className="text-red-600 font-medium">
                        Domain Not Available
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className={`w-full py-2 px-4 rounded-md text-white ${
                    isDomainAvailable || isSubmitted
                      ? "bg-foreground hover:bg-blue-900"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  disabled={!isDomainAvailable || isSubmitted}
                >
                  Continue
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UniversityDetails;
