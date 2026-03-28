import {z} from "zod";

const editUserRole = z.enum(["admin","user"]);
export const editUserSchema = z.object({
    avatar: z.object({
        url:z.string(),
        public_id:z.string()
    }).optional(),
    username:z.string().min(6,"Username must be at least 6 digits"),
    role:editUserRole
})

export type editUserSchemaType = z.infer<typeof editUserSchema>