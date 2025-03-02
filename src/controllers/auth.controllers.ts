import { Context } from "hono"
import { loginSchema } from "../validators/login.validator";
import { UserModel } from "../models/user.model";
import { comparePassword } from "../utils/hash.utils";
import { generateToken } from "../utils/jwt.utils";

export const AuthController = {

   async login(c: Context) {
      const body = await c.req.json();
      const parse = loginSchema.safeParse(body);

      if (!parse.success) return c.json({ error: parse.error.errors }, 400);
      const user = await UserModel.getUserByIdOrEmail(body.id, body.email, true);

      if (!user || !await comparePassword(body.password, user.password)) {
         return c.json({ error: "Invalid email or password!" }, 401)
      }

      const token = await generateToken({ id: user.id, username: user.username })
      if (!token) return c.json({ message: "error" })

      return c.json({ message: "Login success", token }, 200)
   },

   async logout(c: Context) {
      return c.json({ message: "Logout success" })
   }

}