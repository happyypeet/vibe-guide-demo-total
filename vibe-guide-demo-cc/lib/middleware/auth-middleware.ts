import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { CreditsManager } from '@/lib/credits';

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
    email: string;
    credits: number;
  };
}

/**
 * 认证中间件
 */
export async function authMiddleware(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    // 将用户信息添加到请求对象
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = user;

    return await handler(authenticatedRequest);
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: '认证失败' },
      { status: 401 }
    );
  }
}

/**
 * 点数检查中间件
 */
export async function creditsMiddleware(
  requiredCredits: number = 1
) {
  return async (
    request: AuthenticatedRequest,
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    try {
      const hasCredits = await CreditsManager.hasEnoughCredits(
        request.user.id, 
        requiredCredits
      );

      if (!hasCredits) {
        return NextResponse.json(
          { error: '点数不足，请先充值' },
          { status: 403 }
        );
      }

      return await handler(request);
    } catch (error) {
      console.error('Credits middleware error:', error);
      return NextResponse.json(
        { error: '点数检查失败' },
        { status: 500 }
      );
    }
  };
}

/**
 * 组合中间件
 */
export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    return authMiddleware(request, handler);
  };
}

export function withAuthAndCredits(
  requiredCredits: number = 1
) {
  return function (
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>
  ) {
    return async (request: NextRequest) => {
      return authMiddleware(request, async (authReq) => {
        const creditsCheck = await creditsMiddleware(requiredCredits);
        return creditsCheck(authReq, handler);
      });
    };
  };
}

/**
 * 速率限制中间件
 */
interface RateLimitConfig {
  windowMs: number; // 时间窗口（毫秒）
  maxRequests: number; // 最大请求数
}

const rateLimitMap = new Map<string, { count: number; resetTime: number; }>();

export function rateLimit(config: RateLimitConfig) {
  return async (
    request: AuthenticatedRequest,
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    const userId = request.user.id;
    const now = Date.now();
    const key = `${userId}:${request.nextUrl.pathname}`;

    let userLimit = rateLimitMap.get(key);

    if (!userLimit || now > userLimit.resetTime) {
      userLimit = {
        count: 0,
        resetTime: now + config.windowMs
      };
    }

    userLimit.count++;
    rateLimitMap.set(key, userLimit);

    if (userLimit.count > config.maxRequests) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试' },
        { status: 429 }
      );
    }

    return handler(request);
  };
}

/**
 * 日志中间件
 */
export function withLogging(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (request: AuthenticatedRequest) => {
    const start = Date.now();
    
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.nextUrl.pathname} - User: ${request.user?.email}`);
    
    try {
      const response = await handler(request);
      const duration = Date.now() - start;
      
      console.log(`[${new Date().toISOString()}] ${request.method} ${request.nextUrl.pathname} - ${response.status} (${duration}ms)`);
      
      return response;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`[${new Date().toISOString()}] ${request.method} ${request.nextUrl.pathname} - ERROR (${duration}ms):`, error);
      throw error;
    }
  };
}