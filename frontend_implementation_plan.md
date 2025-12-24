# TicketBD: Frontend Implementation Plan

This document outlines the frontend architecture, user flows, and component structure for the TicketBD SaaS platform. It is designed to work seamlessly with the existing NestJS backend.

## Design System (Nishorgo Theme)
### Colors
- **Primary:** `#059669` (Emerald 600) - Main brand color, used for buttons and primary accents.
- **Secondary:** `#D97706` (Amber 600) - Highlights, gold accents, and CTA variations.
- **Accent:** `#064E3B` (Emerald 900) - Deep context, sidebars, and dark-mode elements.
- **Base:** `#F8FAFC` (Slate 50) - Clean backgrounds for readability.

### Aesthetic Principles
- **Modern Glassmorphism:** Subtle blur and transparency for cards and navbars (`backdrop-blur-md`).
- **Soft Shadows:** Elevation using `shadow-xl shadow-primary/10` to create depth.
- **Micro-interactions:** Hover effects on all buttons and cards (`hover:scale-[1.02]`, `transition-all`).
- **Typography:** Using **Outfit** or **Inter** for a premium, tech-focused readability.

### UI Components (DaisyUI + Custom)
- **Cards:** White or slate-50 base with thin borders (`border-slate-100`).
- **Buttons:** Rounded-full for a modern, friendly feel.
- **Inputs:** Focused state using the primary emerald color.

---

## 1. Domain & Routing Strategy (Multi-Subdomain SaaS)
To provide a premium white-label experience and clear isolation between marketing and operations, TicketBD will use a subdomain-based routing strategy.

| Domain | Role | Internal View Folder |
| --- | --- | --- |
| `ticketbd.com` | Marketing Landing Page | `app/(marketing)/*` |
| `admin.ticketbd.com`| Platform & Tenant Admin Portal | `app/(admin)/*` |
| `*.ticketbd.com` | Tenant Public Storefronts | `app/(tenant)/*` |

### Implementation with Next.js Middleware
We will use **Next.js Middleware** to intercept requests and rewrite them based on the `host` header.
- `GET admin.ticketbd.com/dashboard` → Rewrite to `/admin/dashboard`
- `GET concert-bd.ticketbd.com/` → Rewrite to `/tenant/concert-bd/`

---

## 2. Shared Infrastructure
### Authentication & Guards
- **Login Page:** Centralized login for all users.
- **JWT Handling:** Store tokens in secure HttpOnly cookies (preferred) or encrypted LocalStorage.
- **Role-Based Layouts:** Interceptors to redirect users to their specific dashboards based on their role (`platform_admin`, `TenantAdmin`, `staff`).

### Common Components
- **Sidebar & Navbar:** Responsive navigation for dashboards.
- **Stat Cards:** Reusable cards for dashboard metrics.
- **DataTable:** Reusable table component with sorting, filtering, and pagination.
- **Modal System:** For CRUD operations (Creating events, etc.).

---

## 2. Platform Admin Module
*Routes: `/admin/*`*

| Route | View | Features |
| --- | --- | --- |
| `/admin` | Dashboard | Global metrics (SaaS health, revenue graph). |
| `/admin/tenants` | Tenant List | CRUD for organizers, status toggles (Active/Suspended). |
| `/admin/users` | User Mgmt | Manage platform-level admin accounts. |
| `/admin/payments` | Payment Audit | Table of all transactions across all tenants. |
| `/admin/webhooks` | Webhook Logs | List of received callbacks for debugging. |
| `/admin/logs` | Activity Logs | System-wide audit trail. |

---

## 3. Tenant Admin Module
*Routes: `/tenant-admin/*`*

| Route | View | Features |
| --- | --- | --- |
| `/tenant-admin` | Dashboard | Sales overview, event list, ticket breakdown. |
| `/tenant-admin/events` | Events List | Manage events, search, and status updates. |
| `/tenant-admin/events/new` | Create Event | Form for event details, location, and dates. |
| `/tenant-admin/tickets` | Ticket Types | Define GA, VIP tiers per event. |
| `/tenant-admin/orders` | Order List | View sales, search by email/ID, refund management. |
| `/tenant-admin/discounts`| Promos | Create and track usage of discount codes. |
| `/tenant-admin/staff` | Staff Mgmt | Invite and assign staff to specific events. |
| `/tenant-admin/settings`| Branding | Profile customization, logo upload. |

---

## 4. Staff Module
*Routes: `/staff/*`*

| Route | View | Features |
| --- | --- | --- |
| `/staff` | Assignment | List of events the staff is currently working on. |
| `/staff/scanner` | QR Scanner | Mobile-optimized camera view for check-ins. |
| `/staff/lookup` | Attendee Search| Search by name/phone if QR fails. |

---

## 5. Attendee Module
*Public Routes*

| Route | View | Features |
| --- | --- | --- |
| `/` | Landing Page | Promotion for organizers (TicketBD marketing). |
| `/explore` | Event Discovery| Search public events across all tenants. |
| `/e/[slug]` | Event Page | Booking interface for a specific event. |
| `/checkout` | Payment | Secure payment flow with BDT integration. |
| `/tickets/[token]`| QR Pass | Digital ticket with QR code for entry. |

---

## 6. Implementation Strategy
1. **Milestone 1:** Auth & Layout System (Shared).
2. **Milestone 2:** Platform Admin (User/Tenant CRUD).
3. **Milestone 3:** Tenant Admin (Event/Ticket Management).
4. **Milestone 4:** Checkout Flow & Local Payment Integration.
5. **Milestone 5:** Staff Check-In Mobile UI.

---

## Technical Considerations for Bangladesh
- **Network Optimization:** Lightweight pages for areas with spotty 3G/4G connectivity.
- **Offline Mode:** Cache event ticket lists for staff check-in in case of venue Wi-Fi failure.
- **Timezones:** Strict enforcement of BST (UTC+6) for all UI displays.
