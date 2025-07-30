import { Card } from "@/components/ui/card";
import { 
  Brain, 
  FileText, 
  Zap, 
  Users, 
  DollarSign, 
  Shield 
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI智能分析",
    description: "基于项目描述，智能生成针对性的问题和建议",
    color: "text-blue-500"
  },
  {
    icon: FileText,
    title: "完整文档",
    description: "自动生成用户旅程、PRD、前端、后端、数据库设计文档",
    color: "text-green-500"
  },
  {
    icon: Zap,
    title: "快速生成",
    description: "几分钟内完成从需求到技术方案的完整转换",
    color: "text-yellow-500"
  },
  {
    icon: Users,
    title: "新手友好",
    description: "专为编程新手设计，降低技术门槛",
    color: "text-purple-500"
  },
  {
    icon: DollarSign,
    title: "按需付费",
    description: "灵活的付费模式，用多少付多少",
    color: "text-orange-500"
  },
  {
    icon: Shield,
    title: "数据安全",
    description: "企业级安全保障，保护您的项目数据",
    color: "text-red-500"
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            核心功能
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            一站式解决项目开发的技术难题
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}