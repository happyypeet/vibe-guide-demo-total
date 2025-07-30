"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from '@/lib/supabase/client';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "basic";
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // 支付计划配置
  const plans = {
    basic: {
      name: "基础套餐",
      price: 20,
      points: 10,
      description: "适合小型项目"
    },
    premium: {
      name: "高级套餐",
      price: 40,
      points: 30,
      description: "适合中大型项目"
    }
  };
  
  const selectedPlan = plans[plan as keyof typeof plans] || plans.basic;
  
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/auth/login");
        return;
      }
      
      setUser(user);
      setLoading(false);
    };
    
    fetchUser();
  }, [router]);
  
  const handlePayment = async () => {
    if (!user) return;
    
    try {
      // 生成订单号
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 调用API创建支付订单
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          amount: selectedPlan.price,
          userId: user.id,
          plan: plan
        }),
      });
      
      const result = await response.json();
      
      if (result.success && result.data.payurl) {
        // 跳转到支付页面
        window.location.href = result.data.payurl;
      } else {
        console.error("支付创建失败:", result.error);
        alert("支付创建失败，请稍后重试");
      }
    } catch (error) {
      console.error("支付错误:", error);
      alert("支付过程中出现错误，请稍后重试");
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-20">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p>加载中...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-20">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="text-center">
              <CardTitle className="text-2xl">确认支付</CardTitle>
              <CardDescription>请选择支付方式完成购买</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">{selectedPlan.name}</h3>
                <p className="text-gray-600">{selectedPlan.description}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">套餐内容</span>
                  <span className="font-medium">{selectedPlan.points} 点数</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">支付金额</span>
                  <span className="font-semibold text-lg">¥{selectedPlan.price}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-6">
                点击下方按钮将跳转到安全支付页面完成付款。
              </p>
              <Button className="w-full" onClick={handlePayment}>
                立即支付 ¥{selectedPlan.price}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}