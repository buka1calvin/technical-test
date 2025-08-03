import { connectDB } from "@/src/config/database.config";
import { User } from "@/src/models/user.model";
import { generateToken } from "@/src/utils/auth.utils";
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
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address" });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        email: email,
      });
    }
    const token = generateToken({ id: user?._id }, { expiresIn: "7d" });
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = [
      `token=${token}`,
      "HttpOnly",
      "Path=/",
      "Max-Age=604800",
      "SameSite=Strict",
      ...(isProduction ? ["Secure"] : []),
    ].join("; ");

    res.setHeader("Set-Cookie", cookieOptions);

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server Error!", error });
  }
}
