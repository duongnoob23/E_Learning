import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import EditProfile from './EditProfile';
import 'react-toastify/dist/ReactToastify.css';

// Mock user data for demo
const mockUser = {
  user_id: 1,
  username: 'johndoe',
  full_name: 'John Doe',
  phone_number: '0123456789',
  avatar_url: '/uploads/avatar.jpg',
  email: 'john@example.com',
  status: 'active',
  email_verified: true,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z'
};

// Create a query client for demo
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

const EditProfileDemo = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ 
        padding: '20px', 
        maxWidth: '800px', 
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1>EditProfile Component Demo</h1>
        <p>This is a demo of the EditProfile component with mock data.</p>
        
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#f9f9f9'
        }}>
          <EditProfile user={mockUser} />
        </div>
        
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <h3>Mock User Data:</h3>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(mockUser, null, 2)}
          </pre>
        </div>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </QueryClientProvider>
  );
};

export default EditProfileDemo;
