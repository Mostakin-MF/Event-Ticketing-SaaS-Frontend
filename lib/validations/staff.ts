import { z } from 'zod';

/**
 * Staff Profile Update Validation Schema
 */
export const staffProfileUpdateSchema = z.object({
    fullName: z.string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must be less than 100 characters')
        .optional(),

    phoneNumber: z.string()
        .regex(/^(\+?880|0)?1[3-9]\d{8}$/, 'Please enter a valid Bangladeshi phone number')
        .optional()
        .or(z.literal('')),

    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional()
});

export type StaffProfileUpdateInput = z.infer<typeof staffProfileUpdateSchema>;

/**
 * Incident Report Validation Schema
 */
export const incidentReportSchema = z.object({
    type: z.string()
        .min(1, 'Incident type is required')
        .max(50, 'Incident type must be less than 50 characters'),

    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description must be less than 500 characters')
});

export type IncidentReportInput = z.infer<typeof incidentReportSchema>;

/**
 * Ticket Search Validation Schema
 */
export const ticketSearchSchema = z.object({
    query: z.string()
        .min(3, 'Search query must be at least 3 characters')
        .max(100, 'Search query must be less than 100 characters')
});

export type TicketSearchInput = z.infer<typeof ticketSearchSchema>;
