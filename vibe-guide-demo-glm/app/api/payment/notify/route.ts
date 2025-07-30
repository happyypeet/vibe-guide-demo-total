import { NextRequest, NextResponse } from 'next/server'
import { verifyZPayCallback } from '@/lib/zpay'
import { db } from '@/lib/db'
import { paymentHistory, userCredits } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams)
    
    // Verify the callback
    const key = process.env.ZPAY_PKEY
    if (!key) {
      return new Response('Payment configuration not found', { status: 500 })
    }

    const isValid = verifyZPayCallback(params, key)
    if (!isValid) {
      return new Response('Invalid signature', { status: 400 })
    }

    // Check payment status
    if (params.trade_status !== 'TRADE_SUCCESS') {
      return new Response('Payment not successful', { status: 400 })
    }

    // Parse additional parameters
    let paramData = {}
    try {
      if (params.param) {
        paramData = JSON.parse(params.param)
      }
    } catch (error) {
      console.error('Error parsing param:', error)
    }

    // Update payment record
    await db
      .update(paymentHistory)
      .set({
        status: 'completed'
      })
      .where(eq(paymentHistory.paymentId, params.out_trade_no))

    // Update user credits
    const userId = (paramData as any).userId
    const credits = (paramData as any).credits || 0

    if (userId && credits > 0) {
      const existingCredits = await db.query.userCredits.findFirst({
        where: eq(userCredits.userId, userId)
      })

      if (existingCredits) {
        await db
          .update(userCredits)
          .set({
            credits: existingCredits.credits + credits,
            updatedAt: new Date()
          })
          .where(eq(userCredits.userId, userId))
      } else {
        await db.insert(userCredits).values({
          userId,
          credits,
        })
      }
    }

    // Return success response
    return new Response('success', { status: 200 })
  } catch (error) {
    console.error('Error processing payment callback:', error)
    return new Response('Internal server error', { status: 500 })
  }
}