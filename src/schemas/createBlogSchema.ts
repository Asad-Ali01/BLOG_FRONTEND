import {z} from "zod";


export const blogStatusEnum = z.enum(["draft","published"])

export const createBlogSchema = z.object({
    title:z.string().min(1,"Title should not be empty"),
    content:z.string().min(1,"Content should not be empty"),
    status:blogStatusEnum
})

export type createBlogSchemaType = z.infer<typeof createBlogSchema>