import { connectDB } from "@/src/config/database.config";
import { Product } from "@/src/models/product.model";
import { verifyToken } from "@/src/utils/auth.utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
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
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ error: "Product IDs array is required" });
    }

    const updatePromises = productIds.map((productId: string, index: number) =>
      Product.findOneAndUpdate(
        { _id: productId, userId },
        { position: index },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    const updatedProducts = await Product.find({ userId }).sort({ position: 1 });

    return res.status(200).json({
      success: true,
      products: updatedProducts,
      message: "Products reordered successfully"
    });

  } catch (error: any) {
    console.error("Reorder products error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error
    });
  }
}