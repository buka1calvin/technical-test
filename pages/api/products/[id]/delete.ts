import { connectDB } from "@/src/config/database.config";
import { Product } from "@/src/models/product.model";
import { verifyToken } from "@/src/utils/auth.utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
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

    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const productToDelete = await Product.findOne({
      _id: id,
      userId,
    });

    if (!productToDelete) {
      return res.status(404).json({
        error: "Product not found or you don't have permission to delete it",
      });
    }

    const deletedPosition = productToDelete.position;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ error: "Product not found during deletion" });
    }

    await Product.updateMany(
      {
        userId,
        position: { $gt: deletedPosition },
      },
      {
        $inc: { position: -1 },
      }
    );

    const [remainingCount, totalAmount] = await Promise.all([
      Product.countDocuments({ userId }),
      Product.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const totalValue = totalAmount.length > 0 ? totalAmount[0].total : 0;

    return res.status(200).json({
      success: true,
      deletedProduct: {
        id: deletedProduct._id,
        name: deletedProduct.name,
        amount: deletedProduct.amount,
        position: deletedProduct.position,
      },
      stats: {
        remainingProducts: remainingCount,
        totalValue: totalValue,
      },
      message: "Product deleted successfully and positions reordered",
    });
  } catch (error: any) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
}
