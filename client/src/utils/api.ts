export async function apiFetch<T = unknown>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (response.status === 401) {
    // Logout automático se quiser
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  // Se for DELETE ou status 204 (sem conteúdo), não tente fazer .json()
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return {} as T; // Retorna objeto vazio do tipo T
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Erro na requisição");
  }

  return data;
}
