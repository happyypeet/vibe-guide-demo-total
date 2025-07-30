'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "什么是VibeGuide？",
    answer: "VibeGuide是一个智能AI开发文档平台，帮助编程新手快速生成专业的项目开发文档，包括用户旅程地图、产品需求PRD、前后端设计文档、数据库设计等。"
  },
  {
    question: "如何使用项目点数？",
    answer: "每创建一个完整的项目文档需要消耗1个项目点数。基础版提供10个点数，专业版提供30个点数。点数用完后可以再次购买。"
  },
  {
    question: "生成的文档质量如何？",
    answer: "我们使用Claude Sonnet 4 AI模型，基于您提供的项目描述和需求分析，生成专业级别的开发文档。文档结构清晰，内容详实，适合实际开发使用。"
  },
  {
    question: "支持哪些文档格式？",
    answer: "支持Markdown和HTML两种格式预览，可以单独下载某个文档，也可以批量下载所有文档的ZIP包。"
  },
  {
    question: "是否支持文档编辑？",
    answer: "生成的文档可以在平台上预览，您可以复制内容到其他编辑器进行修改。我们也在开发在线编辑功能。"
  },
  {
    question: "如何获得技术支持？",
    answer: "基础版用户享有基础技术支持，专业版用户享有优先技术支持。您可以通过邮件或在线客服联系我们。"
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            常见问题<span className="text-blue-600">解答</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            关于VibeGuide的常见问题，帮助您更好地了解我们的服务
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-left">{faq.question}</CardTitle>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </CardHeader>
              
              {openIndex === index && (
                <CardContent className="pt-0">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}