import { clerkClient, getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

export const protectAdminRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    console.log("🚀 ~ protectAdminRoute ~ userId:", userId)

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await clerkClient.users.getUser(userId);
  console.log("🚀 ~ protectAdminRoute ~ user:", user)
  const role = user?.publicMetadata?.role;
  if (role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
  } catch (error) {
    console.error("Error protecting admin route:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
