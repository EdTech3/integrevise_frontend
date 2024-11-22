"use client";
import React, { useState } from "react";
import Stepper from "../components/stepper/Stepper";
import UniversityDetails from "../components/universityDeatils";
import SSOPage from "../components/ssoIntegration";
import lmsIntegration from "../components/lmsIntegration";
import roleAssignment from "../components/roleAssignment";
import Pattern from "../components/pattern";
import Logo from "@/components/shared/Logo";

const steps = [
  { title: "Step 1", component: UniversityDetails },
  { title: "Step 2", component: SSOPage },
  { title: "Step 3", component: lmsIntegration },
  { title: "Step 4", component: roleAssignment },
];

const SignupPage = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleNextStep = () => {
    setCurrentStepIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrevStep = () => {
    setCurrentStepIndex((prevIndex) => prevIndex - 1);
  };

  const handleJumpToStep = (stepIndex) => {
    setCurrentStepIndex(stepIndex);
  };

  const currentStep = steps[currentStepIndex];

  return (
    <div className="min-h-screen bg-white flex">
      <div className="w-2/6">
        <Pattern />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <Logo type="welcome" className="mb-10" />

       
          <Stepper
            steps={steps}
            currentStepIndex={currentStepIndex}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            onJump={handleJumpToStep}
          />


        {currentStep && (
          <div className="mt-8 w-3/4">
            <currentStep.component onNext={handleNextStep}  />
          </div>
        )}
      </div>
    </div>
  );
};
export default SignupPage;
