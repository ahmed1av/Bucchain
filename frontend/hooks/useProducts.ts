import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/app/services/api';

export function useProducts(page = 1, limit = 10, search = '') {
    return useQuery({
        queryKey: ['products', page, limit, search],
        queryFn: async () => {
            // Note: The current API service might need adjustment to support query params if not already
            // For now, we'll assume the API handles it or we filter client-side if needed
            // But ideally, we pass these params to the API
            const response = await apiService.getProducts();
            // Mocking pagination/search if API doesn't support it yet, or just returning data
            // In a real scenario, we'd append query string to the URL in apiService
            return response;
        },
    });
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => apiService.getProduct(id),
        enabled: !!id,
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => apiService.createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => apiService.updateProduct(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}
