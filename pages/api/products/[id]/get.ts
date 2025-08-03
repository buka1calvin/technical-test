import { connectDB } from "@/src/config/database.config";
import { Product } from "@/src/models/product.model";
import { verifyToken } from "@/src/utils/auth.utils";
import { NextApiRequest, NextApiResponse } from "next";

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

    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const product = await Product.findOne({ 
      _id: id, 
      userId 
    }).lean();

    if (!product) {
      return res.status(404).json({ 
        error: "Product not found or you don't have permission to access it" 
      });
    }

    return res.status(200).json({
      success: true,
      product,
      message: "Product retrieved successfully"
    });

  } catch (error: any) {
    console.error("Get single product error:", error);


    return res.status(500).json({
      message: "Internal server error",
      error
    });
  }
}