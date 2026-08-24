import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    // Initialize state directly from localStorage so it persists on page refresh
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,

    // Action to log in and save data to both Zustand and localStorage
    login: (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        set({ token, user: userData });
    },

    // Action to log out and clear storage
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ token: null, user: null });
    },

    // Action to update user details (like username)
    updateUser: (updatedData) => {
        set((state) => {
            const newِUser = { ...state.user, ...updatedData };
            localStorage.setItem('user', JSON.stringify(newِUser));
            return { user: newِUser };
        });
    }
}));