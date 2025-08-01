import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Log errors for debugging
  if (error) {
    console.log('Auth error (expected when not logged in):', error);
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error
  };
}
