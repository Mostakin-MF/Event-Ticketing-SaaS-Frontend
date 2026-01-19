import { z } from 'zod';

/**
 * Attendee Registration Validation Schema
 */
export const attendeeRegistrationSchema = z.object({
    fullName: z.string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must be less than 100 characters'),

    email: z.string()
        .email('Please enter a valid email address')
        .toLowerCase(),

    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),

    phoneNumber: z.string()
        .regex(/^(\+?880|0)?1[3-9]\d{8}$/, 'Please enter a valid Bangladeshi phone number')
        .optional()
        .or(z.literal('')),

    dateOfBirth: z.string()
        .refine((val) => {
            if (!val) return true; // Optional
            const date = new Date(val);
            const age = (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365);
            return age >= 13;
        }, 'You must be at least 13 years old')
        .optional()
        .or(z.literal('')),

    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional()
        .or(z.literal('')),

    country: z.string()
        .max(100, 'Country name must be less than 100 characters')
        .optional()
        .or(z.literal('')),

    city: z.string()
        .max(100, 'City name must be less than 100 characters')
        .optional()
        .or(z.literal(''))
});

export type AttendeeRegistrationInput = z.infer<typeof attendeeRegistrationSchema>;

/**
 * Attendee Login Validation Schema
 */
export const attendeeLoginSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address')
        .toLowerCase(),

    password: z.string()
        .min(1, 'Password is required')
});

export type AttendeeLoginInput = z.infer<typeof attendeeLoginSchema>;

/**
 * Attendee Profile Update Validation Schema
 */
export const attendeeProfileUpdateSchema = z.object({
    fullName: z.string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must be less than 100 characters')
        .optional(),

    phoneNumber: z.string()
        .regex(/^(\+?880|0)?1[3-9]\d{8}$/, 'Please enter a valid Bangladeshi phone number')
        .optional()
        .or(z.literal('')),

    dateOfBirth: z.string()
        .refine((val) => {
            if (!val) return true;
            const date = new Date(val);
            const age = (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365);
            return age >= 13;
        }, 'You must be at least 13 years old')
        .optional()
        .or(z.literal('')),

    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional()
        .or(z.literal('')),

    country: z.string()
        .max(100, 'Country name must be less than 100 characters')
        .optional()
        .or(z.literal('')),

    city: z.string()
        .max(100, 'City name must be less than 100 characters')
        .optional()
        .or(z.literal(''))
});

export type AttendeeProfileUpdateInput = z.infer<typeof attendeeProfileUpdateSchema>;

/**
 * Checkout Validation Schema
 */
export const checkoutSchema = z.object({
    buyer_name: z.string()
        .min(2, 'Buyer name must be at least 2 characters')
        .max(100, 'Buyer name must be less than 100 characters'),

    buyer_email: z.string()
        .email('Please enter a valid email address')
        .toLowerCase(),

    items: z.array(
        z.object({
            ticket_type_id: z.string().min(1, 'Ticket type is required'),
            quantity: z.number()
                .int('Quantity must be a whole number')
                .min(1, 'Quantity must be at least 1')
                .max(10, 'Maximum 10 tickets per type allowed')
        })
    ).min(1, 'At least one ticket must be selected'),

    discount_code: z.string()
        .max(50, 'Discount code must be less than 50 characters')
        .optional()
        .or(z.literal('')),

    payment_provider: z.enum(['bkash', 'nagad', 'card', 'cash'])
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
