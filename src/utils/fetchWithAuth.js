export async function fetchWithAuth(url, options = {}) {
  const baseOptions = { ...options };
  // Attach current access token if available
  const attachToken = (token) => {
    const headers = {
      ...(baseOptions.headers || {}),
      Authorization: `Bearer ${token}`,
    };
    return { ...baseOptions, headers };
  };

  const token = localStorage.getItem("token");
  if (token) {
    const res = await fetch(url, attachToken(token));
    if (res.status !== 401 && res.status !== 422) return res;

    // Try refresh flow once
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return res;

    const r = await fetch("http://localhost:5000/api/auth/refresh", {
      method: "POST",
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    if (!r.ok) return res;
    const json = await r.json().catch(() => ({}));
    if (json.access_token) {
      localStorage.setItem("token", json.access_token);
      // retry original request with new token
      return fetch(url, attachToken(json.access_token));
    }
    return res;
  }

  // no access token available — do a plain fetch
  return fetch(url, baseOptions);
}
