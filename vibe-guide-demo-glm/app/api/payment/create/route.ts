import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createZPayUrl } from '@/lib/zpay'
import { db } from '@/lib/db'
import { paymentHistory } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await request.json()

    if (!plan || !['basic', 'pro'].includes(plan)) {
      return NextResponse.json({ 
        error: 'Invalid plan' 
      }, { status: 400 })
    }

    // Define plan details
    const planDetails = {
      basic: {
        name: '基础版 - 10个项目',
        money: '20.00',
        credits: 10
      },
      pro: {
        name: '专业版 - 30个项目',
        money: '40.00',
        credits: 30
      }
    }

    const selectedPlan = planDetails[plan as keyof typeof planDetails]
    
    if (!selectedPlan) {
      return NextResponse.json({ 
        error: 'Invalid plan' 
      }, { status: 400 })
    }

    // Generate unique order number
    const out_trade_no = `${Date.now()}${Math.floor(Math.random() * 1000)}`
    
    // Create payment record
    const [payment] = await db.insert(paymentHistory).values({
      userId: user.id,
      amount: parseInt(selectedPlan.money),
      credits: selectedPlan.credits,
      paymentId: out_trade_no,
      status: 'pending'
    }).returning()

    // Get environment variables
    const pid = process.env.ZPAY_PID
    const key = process.env.ZPAY_PKEY
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    if (!pid || !key) {
      return NextResponse.json({ 
        error: 'Payment configuration not found' 
      }, { status: 500 })
    }

    // Create payment URL
    const paymentUrl = createZPayUrl({
      pid,
      money: selectedPlan.money,
      name: selectedPlan.name,
      out_trade_no,
      notify_url: `${siteUrl}/api/payment/notify`,
      return_url: `${siteUrl}/dashboard/payment/success?payment_id=${out_trade_no}`,
      type: 'alipay',
      param: JSON.stringify({ userId: user.id, plan, credits: selectedPlan.credits })
    }, key)

    return NextResponse.json({
      paymentUrl,
      paymentId: out_trade_no,
      plan: selectedPlan
    })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json({ 
      error: 'Failed to create payment' 
    }, { status: 500 })
  }
}