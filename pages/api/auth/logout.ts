import { connectDB } from "@/src/config/database.config";
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
    res.setHeader("Set-Cookie", [
      "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict",
    ]);
    return res.status(200).json({ message: "User logged Out successFully!!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server Error!", error });
  }
}
