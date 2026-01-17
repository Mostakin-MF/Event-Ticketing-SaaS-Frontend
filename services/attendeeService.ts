import api from '@/lib/axios';

export const attendeeService = {
    // GET /attendee/events
    getEvents: async (params?: { limit?: number; page?: number }) => {
        const response = await api.get('/attendee/events', { params });
        return response.data;
    },

    // GET /attendee/events/:id or /attendee/events/slug/:slug
    getEventDetails: async (idOrSlug: string, isSlug = false) => {
        const url = isSlug ? `/attendee/events/slug/${idOrSlug}` : `/attendee/events/${idOrSlug}`;
        const response = await api.get(url);
        return response.data;
    },

    // GET /attendee/orders?email=...
    getMyTickets: async (email?: string) => {
        // If email is not provided, backend should ideally extract from JWT or session
        const response = await api.get('/attendee/orders', { params: { email } });
        return response.data;
    },

    // POST /attendee/checkout
    createOrder: async (
        eventId: string,
        items: Array<{ ticket_type_id: string; quantity: number }>,
        customer: { name: string; email: string },
        paymentMethod: string,
        discountCode?: string
    ) => {
        const response = await api.post('/attendee/checkout', {
            event_id: eventId,
            buyer_email: customer.email,
            buyer_name: customer.name,
            items: items,
            discount_code: discountCode,
            payment_provider: paymentMethod
        });
        return response.data;
    },

    // GET /auth/me (reusing logic or specific attendee profile)
    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // POST /attendee/discount-codes/validate
    validateDiscountCode: async (eventId: string, code: string) => {
        const response = await api.post('/attendee/discount-codes/validate', { event_id: eventId, code });
        return response.data;
    },

    // DELETE /attendee/tickets/:id
    cancelTicket: async (ticketId: string) => {
        const response = await api.delete(`/attendee/tickets/${ticketId}`);
        return response.data;
    },

    // GET /attendee/profile (Full profile with user + attendee details)
    getFullProfile: async () => {
        const response = await api.get('/attendee/profile');
        return response; // NOTE: The backend returns the object directly, but Axios wraps it in data. The caller page expects { data: ... } structure or just data? 
        // Page says: const profileData = await attendeeService.getFullProfile(); 
        // Then: const userData = { name: profileData.data.fullName ... }
        // So it expects the Axios response structure OR an object with a data property.
        // My backend returns the object directly. Axios returns { data: object, status: ... }
        // If I return response, then profileData.data will be the object.
        // Let's verify page usage: profileData.data.fullName
        // Yes, returning 'response' (the axios response object) matches the expectation of accessing .data property.
    },

    // PUT /attendee/profile
    updateFullProfile: async (data: any) => {
        const response = await api.put('/attendee/profile', data);
        return response.data;
    },

    updateProfile: async (data: any) => {
        // Legacy wrapper or allow just updating specific fields via the same endpoint
        const response = await api.put('/attendee/profile', data);
        return response.data;
    }
};

export default attendeeService;
