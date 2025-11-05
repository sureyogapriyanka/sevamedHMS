// API service for connecting to the backend

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, config);

        // Handle successful responses
        if (response.ok) {
            const data = await response.json();
            return { data, error: null };
        }

        // Handle error responses
        let errorData;
        try {
            errorData = await response.json();
        } catch (parseError) {
            // If JSON parsing fails, use status text
            errorData = { message: response.statusText || 'An error occurred' };
        }

        console.error(`API Error ${response.status}:`, errorData);
        return { data: null, error: errorData.message || 'An error occurred' };
    } catch (error) {
        console.error('Network error:', error);
        return { data: null, error: 'Network error - please try again' };
    }
};

// User authentication APIs
export const authService = {
    // Register a new user
    register: async (userData) => {
        return apiRequest('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    // Login user
    login: async (credentials) => {
        return apiRequest('/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    // Get user profile
    getProfile: async () => {
        return apiRequest('/users/profile', {
            method: 'GET',
        });
    },

    // Get user by username (for profile preview before login)
    getUserByUsername: async (username) => {
        return apiRequest(`/users/username/${username}`, {
            method: 'GET',
        });
    },

    // Update user profile
    updateProfile: async (profileData) => {
        return apiRequest('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    },

    // Update user by ID (admin only)
    updateUserById: async (id, userData) => {
        return apiRequest(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    },
};

// Appointment APIs
export const appointmentService = {
    // Create a new appointment
    create: async (appointmentData) => {
        return apiRequest('/appointments', {
            method: 'POST',
            body: JSON.stringify(appointmentData),
        });
    },

    // Get all appointments
    getAll: async () => {
        return apiRequest('/appointments', {
            method: 'GET',
        });
    },

    // Get appointment by ID
    getById: async (id) => {
        return apiRequest(`/appointments/${id}`, {
            method: 'GET',
        });
    },

    // Get appointments by user ID
    getByUserId: async (userId) => {
        return apiRequest(`/appointments/user/${userId}`, {
            method: 'GET',
        });
    },

    // Update appointment
    update: async (id, appointmentData) => {
        return apiRequest(`/appointments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(appointmentData),
        });
    },

    // Delete appointment
    delete: async (id) => {
        return apiRequest(`/appointments/${id}`, {
            method: 'DELETE',
        });
    },
};

// Patient APIs
export const patientService = {
    // Create a new patient
    create: async (patientData) => {
        return apiRequest('/patients', {
            method: 'POST',
            body: JSON.stringify(patientData),
        });
    },

    // Get all patients
    getAll: async () => {
        return apiRequest('/patients', {
            method: 'GET',
        });
    },

    // Get patient by ID
    getById: async (id) => {
        return apiRequest(`/patients/${id}`, {
            method: 'GET',
        });
    },

    // Get patient by user ID
    getByUserId: async (userId) => {
        return apiRequest(`/patients/user/${userId}`, {
            method: 'GET',
        });
    },

    // Update patient
    update: async (id, patientData) => {
        return apiRequest(`/patients/${id}`, {
            method: 'PUT',
            body: JSON.stringify(patientData),
        });
    },

    // Delete patient
    delete: async (id) => {
        return apiRequest(`/patients/${id}`, {
            method: 'DELETE',
        });
    },
};

// Activity Log APIs
export const activityLogService = {
    // Get activity logs
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        const endpoint = queryParams ? `/activity-logs?${queryParams}` : '/activity-logs';
        return apiRequest(endpoint, {
            method: 'GET',
        });
    },

    // Create a new activity log
    create: async (activityData) => {
        return apiRequest('/activity-logs', {
            method: 'POST',
            body: JSON.stringify(activityData),
        });
    },

    // Delete all activity logs
    clear: async () => {
        return apiRequest('/activity-logs', {
            method: 'DELETE',
        });
    },
};

// AI Insight APIs
export const aiInsightService = {
    // Get AI insights by user ID
    getByUserId: async (userId) => {
        return apiRequest(`/ai-insights/user/${userId}`, {
            method: 'GET',
        });
    },

    // Generate health suggestions
    generateHealthSuggestions: async (data) => {
        return apiRequest('/ai-insights/generate/health', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

// Fitness Data APIs
export const fitnessDataService = {
    // Get fitness data by patient ID
    getByPatientId: async (patientId) => {
        return apiRequest(`/fitness-data/patient/${patientId}`, {
            method: 'GET',
        });
    },

    // Create new fitness data
    create: async (fitnessData) => {
        return apiRequest('/fitness-data', {
            method: 'POST',
            body: JSON.stringify(fitnessData),
        });
    },

    // Update fitness data
    update: async (id, fitnessData) => {
        return apiRequest(`/fitness-data/${id}`, {
            method: 'PUT',
            body: JSON.stringify(fitnessData),
        });
    },
};

// Queue APIs
export const queueService = {
    // Get all queue entries
    getAll: async () => {
        return apiRequest('/queue', {
            method: 'GET',
        });
    },

    // Get queue entry by ID
    getById: async (id) => {
        return apiRequest(`/queue/${id}`, {
            method: 'GET',
        });
    },

    // Update queue entry
    update: async (id, queueData) => {
        return apiRequest(`/queue/${id}`, {
            method: 'PUT',
            body: JSON.stringify(queueData),
        });
    },

    // Create new queue entry
    create: async (queueData) => {
        return apiRequest('/queue', {
            method: 'POST',
            body: JSON.stringify(queueData),
        });
    },

    // Delete queue entry
    delete: async (id) => {
        return apiRequest(`/queue/${id}`, {
            method: 'DELETE',
        });
    },
};

// Message APIs
export const messageService = {
    // Get messages between current user and another user
    getByUserId: async (userId) => {
        return apiRequest(`/messages/user/${userId}`, {
            method: 'GET',
        });
    },

    // Get all messages for current user
    getAll: async () => {
        return apiRequest('/messages/user', {
            method: 'GET',
        });
    },

    // Send a new message
    send: async (messageData) => {
        return apiRequest('/messages', {
            method: 'POST',
            body: JSON.stringify(messageData),
        });
    },

    // Mark message as read
    markAsRead: async (messageId) => {
        return apiRequest(`/messages/${messageId}/read`, {
            method: 'PUT',
        });
    },

    // Get unread message count
    getUnreadCount: async () => {
        return apiRequest('/messages/unread-count', {
            method: 'GET',
        });
    },
};

export default {
    authService,
    appointmentService,
    patientService,
    activityLogService,
    aiInsightService,
    fitnessDataService,
    queueService,
    messageService,
};