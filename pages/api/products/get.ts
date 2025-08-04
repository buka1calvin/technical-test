import { connectDB } from "@/src/config/database.config";
import { Product } from "@/src/models/product.model";
import { verifyToken } from "@/src/utils/auth.utils";
import { NextApiRequest, NextApiResponse } from "next";
import { createProductQuery } from "@/src/utils/product-query-builder.utils";

function parseAmountFilters(amountFilter: string) {
  const ranges = amountFilter.split(',');
  let minAmount: number | undefined;
  let maxAmount: number | undefined;
  
  for (const range of ranges) {
    if (range === '1000+') {
      minAmount = minAmount ? Math.min(minAmount, 1000) : 1000;
    } else {
      const [min, max] = range.split('-').map(Number);
      if (!isNaN(min)) {
        minAmount = minAmount ? Math.min(minAmount, min) : min;
      }
      if (!isNaN(max)) {
        maxAmount = maxAmount ? Math.max(maxAmount, max) : max;
      }
    }
  }
  
  return { minAmount, maxAmount };
}

function parseDateFilters(dateFilter: string) {
  const filters = dateFilter.split(',');
  let startDate: Date | undefined;
  let endDate: Date | undefined;
  
  const now = new Date();
  
  for (const filter of filters) {
    let filterStart: Date;
    let filterEnd: Date;
    
    switch (filter) {
      case 'today':
        filterStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        filterEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case 'week':
        const dayOfWeek = now.getDay();
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        filterStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
        filterEnd = new Date(filterStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        filterStart = new Date(now.getFullYear(), now.getMonth(), 1);
        filterEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case 'year':
        filterStart = new Date(now.getFullYear(), 0, 1);
        filterEnd = new Date(now.getFullYear() + 1, 0, 1);
        break;
      default:
        continue;
    }
    
    if (!startDate || filterStart < startDate) {
      startDate = filterStart;
    }
    if (!endDate || filterEnd > endDate) {
      endDate = filterEnd;
    }
  }
  
  return { startDate, endDate };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = verifyToken(token) as any;
    if (!decoded || !decoded.data?.id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = decoded.data.id;
    const {
      search,
      amountFilter,
      dateFilter,
      sortBy = 'position',
      sortOrder = 'asc',
      page = '1',
      limit = '50'
    } = req.query;

    let queryBuilder = createProductQuery(userId);

    if (search && typeof search === 'string') {
      queryBuilder = queryBuilder.search(search);
    }

    if (amountFilter && typeof amountFilter === 'string') {
      const { minAmount, maxAmount } = parseAmountFilters(amountFilter);
      if (minAmount !== undefined || maxAmount !== undefined) {
        queryBuilder = queryBuilder.amountRange(minAmount, maxAmount);
      }
    }

    if (dateFilter && typeof dateFilter === 'string') {
      const { startDate, endDate } = parseDateFilters(dateFilter);
      if (startDate || endDate) {
        queryBuilder = queryBuilder.dateRange(startDate, endDate);
      }
    }

    if (sortBy === 'position') {
      queryBuilder = queryBuilder.defaultSort();
    } else if (['name', 'amount', 'createdAt'].includes(sortBy as string)) {
      queryBuilder = queryBuilder.sort(
        sortBy as 'name' | 'amount' | 'createdAt',
        sortOrder as 'asc' | 'desc'
      );
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    queryBuilder = queryBuilder.paginate(pageNum, limitNum);

    const [products, totalCount] = await Promise.all([
      queryBuilder.execute(),
      queryBuilder.count()
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    return res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit: limitNum
      }
    });

  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({
       message: "Internal server error",
      error
    });
  }
}