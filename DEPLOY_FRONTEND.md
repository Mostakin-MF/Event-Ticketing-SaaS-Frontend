# Frontend Deployment Guide (Vercel)

This guide covers deploying the **Next.js Frontend** to **Vercel**.

## Prerequisites

- You must have deployed the **Backend** first to get the Live API URL.
- Ensure your code is pushed to GitHub.

## Steps

1.  **Create Account:** Go to [Vercel.com](https://vercel.com) and sign up (login with GitHub is best).
2.  **Import Project:**
    - Click **Add New** -> **Project**.
    - Select your GitHub repository `Event-Ticketing-SaaS-Frontend`.
    - Click **Import**.
3.  **Configure Project:**
    - **Framework Preset:** Vercel should auto-detect "Next.js".
    - **Root Directory:** `./` (default).
    - **Build Settings:** Default (`next build`) is correct.
4.  **Environment Variables:**
    - Click to expand **Environment Variables**.
    - Add the following:
        - **Key:** `NEXT_PUBLIC_API_ENDPOINT`
        - **Value:** Your Render Backend URL (e.g., `https://ticketbd-api.onrender.com`) **WITHOUT** a trailing slash.
    - *Add any other frontend secrets if you have likely Cloudinary keys or similar.*
5.  **Deploy:**
    - Click **Deploy**.
    - Vercel will build your application.

## Verification

- Once deployed, Vercel will give you a domain (e.g., `event-ticketing-frontend.vercel.app`).
- Visit the URL.
- Test a login or data fetch to ensure it is connecting to the Backend correctly.
