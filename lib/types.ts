// Tipos que reflejan los DTOs del backend .NET (EventosSPA)

export interface ZoneResponse {
  id: string
  name: string
  price: number
  totalCapacity: number
  ticketsSold: number
  availableTickets: number
}

export interface EventResponse {
  id: string
  name: string
  description: string
  date: string
  venue: string
  isActive: boolean
  zones: ZoneResponse[]
}

export interface CreateZone {
  name: string
  price: number
  totalCapacity: number
}

export interface CreateEvent {
  name: string
  description: string
  date: string
  venue: string
  zones: CreateZone[]
}

export interface PurchaseTicket {
  eventId: string
  ticketZoneId: string
  userId: string
  quantity: number
}

export interface PurchaseResponse {
  purchaseId: string
  eventName: string
  zoneName: string
  quantity: number
  totalPrice: number
  purchaseDate: string
}

export interface EventSalesSummary {
  eventName: string
  totalTicketsSold: number
  totalRevenue: number
}

export interface Dashboard {
  totalRevenueAllTime: number
  totalTicketsSoldAllTime: number
  topEvents: EventSalesSummary[]
}

export interface AuthUser {
  id: string
  username: string
  role: string
  token: string
}
