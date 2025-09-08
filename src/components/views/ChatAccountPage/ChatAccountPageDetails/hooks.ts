"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getMyAccountDetailField, 
  getMyAllAccountDetails,
  type AccountDetailsFieldKey 
} from "@/lib/services/api/accountDetails";
import type { AccountDetails } from "@/lib/globalTypes/accountDetails";

// Query keys dla React Query
export const accountDetailsKeys = {
  all: ['accountDetails'] as const,
  allData: () => [...accountDetailsKeys.all, 'all'] as const,
  field: (field: AccountDetailsFieldKey) => [...accountDetailsKeys.all, 'field', field] as const,
};

// Hook do pobierania pojedynczego pola AccountDetails z React Query
export function useAccountDetailField<K extends AccountDetailsFieldKey>(field: K) {
  return useQuery({
    queryKey: accountDetailsKeys.field(field),
    queryFn: async () => {
      const result = await getMyAccountDetailField(field);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minut
    retry: 2,
  });
}

// Hook do pobierania wszystkich pól AccountDetails na raz z React Query
export function useAllAccountDetails() {
  return useQuery({
    queryKey: accountDetailsKeys.allData(),
    queryFn: async () => {
      const accountDetails = await getMyAllAccountDetails();
      return accountDetails || {};
    },
    staleTime: 5 * 60 * 1000, // 5 minut
    retry: 2,
  });
}

// Hook do aktualizacji pola AccountDetails (mutation)
export function useUpdateAccountDetail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ field, value }: { field: AccountDetailsFieldKey; value: AccountDetails[AccountDetailsFieldKey] }) => {
      // TODO: Implementacja API call do aktualizacji
      // const result = await updateMyAccountDetailField(field, value);
      // return result;
      
      // Tymczasowo zwracamy sukces
      return { success: true, field, value };
    },
    onSuccess: (data) => {
      // Invalidacja cache po pomyślnej aktualizacji
      queryClient.invalidateQueries({ queryKey: accountDetailsKeys.allData() });
      queryClient.invalidateQueries({ queryKey: accountDetailsKeys.field(data.field) });
    },
    onError: (error) => {
      console.error('Błąd podczas aktualizacji:', error);
    },
  });
}