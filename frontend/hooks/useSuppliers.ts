import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/app/services/api';

export function useSuppliers() {
    return useQuery({
        queryKey: ['suppliers'],
        queryFn: () => apiService.getSuppliers(),
    });
}
