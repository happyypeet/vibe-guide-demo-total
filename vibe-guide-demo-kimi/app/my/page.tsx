import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserWithPoints, getUser } from "@/lib/auth";
import Link from "next/link";
import { Gift, Package } from "lucide-react";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { format } from "date-fns";
import { zh } from "date-fns/locale";

export default async function ProfilePage() {
  const user = await getUserWithPoints();
  const authUser = await getUser();
  
  if (!user || !authUser) {
    return null;
  }

  const paymentHistory = await db
    .select()
    .from(payments)
    .where(eq(payments.userId, user.id))
    .orderBy(payments.createdAt);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">个人中心</h1>

      <div className="grid gap-6">
        {/* 用户信息卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>用户信息</CardTitle>
            <CardDescription>您的账户信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  邮箱地址
                </label>
                <p className="text-lg">{authUser.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  注册时间
                </label>
                <p>{format(new Date(authUser.created_at), 'yyyy年MM月dd日', { locale: zh })}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 项目点数卡片 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>项目点数</span>
              <Package className="w-5 h-5" />
            </CardTitle>
            <CardDescription>用于创建新项目的点数</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600">{user.projectPoints}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">剩余点数</p>
              </div>
              
              {user.projectPoints === 0 && (
                <Button asChild>
                  <Link href="/pricing" className="flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    获取点数
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 支付历史卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>支付历史</CardTitle>
            <CardDescription>您的充值记录</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentHistory.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-600 dark:text-slate-400">
                  暂无支付记录
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">充值 {payment.projectPoints} 项目点数</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {format(new Date(payment.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zh })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">¥{payment.amount}</p>
                      <p className={`text-sm ${
                        payment.status === 'completed' 
                          ? 'text-green-600' 
                          : payment.status === 'pending' 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                      }`}>
                        {payment.status === 'completed' ? '已完成' : 
                         payment.status === 'pending' ? '处理中' : '已失败'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 快速操作卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
            <CardDescription>常用功能快捷入口</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/projects">查看项目</Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/projects/new">创建项目</Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/pricing">购买点数</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}