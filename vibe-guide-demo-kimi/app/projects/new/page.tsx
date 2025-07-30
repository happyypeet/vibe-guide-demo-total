"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { aiService } from "@/lib/ai";
import { getUserWithPoints } from "@/lib/auth";

interface ProjectData {
  description: string;
  detailedRequirements: string;
  questions: string[];
  answers: Record<string, string>;
  documents?: {
    userJourney?: string;
    prd?: string;
    frontendDesign?: string;
    backendDesign?: string;
    databaseDesign?: string;
  };
}

export default function NewProjectPage() {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData>({
    description: "",
    detailedRequirements: "",
    questions: [],
    answers: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleNextStep = async () => {
    setError("");
    
    if (step === 1) {
      if (projectData.description.length < 20) {
        setError("项目描述至少需要20个字符");
        return;
      }
      
      setLoading(true);
      try {
        const questions = await aiService.generateQuestions(projectData.description);
        setProjectData(prev => ({ ...prev, questions }));
        setStep(2);
      } catch (err) {
        setError("生成问题失败，请重试");
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      const unanswered = projectData.questions.filter(q => !projectData.answers[q]?.trim());
      if (unanswered.length > 0) {
        setError("请回答所有问题");
        return;
      }
      
      setLoading(true);
      try {
        const documents = await aiService.generateDocuments({
          projectDescription: projectData.description,
          detailedRequirements: projectData.detailedRequirements,
          userAnswers: projectData.answers,
        });
        
        setProjectData(prev => ({ ...prev, documents }));
        setStep(3);
      } catch (err) {
        setError("生成文档失败，请重试");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveProject = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectData.description.substring(0, 50) + '...',
          description: projectData.description,
          detailedRequirements: projectData.detailedRequirements,
          aiQuestions: projectData.questions,
          userAnswers: projectData.answers,
          documents: projectData.documents,
          isCompleted: true,
        }),
      });

      if (!response.ok) throw new Error('保存失败');
      
      router.push('/projects');
    } catch (err) {
      setError("保存项目失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { name: "描述项目", description: "详细描述您的项目需求" },
    { name: "深入需求", description: "回答AI生成的问题" },
    { name: "创建文档", description: "生成完整的技术文档" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">创建新项目</h1>
            <p className="text-slate-600 dark:text-slate-400">
              使用AI Agent 辅助您完成专业的项目需求分析
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              步骤 {step} / {steps.length}
            </p>
            <Progress value={(step / steps.length) * 100} className="w-32" />
          </div>
        </div>
        
        <div className="flex justify-center mb-8">
          {steps.map((s, index) => (
            <div key={index} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                  step >= index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                )}
              >
                {index + 1}
              </div>
              
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-20 h-0.5",
                  step > index + 1
                    ? "bg-blue-500"
                    : "bg-slate-200 dark:bg-slate-700"
                )} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mb-6">
          <h3 className="font-semibold mb-1">{steps[step - 1].name}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{steps[step - 1].description}</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">项目描述</Label>
                <Textarea
                  id="description"
                  placeholder="请详细描述您的项目需求，包括目标用户、核心功能、预期效果等..."
                  className="min-h-[200px]"
                  value={projectData.description}
                  onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                />
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  最少20个字符
                </p>
              </div>
              
              <div>
                <Label htmlFor="requirements">详细需求（可选）</Label>
                <Textarea
                  id="requirements"
                  placeholder="如果有特殊的技术要求、设计偏好或其他详细信息，请在这里补充..."
                  className="min-h-[100px]"
                  value={projectData.detailedRequirements}
                  onChange={(e) => setProjectData(prev => ({ ...prev, detailedRequirements: e.target.value }))}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                基于您的项目描述，请回答以下问题以帮助我们更好地理解需求：
              </p>
              
              {projectData.questions.map((question, index) => (
                <div key={index} className="space-y-2">
                  <Label>{index + 1}. {question}</Label>
                  <Textarea
                    placeholder="请详细回答..."
                    className="min-h-[80px]"
                    value={projectData.answers[question] || ""}
                    onChange={(e) => setProjectData(prev => ({
                      ...prev,
                      answers: { ...prev.answers, [question]: e.target.value }
                    }))}
                  />
                </div>
              ))}
            </div>
          )}

          {step === 3 && projectData.documents && (
            <div className="space-y-4">
              <p className="text-center text-green-600 dark:text-green-400 mb-4">
                🎉 文档生成完成！
              </p>
              
              <div className="grid gap-4">
                {Object.entries(projectData.documents).map(([key, content]) => (
                  <Card key={key}>
                    <CardHeader>
                      <CardTitle className="text-lg">{getDocumentTitle(key)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-40 overflow-y-auto bg-slate-50 dark:bg-slate-800 p-4 rounded-md">
                        <pre className="text-sm whitespace-pre-wrap">{content?.substring(0, 200)}...</pre>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={loading}
          >
            上一步
          </Button>
        )}
        
        {step < 3 ? (
          <Button onClick={handleNextStep} disabled={loading}>
            {loading ? "处理中..." : "下一步"}
          </Button>
        ) : (
          <Button onClick={handleSaveProject} disabled={loading}>
            {loading ? "保存中..." : "保存项目"}
          </Button>
        )}
      </div>
    </div>
  );
}

function getDocumentTitle(key: string): string {
  const titles: Record<string, string> = {
    userJourney: "用户旅程地图",
    prd: "产品需求文档",
    frontendDesign: "前端设计文档",
    backendDesign: "后端设计文档",
    databaseDesign: "数据库设计文档",
  };
  return titles[key] || key;
}