import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

interface Step2RequirementsProps {
  description: string;
  requirements: string;
  onRequirementsChange: (requirements: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function Step2Requirements({ 
  description, 
  requirements, 
  onRequirementsChange, 
  onNext, 
  onPrevious 
}: Step2RequirementsProps) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [localRequirements, setLocalRequirements] = useState(requirements);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generateQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/ai/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ description }),
        });

        if (response.ok) {
          const data = await response.json();
          setQuestions(data.questions);
        }
      } catch (error) {
        console.error('Failed to generate questions:', error);
        // 提供默认问题
        setQuestions([
          "您的目标用户群体是谁？他们有什么特点？",
          "项目的核心功能有哪些？优先级如何？",
          "您希望项目具备什么样的用户体验？",
          "项目需要支持多少并发用户？",
          "您对技术栈有什么特殊要求或偏好吗？"
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (description && questions.length === 0) {
      generateQuestions();
    }
  }, [description, questions.length]);

  const handleNext = async () => {
    // 检查用户是否有足够的点数
    try {
      const response = await fetch('/api/user/credits');
      if (!response.ok) {
        throw new Error('Failed to check credits');
      }
      
      const { credits } = await response.json();
      if (credits <= 0) {
        if (confirm('您的项目点数不足，需要充值后才能继续。是否前往充值页面？')) {
          window.location.href = '/pricing';
        }
        return;
      }

      onRequirementsChange(localRequirements);
      onNext();
    } catch (error) {
      console.error('Failed to check credits:', error);
      alert('检查点数失败，请稍后重试');
    }
  };

  const isValid = localRequirements.trim().length >= 50;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                AI正在分析您的项目，生成针对性问题...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">深入需求分析</CardTitle>
          <CardDescription>
            基于您的项目描述，AI为您生成了以下问题，请详细回答以帮助生成更准确的文档
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-3">📋 AI生成的问题：</h4>
            <ul className="space-y-2">
              {questions.map((question, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                  {index + 1}. {question}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">您的详细回答</Label>
            <Textarea
              id="requirements"
              placeholder="请逐一回答上述问题，提供尽可能详细的信息。这将帮助AI生成更符合您需求的项目文档..."
              value={localRequirements}
              onChange={(e) => setLocalRequirements(e.target.value)}
              className="min-h-[300px] resize-none"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>至少需要50个字符</span>
              <span>{localRequirements.length}/2000</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={onPrevious}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              上一步
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!isValid}
              className="flex-1"
              size="lg"
            >
              下一步：创建文档
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}