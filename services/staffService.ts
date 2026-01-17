import api from '@/lib/axios';

export interface StaffProfile {
    id: string;
    fullName: string;
    position: string;
    phoneNumber?: string;
    gender?: string;
    user: {
        email: string;
    };
}

export interface UpdateStaffProfile {
    fullName?: string;
    phoneNumber?: string;
    gender?: string;
}

export const staffService = {
    // GET /staff/events
    getAssignedEvents: async (page = 1, limit = 20) => {
        const response = await api.get('/staff/events', { params: { page, limit } });
        return response.data;
    },

    // POST /staff/checkin
    checkInTicket: async (ticketCode: string) => {
        const response = await api.post('/staff/checkin', { ticketCode });
        return response.data;
    },

    // GET /staff/search/tickets?q=...
    searchTickets: async (query: string) => {
        const response = await api.get('/staff/search/tickets', { params: { q: query } });
        return response.data;
    },

    // GET /staff/orders/search?email=...&code=...
    searchOrders: async (email?: string, code?: string) => {
        const response = await api.get('/staff/orders/search', { params: { email, code } });
        return response.data;
    },

    // GET /staff/attendance-records
    getAttendanceRecords: async (eventId?: string) => {
        const response = await api.get('/staff/attendance-records', { params: { eventId } });
        return response.data;
    },

    // GET /staff/events/:id
    getEventDetails: async (eventId: string) => {
        const response = await api.get(`/staff/events/${eventId}`);
        return response.data;
    },

    // GET /staff/events/:id/capacity
    getEventCapacity: async (eventId: string) => {
        const response = await api.get(`/staff/events/${eventId}/capacity`);
        return response.data;
    },

    // GET /staff/me
    getProfile: async () => {
        const response = await api.get('/staff/me');
        return response.data;
    },

    // PUT /staff/me
    updateProfile: async (data: UpdateStaffProfile) => {
        const response = await api.put('/staff/me', data);
        return response.data;
    },

    // GET /staff/incidents (Only current user's incidents)
    getIncidents: async (page = 1, limit = 20) => {
        try {
            const response = await api.get('/staff/incidents', { params: { page, limit, onlyMe: 'true' } });
            return response.data;
        } catch (err: any) {
            console.error('getIncidents error:', err.response?.data || err.message);
            throw err;
        }
    },

    // POST /staff/incidents
    reportIncident: async (data: { type: string, description: string }) => {
        try {
            const response = await api.post('/staff/incidents', data);
            return response.data;
        } catch (err: any) {
            console.error('reportIncident error:', err.response?.data || err.message);
            throw err;
        }
    }
};

export default staffService;
