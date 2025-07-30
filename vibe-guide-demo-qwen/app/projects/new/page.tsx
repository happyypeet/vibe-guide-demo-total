"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { generateProjectQuestions } from '@/lib/ai/claude';

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 在第二步时生成问题
  useEffect(() => {
    if (step === 2 && questions.length === 0) {
      generateQuestions();
    }
  }, [step]);

  const generateQuestions = async () => {
    if (projectDescription.trim().length < 20) {
      setError("项目描述至少需要20个字");
      return;
    }
    
    setIsGenerating(true);
    setError("");
    
    try {
      const generatedQuestions = await generateProjectQuestions(projectDescription);
      setQuestions(generatedQuestions);
    } catch (err) {
      console.error("生成问题失败:", err);
      setQuestions([
        "您的项目主要面向哪些用户群体？",
        "项目的核心功能有哪些？",
        "您希望项目具备哪些技术特性？"
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (projectName.trim().length === 0) {
        setError("请输入项目名称");
        return;
      }
      
      if (projectDescription.trim().length < 20) {
        setError("项目描述至少需要20个字");
        return;
      }
      
      setError("");
      setStep(2);
      return;
    }
    
    // 在第二步到第三步时检查回答是否完整
    if (step === 2) {
      const hasUnanswered = questions.some((_, index) => !answers[index] || answers[index].trim().length === 0);
      
      if (hasUnanswered) {
        setError("请回答所有问题");
        return;
      }
      
      setError("");
      setStep(3);
      return;
    }
    
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers({
      ...answers,
      [index]: value
    });
  };

  const handleGenerateDocuments = async () => {
    // 检查用户是否有足够的点数（这里简化处理，实际应该调用API检查）
    const hasPoints = false; // 模拟检查
    
    if (!hasPoints) {
      const confirm = window.confirm("您的点数不足，需要充值后才能继续创建项目。是否前往充值页面？");
      if (confirm) {
        router.push("/marketing/pricing");
      }
      return;
    }
    
    // 提交表单生成文档
    setIsSubmitting(true);
    setError("");
    
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          projectDescriptionText: projectDescription,
          answers
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // 跳转到项目详情页面
        router.push(`/projects/${result.data.projectId}`);
      } else {
        setError(result.error || "文档生成失败");
      }
    } catch (err) {
      console.error("文档生成错误:", err);
      setError("文档生成过程中出现错误，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">创建新项目</h1>
        <p className="text-gray-600">使用AI Agent辅助您完成专业的项目需求分析</p>
      </div>

      {/* 步骤条 */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === num 
                  ? "bg-blue-500 text-white" 
                  : step > num 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-200 text-gray-500"
              }`}>
                {step > num ? <CheckCircle className="w-5 h-5" /> : num}
              </div>
              <span className="mt-2 text-sm font-medium">
                {num === 1 && "描述项目"}
                {num === 2 && "深入需求"}
                {num === 3 && "创建文档"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 步骤内容 */}
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "描述项目"}
            {step === 2 && "深入需求"}
            {step === 3 && "创建文档"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "请填写项目名称并详细描述您的项目，至少20个字"}
            {step === 2 && "AI已根据您的项目描述生成了以下问题，请逐一回答"}
            {step === 3 && "AI将根据您的描述和回答生成专业文档"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="project-name">项目名称</Label>
                <Textarea
                  id="project-name"
                  placeholder="请输入项目名称"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-description">项目描述</Label>
                <Textarea
                  id="project-description"
                  placeholder="请详细描述您的项目，包括项目目标、主要功能、目标用户等..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={6}
                />
                <div className="text-right text-sm text-gray-500">
                  {projectDescription.length}/20 字符
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleNextStep}
                  disabled={projectDescription.trim().length < 20 || projectName.trim().length === 0}
                >
                  下一步
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" />
                  <p>AI正在分析您的项目并生成问题...</p>
                </div>
              ) : (
                <>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>AI分析完成</AlertTitle>
                    <AlertDescription>
                      AI已根据您的项目描述生成了以下问题，请逐一回答以便更好地理解您的需求。
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-6">
                    {questions.map((question, index) => (
                      <div key={index} className="space-y-2">
                        <Label htmlFor={`question-${index}`}>
                          {index + 1}. {question}
                        </Label>
                        <Textarea
                          id={`question-${index}`}
                          placeholder="请详细回答这个问题..."
                          value={answers[index] || ""}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                          rows={3}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep}>
                      上一步
                    </Button>
                    <Button 
                      onClick={handleNextStep}
                      disabled={questions.some((_, index) => !answers[index] || answers[index].trim().length === 0)}
                    >
                      下一步
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>准备生成文档</AlertTitle>
                <AlertDescription>
                  AI将根据您的项目描述和回答生成以下类型的文档：
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">用户旅程地图</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">产品需求PRD</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">前端设计文档</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">后端设计文档</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">数据库设计</CardTitle>
                  </CardHeader>
                </Card>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevStep}>
                  上一步
                </Button>
                <Button 
                  onClick={handleGenerateDocuments}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    "创建文档"
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}