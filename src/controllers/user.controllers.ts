import { userSchema } from "../validators/user.validator";
import { Context } from "hono";
import { UserModel } from "../models/user.model";
import { hashPassword } from "../utils/hash.utils";
import logger from "../utils/logger.utilss";

export const UserController = {

   async getAllUser(c: Context) {
      try {
         const users = await UserModel.getAllUsers();
         logger.info(`Fetched ${users.length} users`)
         return c.json({ success: true, data: users }, 200);
      } catch (error) {
         return c.json({ success: false, message: "Internal server error" }, 500);
      }
   },

   async register(c: Context) {
      try {
         const body = await c.req.json();
         logger.info("Received user registration request")

         const parse = userSchema.safeParse(body);
         if (!parse.success) {
            logger.warn(`Validation failed: ${JSON.stringify(parse.error.format())}`)
            return c.json({ error: parse.error.errors }, 400)
         }

         const existingEmail = await UserModel.getUserByIdOrEmail(body.id, body.email)
         if (existingEmail) return c.json({ error: "Email already exist!" }, 400)

         const hashedPassword = await hashPassword(body.password)
         const newUser = await UserModel.registerUser(body.username, hashedPassword, body.email)

         logger.info(`User registration successfully: Id ${newUser.id}, Username: ${newUser.username}, Email: ${newUser.email}`)
         return c.json({ message: "User has been created!" }, 201)

      } catch (error) {
         console.log("Failed to create user:", error)
         return c.json({ success: false, message: "Internal server error!" }, 500)
      }
   },

   async getUserById(c: Context) {
      const id = Number(c.req.param('id'));

      if (!id) return c.json({ message: "Please provide id" }, 400)

      const user = await UserModel.getUserByIdOrEmail(id, "")
      if (!user) return c.json({ message: "User not found!" }, 404)

      return c.json({ data: user }, 200)
   },

   async updateUser(c: Context) {
      try {
         const id = Number(c.req.param("id"))
         const body = await c.req.json();
         const parse = userSchema.partial().safeParse(body)

         if (!parse.success) return c.json({ error: parse.error.errors }, 400)

         const existingUser = await UserModel.getUserByIdOrEmail(id, "",)
         if (!existingUser) return c.json({ message: "User not found!" }, 404)

         const username = body.username ?? existingUser.username;
         let password = existingUser.password;
         const email = body.email ?? existingUser.email;

         if (body.password) {
            password = await hashPassword(body.password)
         }

         const user = await UserModel.updateUser(id, username, password, email)

         return c.json({ message: "User has been updated!", user }, 200)
      } catch (error) {
         console.log("Error updating user:", error)
         return c.json({ success: false, message: "Internal server error!" }, 500)
      }
   },

   async deleteUser(c: Context) {

      const id = Number(c.req.param('id'));
      if (!id) return c.json({ message: "Please provice id" }, 400)

      try {

         const user = await UserModel.deleteUser(id)
         if (!user) return c.json({ message: "User not found!" }, 404)
         return c.json({ success: true })

      } catch (error) {
         console.log("Failed to delete user:", error)
         return c.json({ status: false })
      }

   }
}