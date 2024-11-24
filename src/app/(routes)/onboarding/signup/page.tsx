"use client";
import React, { useState } from "react";
import Stepper from "../components/stepper/Stepper";
import UniversityDetails from "../components/universityDeatils";
import SSOPage from "../components/ssoIntegration";
import LmsIntegration from "../components/lmsIntegration";
import RoleAssignment from "../components/roleAssignment";
import Logo from "@/components/shared/Logo";
import Sidebar from "../components/sideBar";

const steps = [
  { title: "University Details", component: UniversityDetails },
  { title: "SSO Integration", component: SSOPage },
  { title: "LMS Integration", component: LmsIntegration },
  { title: "Role Assignment", component: RoleAssignment },
];

const SignupPage = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleNextStep = () => {
    setCurrentStepIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrevStep = () => {
    setCurrentStepIndex((prevIndex) => prevIndex - 1);
  };

  const handleJumpToStep = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
  };

  const handleFinish = () => {
    console.log("Stepper completed");
  };

  const renderStepContent = () => {
    const StepComponent = steps[currentStepIndex].component;
    return (
      <StepComponent
        onNext={handleNextStep}
        onFinish={handleFinish}
      />
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="hidden lg:block lg:w-2/6">
        <Sidebar bgColorClass="bg-gray-500" patternColorClass="text-white" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-0">
        <Logo type="welcome" className="mb-10" />

        {/* Stepper */}
        <div className="w-full">
          <Stepper
            steps={steps}
            currentStepIndex={currentStepIndex}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            onJump={handleJumpToStep}
            onFinish={handleFinish}
          />
        </div>

        {/* Current Step */}
        <div className="mt-8 w-full lg:4/6">{renderStepContent()}</div>
      </div>
    </div>
  );
};

export default SignupPage;
