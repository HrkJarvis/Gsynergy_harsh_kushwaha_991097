import { NextApiRequest, NextApiResponse } from "next";

// Logout API - Clears the JWT cookie
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    res.setHeader("Set-Cookie", "token=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT;");
    return res.status(200).json({ message: "Logged out successfully" });
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
