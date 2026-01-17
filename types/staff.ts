export interface AssignedEvent {
    id: string;
    name: string;
    start_at: string;
    end_at: string;
    venue: string;
    // Add other fields as needed based on API response
    [key: string]: any;
}
