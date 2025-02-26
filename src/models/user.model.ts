import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const UserModel = {

   async getAllUsers() {
      return await prisma.user.findMany({
         select: {
            id: true,
            username: true,
            email: true
         }
      });
   },

   async registerUser(username: string, password: string, email: string) {
      return await prisma.user.create({
         data: {
            username,
            password,
            email
         }
      })
   },

   async getUserByIdOrEmail(id: number, email?: string, includePassword: boolean = false) {
      return await prisma.user.findFirst({
         where: {
            OR: [
               { id: Number(id) || undefined },
               email ? { email } : {}
            ]
         },
         select: {
            id: true,
            username: true,
            email: true,
            ...(includePassword && { password: true })
         }
      })
   },

   async updateUser(id: number, username?: string, password?: string, email?: string) {
      const user = await prisma.user.findUnique({
         where: {
            id: Number(id)
         }
      })

      if (!user) return "User not found!"

      return await prisma.user.update({
         where: {
            id: Number(id)
         }, data: {
            username: username,
            email: email,
            password: password
         }
      })
   },

   async deleteUser(id: number) {
      return await prisma.user.delete({
         where: {
            id: id
         }
      })
   }

}