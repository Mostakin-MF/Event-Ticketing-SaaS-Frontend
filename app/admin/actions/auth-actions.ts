"use server";

import { cookies } from 'next/headers';
import { z } from 'zod';

const registerSchema = z.object({
    full_name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone_number: z.string().min(11, "Phone number must be at least 11 characters"),
    designation: z.string().min(2, "Designation must be at least 2 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    registration_token: z.string().min(1, "Registration token is required"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});
import fs from 'fs/promises';
import path from 'path';

const ADMINS_FILE = path.join(process.cwd(), 'data', 'admins.json');
const TOKENS_FILE = path.join(process.cwd(), 'data', 'tokens.json');

async function readJson(filePath: string) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function writeJson(filePath: string, data: any) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function registerAdmin(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    
    const validatedFields = registerSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: validatedFields.error.flatten().fieldErrors
        };
    }

    const { full_name, email, phone_number, designation, password, registration_token } = validatedFields.data;

    try {
        const adminDataPath = path.join(process.cwd(), 'data', 'admins.json');
        const tokensDataPath = path.join(process.cwd(), 'data', 'tokens.json');

        const adminsFile = await fs.readFile(adminDataPath, 'utf-8');
        const admins = JSON.parse(adminsFile);

        if (admins.some((a: any) => a.email === email)) {
            return { success: false, message: "Email already registered", errors: { email: ["Email already registered"] } };
        }

        const tokensFile = await fs.readFile(tokensDataPath, 'utf-8');
        const tokens = JSON.parse(tokensFile);

        if (!tokens.includes(registration_token)) {
            return { success: false, message: "Invalid registration token", errors: { registration_token: ["Invalid registration token"] } };
        }

        const newAdmin = {
            id: crypto.randomUUID(),
            fullName: full_name,
            email,
            phone: phone_number,
            designation,
            password, // In a real app, hash this!
            is_platform_admin: true,
            createdAt: new Date().toISOString()
        };

        admins.push(newAdmin);
        await fs.writeFile(adminDataPath, JSON.stringify(admins, null, 2));

        return { success: true, message: "Admin registered successfully" };
    } catch (error) {
        return { success: false, message: "Failed to register admin" };
    }
}
export async function loginAdmin(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    
    const validatedFields = loginSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: validatedFields.error.flatten().fieldErrors
        };
    }

    const { email, password } = validatedFields.data;

    try {
        const adminDataPath = path.join(process.cwd(), 'data', 'admins.json');
        const adminsFile = await fs.readFile(adminDataPath, 'utf-8');
        const admins = JSON.parse(adminsFile);

        const admin = admins.find((a: any) => a.email === email && a.password === password);

        if (admin) {
            const cookieStore = await cookies();
            cookieStore.set('admin_session', 'true', {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 // 24 hours
            });

            return { success: true, message: "Login successful" };
        }

        return { success: false, message: "Invalid email or password" };
    } catch (error) {
        return { success: false, message: "An error occurred during login" };
    }
}

export async function logoutAdmin() {
   
    return { success: true, message: "Logged out successfully." };
}
