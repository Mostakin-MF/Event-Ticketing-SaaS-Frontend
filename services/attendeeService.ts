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
        items: Array<{ typeId: string; quantity: number }>,
        customer: { name: string; email: string },
        paymentMethod: string,
        discountCode?: string
    ) => {
        const response = await api.post('/attendee/checkout', {
            eventId,
            items,
            customer,
            paymentMethod,
            discountCode
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
        const response = await api.post('/attendee/discount-codes/validate', { eventId, code });
        return response.data;
    },

    // DELETE /attendee/tickets/:id
    cancelTicket: async (ticketId: string) => {
        const response = await api.delete(`/attendee/tickets/${ticketId}`);
        return response.data;
    }
};

export default attendeeService;
