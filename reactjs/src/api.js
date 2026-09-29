// API Configuration for Local, Wi-Fi Mobile & Production Cloud Hosting

export const getApiUrl = (endpoint) => {
  // If explicitly configured via Vite env
  if (import.meta.env.VITE_API_URL) {
    const base = import.meta.env.VITE_API_URL.replace(/\/$/, "");
    return `${base}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
  }

  // If in production and served from the same domain/port
  if (import.meta.env.PROD && (window.location.port === "5000" || window.location.port === "80" || window.location.port === "443" || !window.location.port)) {
    return endpoint;
  }

  // Local development fallback - connects to same hostname on port 5000
  // (Works seamlessly for desktop 'localhost' and mobile on Wi-Fi '192.168.x.x')
  const host = window.location.hostname || "localhost";
  return `http://${host}:5000${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
};
