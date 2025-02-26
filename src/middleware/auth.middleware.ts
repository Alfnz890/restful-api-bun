import { Context } from "hono";
import { verifyToken } from "../utils/jwt.utils";

export const authMiddleware = async (c: Context, next: Function) => {
   const authHeader = c.req.header("Authorization")
   if (!authHeader) return c.json({ error: "Unauthorization" }, 401);

   const token = authHeader.split(" ")[1];
   const user = await verifyToken(token);
   if (!user) return c.json({ error: "Invalid token" }, 403);

   c.set("user", user);
   return await next();
}