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

const ssoOptions = [
  { label: "Azure Directory (Microsoft)", value: "azure" },
  { label: "Google", value: "google" },
  { label: "Okta", value: "okta" },
];
const ssoFields: Record<string, { name: string; label: string; type: string }[]> = {
  azure: [
    { name: "clientId", label: "Client ID", type: "text" },
    { name: "clientSecret", label: "Client Secret", type: "password" },
    { name: "tenantId", label: "Tenant ID", type: "text" },
    { name: "redirectUrl", label: "Redirect URL", type: "text" },
  ],
  google: [
    { name: "clientId", label: "Client ID", type: "text" },
    { name: "clientSecret", label: "Client Secret", type: "password" },
    { name: "projectId", label: "Project ID", type: "text" },
    { name: "redirectUrl", label: "Redirect URL", type: "text" },
  ],
  okta: [
    { name: "clientId", label: "Client ID", type: "text" },
    { name: "clientSecret", label: "Client Secret", type: "password" },
    { name: "issuer", label: "Issuer URL", type: "text" },
    { name: "redirectUrl", label: "Redirect URL", type: "text" },
  ],
};

const SSOPage = ({onNext}) => {
  const [selectedSSO, setSelectedSSO] = useState<string>("azure");

  const validationSchema = Yup.object(
    ssoFields[selectedSSO].reduce((acc, field) => {
      acc[field.name] = Yup.string().required(`${field.label} is required`);
      return acc;
    }, {} as Record<string, Yup.StringSchema>)
  );

  return (
    <div className="flex justify-center items-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-center text-xl font-semibold mb-4">
          SSO Configuration Confirmation
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Select your SSO type and provide the required details.
        </p>
        <Formik
          initialValues={ssoFields[selectedSSO].reduce(
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
         
            const allFieldsFilled = ssoFields[selectedSSO].every(
              (field) => values[field.name].trim() !== ""
            );

            return (
              <Form>
                {/* SSO Type Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select SSO Type
                  </label>
                  <Select
                    value={selectedSSO}
                    onValueChange={(value) => setSelectedSSO(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select SSO Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ssoOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic Fields */}
                {ssoFields[selectedSSO].map((field) => (
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

                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    type="submit"
                    className={`w-full py-2 px-4 rounded-md text-white ${
                      allFieldsFilled
                        ? "bg-foreground hover:bg-blue-900"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                    disabled={!allFieldsFilled || isSubmitting}
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

export default SSOPage;
