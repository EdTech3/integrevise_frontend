import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useState, useEffect, useCallback } from "react";
import { Autocomplete } from "@/components/ui/autocomplete";
import debounce from "lodash.debounce";
import { axiosInstance } from "@/lib/axios";
import { urlConfig } from "@/lib/utils/urls";
import { API_ROUTES } from "@/lib/config/api";

interface UniversityOption {
  label: string;
}

interface UniversityDetailsProps {
  onNext: () => void;
}

const validationSchema = Yup.object().shape({
  universityName: Yup.string().required("University Name is required"),
});

const UniversityDetails: React.FC<UniversityDetailsProps> = ({ onNext }) => {
  const [universityOptions, setUniversityOptions] = useState<
    UniversityOption[]
  >([]);
  const [isDomainAvailable, setIsDomainAvailable] = useState(false);
  const [checkingDomain, setCheckingDomain] = useState(false);
  const [attemptedDomainCheck, setAttemptedDomainCheck] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchUniversityNames = async () => {
      try {
        const response = await axiosInstance.get(
          `${urlConfig.apiUrl}${API_ROUTES.onboarding.availableUiniversities}`
        );
        console.log("Response data:", response.data);

        const options = response.data.universities.map((uni: string) => ({
          label: uni,
        }));
        setUniversityOptions(options);
      } catch (error) {
        console.error("Failed to fetch university names:", error);
        setUniversityOptions([{ label: "Error fetching universities" }]);
      }
    };

    fetchUniversityNames();
  }, []);

  const checkDomainAvailability = useCallback(
    debounce(async (domain: string) => {
      try {
        setCheckingDomain(true);
        const response = await axiosInstance.post(
          `${urlConfig.apiUrl}${API_ROUTES.onboarding.checkDomain}/${domain}`
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
                `${urlConfig.apiUrl}${API_ROUTES.onboarding.createUniversity}`,
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
                <Autocomplete
                  options={universityOptions.map((opt) => opt.label)}
                  onChange={(value) => {
                    if (!isSubmitted) {
                      setFieldValue("universityName", value);
                      const suggestedSubdomain = suggestSubdomain(value);
                      setFieldValue("subdomain", suggestedSubdomain);
                      checkDomainAvailability(suggestedSubdomain);
                    }
                  }}
                  placeholder="Select or type your university"
                />
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
                  disabled={isSubmitted}
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
                    <span className="text-green-600 font-medium">
                      Domain Available
                    </span>
                  ) : attemptedDomainCheck && !isDomainAvailable ? (
                    <span className="text-red-600 font-medium">
                      Domain Not Available
                    </span>
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
