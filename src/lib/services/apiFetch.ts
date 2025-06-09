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

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}
