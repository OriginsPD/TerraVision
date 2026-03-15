import { NextRequest } from "next/server"
import { db } from "@/lib/server/db"
import { requireAuth } from "@/lib/server/auth"
import { baseResponse, errorResponse } from "@/lib/server/response"

export async function GET(req: NextRequest) {
  try {
    const { userId, role } = await requireAuth(req)
    
    // Overview statistics
    const totalProperties = await db.property.count()
    const totalUsers = await db.user.count()
    const totalConversations = await db.conversation.count()
    
    // Valuation aggregation
    const valuationResult = await db.property.aggregate({
      _sum: { price: true },
      _avg: { price: true }
    })
    
    // Property type distribution
    const typeDistribution = await db.property.groupBy({
      by: ['type'],
      _count: { id: true }
    })
    
    // Top properties by views
    const topProperties = await db.property.findMany({
      take: 5,
      orderBy: { views: 'desc' },
      select: {
        id: true,
        title: true,
        views: true,
        price: true,
        location: true
      }
    })

    // User-specific stats (if they are an owner)
    let ownerStats = null
    if (role === 'OWNER') {
      const myProperties = await db.property.count({ where: { ownerId: userId } })
      const myMessages = await db.message.count({ 
        where: { conversation: { OR: [{ user1Id: userId }, { user2Id: userId }] } } 
      })
      ownerStats = {
        myProperties,
        myMessages
      }
    }

    return baseResponse({
      overview: {
        totalProperties,
        totalUsers,
        totalConversations,
        totalValuation: valuationResult._sum.price || 0,
        averagePrice: valuationResult._avg.price || 0
      },
      typeDistribution: typeDistribution.map(t => ({
        type: t.type,
        count: t._count.id
      })),
      topProperties,
      ownerStats
    })
  } catch (e) {
    if (e instanceof Response) return e
    console.error("[analytics GET]", e)
    return errorResponse("Internal server error", 500)
  }
}
