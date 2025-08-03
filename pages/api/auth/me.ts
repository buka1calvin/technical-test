import { connectDB } from "@/src/config/database.config";
import { User } from "@/src/models/user.model";
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
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = verifyToken(token) as any;

    if (!decoded || !decoded.data?.id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await User.findById(decoded.data.id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Auth verification error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
}
