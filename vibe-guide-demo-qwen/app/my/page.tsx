import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { createClient } from '@/lib/supabase/server';
import { getUserPoints, getPaymentHistoryByUserId } from '@/lib/db/actions';
import { redirect } from 'next/navigation';

export default async function MyPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // 检查用户认证
  if (error || !user) {
    redirect('/auth/login');
  }
  
  // 获取用户点数信息
  const userPoints = await getUserPoints(user.id);
  
  // 获取支付历史
  const paymentHistories = await getPaymentHistoryByUserId(user.id);
  
  // 计算统计数据
  const totalProjects = 8; // 应该从数据库获取
  const totalDocuments = 24; // 应该从数据库获取
  const totalDownloads = 156; // 应该从数据库获取
  
  const handleGetPoints = () => {
    redirect("/marketing/pricing");
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">我的</h1>
        <p className="text-gray-600">管理您的账户信息和项目点数</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 用户信息卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>账户信息</CardTitle>
            <CardDescription>您的账户详细信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">邮箱</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">注册时间</span>
              <span className="font-medium">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">最后登录</span>
              <span className="font-medium">
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 点数信息卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>项目点数</CardTitle>
            <CardDescription>管理您的文档生成点数</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">剩余点数</span>
              <span className={`text-2xl font-bold ${(userPoints?.totalPoints || 0) - (userPoints?.usedPoints || 0) > 0 ? "text-green-600" : "text-red-600"}`}>
                {(userPoints?.totalPoints || 0) - (userPoints?.usedPoints || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">已使用点数</span>
              <span className="font-medium">{userPoints?.usedPoints || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">总计点数</span>
              <span className="font-medium">{userPoints?.totalPoints || 0}</span>
            </div>
            
            {(userPoints?.totalPoints || 0) - (userPoints?.usedPoints || 0) === 0 ? (
              <Button className="w-full" onClick={handleGetPoints}>
                获取点数
              </Button>
            ) : (
              <div className="text-sm text-gray-500">
                每个新项目需要消耗1个点数
              </div>
            )}
          </CardContent>
        </Card>

        {/* 使用统计卡片 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>使用统计</CardTitle>
            <CardDescription>您的项目生成历史</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{totalProjects}</div>
                <div className="text-gray-500">已创建项目</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{totalDocuments}</div>
                <div className="text-gray-500">已生成文档</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{totalDownloads}</div>
                <div className="text-gray-500">已下载文档</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}