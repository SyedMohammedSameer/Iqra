// client/src/hooks/useAuth.ts
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'student' | 'teacher';
  profileImageUrl?: string;
  createdAt: string;
}

export function useAuth() {
  const { data: user, isLoading, error, refetch } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/user");
        return response.json();
      } catch (error: any) {
        // If unauthorized, return null instead of throwing
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const logout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      // Clear the user data from cache
      refetch();
      // Redirect to landing page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, redirect to landing page
      window.location.href = "/";
    }
  };

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    error,
    logout,
    refetch,
  };
}