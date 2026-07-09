import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { eventType, shopId, promotionId, campaignId, metadata } = body

    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null
    const userAgent = request.headers.get("user-agent") || null

    // Determine device type from user agent
    let deviceType: string | null = null
    if (userAgent) {
      if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) deviceType = "MOBILE"
      else if (/tablet|ipad/i.test(userAgent)) deviceType = "TABLET"
      else if (/bot|crawler|spider/i.test(userAgent)) deviceType = "BOT"
      else deviceType = "DESKTOP"
    }

    const event = await prisma.analyticsEvent.create({
      data: {
        userId: session?.user?.id || null,
        shopId: shopId || null,
        promotionId: promotionId || null,
        campaignId: campaignId || null,
        eventType,
        ipAddress,
        userAgent,
        deviceType: deviceType as any,
        referrer: request.headers.get("referer") || null,
        metadata: metadata || undefined,
      },
    })

    // Update counters on promotion
    if (promotionId) {
      const updateData: any = {}
      if (eventType === "PROMOTION_VIEW") updateData.viewsCount = { increment: 1 }
      else if (eventType === "WHATSAPP_CLICK") updateData.whatsappClicks = { increment: 1 }
      else if (eventType === "PHONE_CLICK") updateData.phoneClicks = { increment: 1 }
      else if (eventType === "MAP_CLICK") updateData.mapClicks = { increment: 1 }
      else if (eventType === "SHARE") updateData.shareCount = { increment: 1 }

      if (Object.keys(updateData).length > 0) {
        await prisma.promotion.update({
          where: { id: promotionId },
          data: updateData,
        })
      }
    }

    // Update campaign counters
    if (campaignId) {
      const updateData: any = {}
      if (eventType === "CAMPAIGN_IMPRESSION") updateData.impressions = { increment: 1 }
      else if (eventType === "CAMPAIGN_CLICK") updateData.clicks = { increment: 1 }

      if (Object.keys(updateData).length > 0) {
        await prisma.sponsoredCampaign.update({
          where: { id: campaignId },
          data: updateData,
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur analytics:", error)
    return NextResponse.json({ error: "Erreur" }, { status: 500 })
  }
}