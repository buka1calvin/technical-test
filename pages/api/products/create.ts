import { connectDB } from "@/src/config/database.config";
import { Product } from "@/src/models/product.model";
import { verifyToken } from "@/src/utils/auth.utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
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
    const { name, amount, comment = "" } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Product name is required" });
    }

    if (!amount || isNaN(Number(amount))) {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    if (Number(amount) < 0) {
      return res.status(400).json({ error: "Amount cannot be negative" });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({ error: "Product name too long!!" });
    }

    if (comment && comment.length > 500) {
      return res.status(400).json({ error: "Comment too long!!" });
    }

    const lastProduct:any = await Product.findOne({ userId })
      .sort({ position: -1 })
      .lean();

    const nextPosition = lastProduct ? lastProduct.position + 1 : 0;

    const product = await Product.create({
      name: name.trim(),
      amount: Number(amount),
      comment: comment.trim(),
      userId,
      position: nextPosition,
    });

    const createdProduct = await Product.findById(product._id).lean();

    return res.status(201).json({
      success: true,
      product: createdProduct,
      message: "Product created successfully"
    });

  } catch (error:any) {
    console.error("Create product error:", error);


    return res.status(500).json({ 
      message: "Internal server error",
      error
    });
  }
}