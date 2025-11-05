// Simple test to verify frontend can connect to backend API
const testApiConnection = async () => {
    const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

    try {
        console.log(`Testing connection to: ${apiUrl}`);

        // Test the health endpoint
        const response = await fetch(`${apiUrl}/../health`);
        const data = await response.json();

        console.log('API Connection Test Results:');
        console.log('- Status:', response.ok ? 'SUCCESS' : 'FAILED');
        console.log('- Response:', data);

        if (data.databaseConnected) {
            console.log('- Database: CONNECTED');
        } else {
            console.log('- Database: DISCONNECTED');
        }

        return data;
    } catch (error) {
        console.error('API Connection Test FAILED:');
        console.error('- Error:', error.message);
        return { error: error.message };
    }
};

// Run the test
testApiConnection();