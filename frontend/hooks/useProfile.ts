import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/app/services/api';

export function useProfile() {
    return useQuery({
        queryKey: ['profile'],
        queryFn: () => apiService.getProfile(),
        retry: false, // Don't retry if 401/403
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => {
            // Assuming there's an endpoint for updating profile, if not we might need to add it to apiService
            // For now, let's assume it's a PUT to /auth/profile or similar
            return apiService.request('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });
}
