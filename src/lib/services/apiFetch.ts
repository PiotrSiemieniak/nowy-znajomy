export function apiFetch(url: string, options: RequestInit){
  // const headers = {
  //   ...options.headers,
  //   ...(true && {
  //     Authorization: `${tokenType} ${token}`
  //   })
  // }

  return fetch(`/api`, { ...options })
}