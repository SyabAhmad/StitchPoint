const API_BASE_URL = "http://localhost:5000/api";

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    localStorage.setItem("token", data.access_token);
    return data.access_token;
  } catch (err) {
    console.error("Token refresh failed:", err);
    logout();
    throw err;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export const makeAuthenticatedRequest = async (url, options = {}) => {
  let token = localStorage.getItem("token");

  if (!token) {
    logout();
    return;
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  try {
    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      // Token might be expired, try to refresh
      try {
        token = await refreshAccessToken();
        headers.Authorization = `Bearer ${token}`;
        response = await fetch(url, { ...options, headers });
      } catch {
        // Refresh failed, logout
        logout();
        return;
      }
    }

    return response;
  } catch (err) {
    console.error("Request failed:", err);
    throw err;
  }
};
