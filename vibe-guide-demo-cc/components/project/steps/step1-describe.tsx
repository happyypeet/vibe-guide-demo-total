import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

interface Step1DescribeProps {
  description: string;
  onDescriptionChange: (description: string) => void;
  onNext: () => void;
}

export function Step1Describe({ description, onDescriptionChange, onNext }: Step1DescribeProps) {
  const [localDescription, setLocalDescription] = useState(description);

  const handleNext = () => {
    onDescriptionChange(localDescription);
    onNext();
  };

  const isValid = localDescription.trim().length >= 20;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">描述您的项目</CardTitle>
          <CardDescription>
            请详细描述您要开发的项目，包括项目目标、主要功能、目标用户等信息
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">项目描述</Label>
            <Textarea
              id="description"
              placeholder="例如：我想开发一个在线学习平台，主要功能包括课程管理、在线视频播放、作业提交、学习进度跟踪等。目标用户是想要在线学习编程技能的学生和职场人士..."
              value={localDescription}
              onChange={(e) => setLocalDescription(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>至少需要20个字符</span>
              <span>{localDescription.length}/1000</span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              💡 描述建议
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• 明确说明项目的主要目标和用途</li>
              <li>• 列出核心功能和特性</li>
              <li>• 描述目标用户群体</li>
              <li>• 提及技术要求或偏好（如果有）</li>
            </ul>
          </div>

          <Button 
            onClick={handleNext}
            disabled={!isValid}
            className="w-full"
            size="lg"
          >
            下一步：深入需求分析
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}