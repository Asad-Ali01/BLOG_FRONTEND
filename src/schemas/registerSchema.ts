import {z} from 'zod';

export const registerSchema = z
.object({
    username:z.string().min(6,"Username must be at least 6 digits"),
    password:z.string().min(6,"Password must at least 6 digits"),
    confirmPassword:z.string().min(6,"Confirm password must be at least 6 digits"),
    avatar:z.instanceof(File).optional()
})
.refine((data) => data.password === data.confirmPassword,{
    message:"Password do not match",
    path:["confirmPassword"]
})

export type RegisterSchemaType = z.infer<typeof registerSchema>