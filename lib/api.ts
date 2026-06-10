import type {
  CreateEvent,
  Dashboard,
  EventResponse,
  PurchaseResponse,
  PurchaseTicket,
} from "./types"

// URL base del backend .NET. Configurable por variable de entorno.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5172"

const TOKEN_KEY = "eventos_token"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

class ApiError extends Error {}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  } catch {
    throw new ApiError(
      "No se pudo conectar con el servidor. Verifica que la API .NET esté en ejecución.",
    )
  }

  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    const message = data?.error || data?.message || `Error ${res.status}`
    throw new ApiError(message)
  }
  return data as T
}

// ---- Auth ----
export function login(email: string, password: string) {
  return request<{ token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export function register(
  username: string,
  email: string,
  password: string,
  role = "Customer",
) {
  return request<{ message: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password, role }),
  })
}

// ---- Events ----
export function getEvents(search?: string) {
  const qs = search ? `?search=${encodeURIComponent(search)}` : ""
  return request<EventResponse[]>(`/api/events${qs}`)
}

export function createEvent(payload: CreateEvent) {
  return request<{ id: string }>("/api/events", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// ---- Tickets ----
export function purchaseTickets(payload: PurchaseTicket) {
  return request<PurchaseResponse>("/api/tickets/purchase", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getDashboard() {
  return request<Dashboard>("/api/tickets/dashboard")
}

// ---- JWT helpers ----
export function decodeJwt(token: string): Record<string, any> | null {
  try {
    const payload = token.split(".")[1]
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch {
    return null
  }
}

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
const NAME_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
const ID_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"

export function parseUser(token: string) {
  const claims = decodeJwt(token)
  if (!claims) return null
  return {
    id: claims[ID_CLAIM] || claims.nameid || "",
    username: claims[NAME_CLAIM] || claims.name || claims.unique_name || "Usuario",
    role: claims[ROLE_CLAIM] || claims.role || "Customer",
    token,
  }
}
