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

    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const { name, amount, comment, position } = req.body;

    if (name === undefined && amount === undefined && comment === undefined && position === undefined) {
      return res.status(400).json({ 
        error: "At least one field (name, amount, comment, or position) must be provided" 
      });
    }

    const existingProduct = await Product.findOne({ 
      _id: id, 
      userId 
    });

    if (!existingProduct) {
      return res.status(404).json({ 
        error: "Product not found or you don't have permission to update it" 
      });
    }

    if (name !== undefined) {
      if (!name || !name.trim()) {
        return res.status(400).json({ error: "Product name cannot be empty" });
      }
      if (name.trim().length > 100) {
        return res.status(400).json({ error: "Product name too long!" });
      }
    }

    if (amount !== undefined) {
      if (isNaN(Number(amount))) {
        return res.status(400).json({ error: "Valid amount is required" });
      }
      if (Number(amount) < 0) {
        return res.status(400).json({ error: "Amount cannot be negative" });
      }
    }

    if (comment !== undefined && comment.length > 500) {
      return res.status(400).json({ error: "Comment too long!" });
    }

    if (position !== undefined) {
      if (isNaN(Number(position)) || Number(position) < 0) {
        return res.status(400).json({ error: "Position must be a non-negative number" });
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (amount !== undefined) updateData.amount = Number(amount);
    if (comment !== undefined) updateData.comment = comment.trim();
    if (position !== undefined) updateData.position = Number(position);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,
        lean: true,
        runValidators: true
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found after update" });
    }

    return res.status(200).json({
      success: true,
      product: updatedProduct,
      message: "Product updated successfully"
    });

  } catch (error: any) {
    console.error("Update product error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error
    });
  }
}