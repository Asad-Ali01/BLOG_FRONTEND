import {z} from "zod";


export const blogStatusEnum = z.enum(["draft","published"])

export const editBlogSchema = z.object({
    title:z.string().min(1,"Title should not be empty").optional(),
    content:z.string().min(1,"Content should not be empty").optional(),
    status:blogStatusEnum
})

export type editBlogSchemaType = z.infer<typeof editBlogSchema>