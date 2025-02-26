import { isValid, z } from "zod";

export const userSchema = z.object({
   username: z.string().min(3, "Name must be at least 3 characters long"),
   email: z.string().email("Invalid email format"),
   password: z.string().min(6, "Password must be at least 6 characters")
})

export const validateUser = (data: any) => {
   const result = userSchema.safeParse(data);

   if (!result.success) {
      return {
         isValid: false,
         errors: result.error.format()
      }
   }

   return {
      isValid: true,
      data: result.data
   }
}