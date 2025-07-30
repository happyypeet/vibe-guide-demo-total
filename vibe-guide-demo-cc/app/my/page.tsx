'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, CreditCard, History, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { User as UserType, Payment } from "@/lib/db/schema";

export default function MyPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, paymentsResponse] = await Promise.all([
          fetch('/api/user/profile-test'), // 临时使用测试端点
          fetch('/api/user/payments')
        ]);

        if (!userResponse.ok) {
          router.push('/auth/login');
          return;
        }

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }

        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json();
          setPayments(paymentsData);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '待支付',
      completed: '已完成',
      failed: '失败',
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
      completed: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
      failed: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <DashboardHeader title="个人中心" />
          <div className="p-6">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <DashboardHeader 
          title="个人中心"
          description="管理您的账户信息和项目点数"
        />

        <div className="p-6 space-y-6">
          {/* 用户信息卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">账户信息</CardTitle>
                <User className="h-5 w-5 text-blue-600 ml-auto" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">邮箱</span>
                    <span className="font-medium">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">注册时间</span>
                    <span className="text-sm">{user ? formatDate(user.createdAt) : ''}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">项目点数</CardTitle>
                <CreditCard className="h-5 w-5 text-green-600 ml-auto" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {user?.credits || 0}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      剩余点数
                    </p>
                  </div>
                  
                  {(user?.credits || 0) === 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        您的项目点数已用完
                      </p>
                      <Button size="sm" asChild>
                        <Link href="/pricing">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          获取点数
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 支付历史 */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">支付历史</CardTitle>
              <History className="h-5 w-5 text-purple-600 ml-auto" />
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    暂无支付记录
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/pricing">前往充值</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            +{payment.credits} 点数
                          </span>
                          <Badge className={getPaymentStatusColor(payment.status)}>
                            {getPaymentStatusText(payment.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          订单号：{payment.outTradeNo}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">¥{payment.amount}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(payment.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 快捷操作 */}
          <Card>
            <CardHeader>
              <CardTitle>快捷操作</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button asChild>
                  <Link href="/projects/new">
                    创建新项目
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/projects">
                    查看我的项目
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/pricing">
                    购买点数
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}