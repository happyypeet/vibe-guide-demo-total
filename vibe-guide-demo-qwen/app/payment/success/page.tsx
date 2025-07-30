"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState({
    orderId: "",
    amount: 0,
    points: 0,
  });

  useEffect(() => {
    // 从URL参数获取支付信息
    const orderId = searchParams.get("out_trade_no") || "";
    const amount = parseFloat(searchParams.get("money") || "0");
    
    // 根据金额确定点数
    let points = 0;
    if (amount === 20) {
      points = 10;
    } else if (amount === 40) {
      points = 30;
    }
    
    setPaymentInfo({
      orderId,
      amount,
      points,
    });
  }, [searchParams]);

  const handleBackToDashboard = () => {
    router.push("/my");
  };

  return (
    <div className="container mx-auto py-20">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <CardTitle className="text-2xl">支付成功</CardTitle>
              <CardDescription>感谢您的购买</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">订单号</span>
                <span className="font-medium">{paymentInfo.orderId || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">支付金额</span>
                <span className="font-medium">¥{paymentInfo.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">获得点数</span>
                <span className="font-medium">{paymentInfo.points} 点</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-6">
                您的点数已成功添加到账户中，现在可以创建新的项目文档了。
              </p>
              <Button className="w-full" onClick={handleBackToDashboard}>
                返回仪表盘
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}