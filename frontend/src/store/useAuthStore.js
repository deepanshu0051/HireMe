import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      isAdmin: true,
      user: { name: "Admin", role: "admin" },
      token: "mock-admin-token",
      
      setAdmin: (user, token) => set({ isAdmin: true, user, token }),
      
      logout: () => set({ 
        isAdmin: false, 
        user: null, 
        token: null
      }),
    }),
    {
      name: 'admin-storage',
    }
  )
)
