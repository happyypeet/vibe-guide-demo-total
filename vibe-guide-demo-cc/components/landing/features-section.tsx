import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Code, 
  Users, 
  Zap,
  Brain,
  Target
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI智能分析",
    description: "基于Claude Sonnet 4模型，深度理解项目需求，生成专业文档"
  },
  {
    icon: FileText,
    title: "5类核心文档",
    description: "用户旅程地图、产品PRD、前端设计、后端设计、数据库设计"
  },
  {
    icon: Target,
    title: "三步骤流程",
    description: "描述项目 → 深入需求 → 创建文档，简单高效的创建流程"
  },
  {
    icon: Code,
    title: "多格式导出",
    description: "支持Markdown和HTML格式预览，单文档或批量ZIP下载"
  },
  {
    icon: Users,
    title: "新手友好",
    description: "专为编程新手设计，无需复杂配置即可生成专业文档"
  },
  {
    icon: Zap,
    title: "快速生成",
    description: "AI驱动的文档生成，几分钟内完成完整项目文档"
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            为什么选择 <span className="text-blue-600">VibeGuide</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            专业的AI开发文档生成平台，帮助您快速创建高质量的项目文档
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}