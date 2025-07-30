'use client';

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardHeader } from "@/components/dashboard/header";
import { StepIndicator } from "@/components/project/step-indicator";
import { Step1Describe } from "@/components/project/steps/step1-describe";
import { Step2Requirements } from "@/components/project/steps/step2-requirements";
import { Step3Generate } from "@/components/project/steps/step3-generate";

const steps = ["描述项目", "深入需求", "创建文档"];

export default function NewProjectPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState({
    description: "",
    requirements: "",
  });

  const handleDescriptionChange = (description: string) => {
    setProjectData(prev => ({ ...prev, description }));
  };

  const handleRequirementsChange = (requirements: string) => {
    setProjectData(prev => ({ ...prev, requirements }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const previousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <DashboardLayout>
      <DashboardHeader 
        title="创建新项目"
        description="使用AI Agent辅助您完成专业的项目需求分析"
      />
      
      <div className="p-6">
        <StepIndicator steps={steps} currentStep={currentStep} />
        
        <div className="mt-8">
          {currentStep === 1 && (
            <Step1Describe
              description={projectData.description}
              onDescriptionChange={handleDescriptionChange}
              onNext={nextStep}
            />
          )}
          
          {currentStep === 2 && (
            <Step2Requirements
              description={projectData.description}
              requirements={projectData.requirements}
              onRequirementsChange={handleRequirementsChange}
              onNext={nextStep}
              onPrevious={previousStep}
            />
          )}
          
          {currentStep === 3 && (
            <Step3Generate
              description={projectData.description}
              requirements={projectData.requirements}
              onPrevious={previousStep}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}