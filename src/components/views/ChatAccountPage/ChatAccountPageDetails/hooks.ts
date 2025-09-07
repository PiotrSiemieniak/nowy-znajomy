"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  getMyAccountDetailField, 
  getMyAllAccountDetails,
  type AccountDetailsFieldKey 
} from "@/lib/services/api/accountDetails";
import type { AccountDetails } from "@/lib/globalTypes/accountDetails";

interface UseAccountDetailFieldResult<K extends AccountDetailsFieldKey> {
  data: AccountDetails[K] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Hook do pobierania pojedynczego pola AccountDetails
export function useAccountDetailField<K extends AccountDetailsFieldKey>(
  field: K
): UseAccountDetailFieldResult<K> {
  const [data, setData] = useState<AccountDetails[K] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchField = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getMyAccountDetailField(field);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania danych');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [field]);

  useEffect(() => {
    fetchField();
  }, [fetchField]);

  return {
    data,
    loading,
    error,
    refetch: fetchField,
  };
}

// Hook do pobierania wszystkich pól AccountDetails na raz (ZOPTYMALIZOWANY - jeden strzał do API)
export function useAllAccountDetails() {
  const [data, setData] = useState<Partial<AccountDetails>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllFields = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // JEDEN strzał do API zamiast 10 osobnych
      const accountDetails = await getMyAllAccountDetails();
      
      if (accountDetails) {
        setData(accountDetails);
      } else {
        setData({});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania danych');
      setData({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllFields();
  }, [fetchAllFields]);

  return {
    data,
    loading,
    error,
    refetch: fetchAllFields,
  };
}