export async function apiFetch<TRequest, TResponse>(
  url: string,
  options: RequestInit = {},
  body?: TRequest
): Promise<TResponse> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(`/api${url}`, {
    ...options,
    method: options.method || 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const res = await response.json()

  try {
    return res
  } catch {
    // Zwróć zawsze obiekt z ok: false
    return {
      ok: false,
      message: res.message || 'Nieprawidłowa odpowiedź z serwera',
    } as TResponse;
  }
}