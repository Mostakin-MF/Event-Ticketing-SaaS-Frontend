import { z } from "zod";

export const themeFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    category: z.enum(['music', 'jobfair', 'expo', 'conference', 'sports', 'festival', 'general']),
    price: z.coerce.number().min(0, "Price must be a positive number"),
    thumbnailUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Invalid hex color"),
    secondaryColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Invalid hex color"),
    backgroundColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Invalid hex color"),
    textColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Invalid hex color"),
    headingFont: z.string().min(1, "Heading font is required"),
    bodyFont: z.string().min(1, "Body font is required"),
    isPremium: z.boolean(),
});

export const jsonValidator = z.string().refine((val) => {
    try {
        JSON.parse(val);
        return true;
    } catch {
        return false;
    }
}, "Invalid JSON format");

export type ThemeFormData = z.infer<typeof themeFormSchema>;
