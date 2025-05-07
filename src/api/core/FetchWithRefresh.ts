export async function fetchWithRefresh(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
    let accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
  
    init.headers = {
      ...(init.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      'Content-Type': 'application/json',
    };
  
    let response = await fetch(input, init);
  
    if (response.status === 401 && refreshToken) {
      const refreshRes = await fetch('http://localhost:8000/auth/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });
  
      if (refreshRes.ok) {
        const { access } = await refreshRes.json();
        localStorage.setItem('accessToken', access);
  
        init.headers = {
          ...(init.headers || {}),
          Authorization: `Bearer ${access}`,
        };
  
        response = await fetch(input, init);
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw new Error('Sessão expirada. Faça login novamente.');
      }
    }
  
    return response;
  }
  