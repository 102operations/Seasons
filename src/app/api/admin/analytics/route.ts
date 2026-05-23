import { prisma } from '@/lib/prisma';
import { apiSuccess, apiServerError } from '@/lib/api-response';

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      totalProducts,
      lowStockProducts,
      monthRevenue,
      lastMonthRevenue,
      recentOrders,
      topProducts,
      dailyOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'CONFIRMED' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { stock: { lte: 5 }, isActive: true } }),
      prisma.order.aggregate({
        where: { status: { not: 'CANCELLED' }, createdAt: { gte: startOfMonth } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          status: { not: 'CANCELLED' },
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: { items: true },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: { soldCount: 'desc' },
        take: 5,
        select: { id: true, name: true, thumbnail: true, price: true, soldCount: true },
      }),
      prisma.$queryRaw<Array<{ day: string; count: bigint; revenue: number }>>`
        SELECT
          TO_CHAR("createdAt", 'YYYY-MM-DD') as day,
          COUNT(*)::bigint as count,
          COALESCE(SUM(total), 0)::float as revenue
        FROM orders
        WHERE "createdAt" >= ${last7Days} AND status != 'CANCELLED'
        GROUP BY day
        ORDER BY day ASC
      `,
    ]);

    const currentRev = monthRevenue._sum.total || 0;
    const prevRev = lastMonthRevenue._sum.total || 0;
    const revenueGrowth = prevRev === 0 ? 100 : ((currentRev - prevRev) / prevRev) * 100;

    return apiSuccess({
      stats: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        totalProducts,
        lowStockProducts,
        monthRevenue: currentRev,
        lastMonthRevenue: prevRev,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      },
      recentOrders,
      topProducts,
      dailyOrders: dailyOrders.map((d) => ({
        day: d.day,
        count: Number(d.count),
        revenue: d.revenue,
      })),
    });
  } catch (err) {
    return apiServerError(err);
  }
}
