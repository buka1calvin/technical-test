import { connectDB } from "@/src/config/database.config";
import { Product } from "@/src/models/product.model";
import { verifyToken } from "@/src/utils/auth.utils";
import { NextApiRequest, NextApiResponse } from "next";
import { createProductQuery } from "@/src/utils/product-query-builder.utils";

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
      minAmount,
      maxAmount,
      sortBy = 'position',
      sortOrder = 'asc',
      page = '1',
      limit = '50'
    } = req.query;

    let queryBuilder = createProductQuery(userId);

    if (search && typeof search === 'string') {
      queryBuilder = queryBuilder.search(search);
    }

    if (minAmount || maxAmount) {
      queryBuilder = queryBuilder.amountRange(
        minAmount ? Number(minAmount) : undefined,
        maxAmount ? Number(maxAmount) : undefined
      );
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